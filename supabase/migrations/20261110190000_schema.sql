-- CampusStay core schema
-- A hostel directory for University of Cape Coast students.

create extension if not exists pgcrypto;

create type public.user_role as enum ('student', 'admin');
create type public.gender_preference as enum ('mixed', 'female', 'male');
create type public.booking_status as enum ('pending', 'confirmed', 'rejected', 'cancelled', 'completed');
create type public.payment_status as enum ('pending', 'paid', 'refunded');
create type public.payment_method as enum ('momo', 'bank', 'cash');
create type public.review_status as enum ('pending', 'published', 'hidden');

-- ---------------------------------------------------------------------------
-- Profiles. One row per auth user, created by trigger on sign-up.
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  phone text,
  role public.user_role not null default 'student',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    nullif(new.raw_user_meta_data ->> 'phone', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Only admins can change a role. Everyone else can edit their own details.
create or replace function public.guard_profile_update()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.role <> old.role and not public.is_admin() then
    raise exception 'Only an admin can change a role';
  end if;
  return new;
end;
$$;

create trigger profiles_guard_role
  before update on public.profiles
  for each row execute function public.guard_profile_update();

-- ---------------------------------------------------------------------------
-- Listings
-- ---------------------------------------------------------------------------
create table public.hostels (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  tagline text,
  description text not null default '',
  campus text not null default 'UCC',
  area text not null,
  address text not null default '',
  landmark text,
  gender public.gender_preference not null default 'mixed',
  distance_minutes integer not null default 10 check (distance_minutes between 1 and 120),
  latitude double precision,
  longitude double precision,
  verified boolean not null default false,
  featured boolean not null default false,
  published boolean not null default false,
  utilities_note text not null default 'Electricity and water are billed separately each semester.',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index hostels_area_idx on public.hostels (area);
create index hostels_published_idx on public.hostels (published, featured);

create trigger hostels_updated_at
  before update on public.hostels
  for each row execute function public.set_updated_at();

create table public.hostel_images (
  id uuid primary key default gen_random_uuid(),
  hostel_id uuid not null references public.hostels (id) on delete cascade,
  url text not null,
  alt text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index hostel_images_hostel_idx on public.hostel_images (hostel_id, sort_order);

create table public.room_types (
  id uuid primary key default gen_random_uuid(),
  hostel_id uuid not null references public.hostels (id) on delete cascade,
  name text not null,
  capacity integer not null default 1 check (capacity between 1 and 8),
  price_per_semester integer not null check (price_per_semester >= 0),
  utility_fee integer not null default 0 check (utility_fee >= 0),
  available_beds integer not null default 0 check (available_beds >= 0),
  description text,
  sort_order integer not null default 0
);

create index room_types_hostel_idx on public.room_types (hostel_id, sort_order);

create table public.amenities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  sort_order integer not null default 0
);

create table public.hostel_amenities (
  hostel_id uuid not null references public.hostels (id) on delete cascade,
  amenity_id uuid not null references public.amenities (id) on delete cascade,
  primary key (hostel_id, amenity_id)
);

-- ---------------------------------------------------------------------------
-- Bookings, payments, reviews, saved listings
-- ---------------------------------------------------------------------------
create or replace function public.booking_code()
returns text
language sql
volatile
as $$
  select 'CS-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6));
$$;

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  code text not null unique default public.booking_code(),
  student_id uuid not null references public.profiles (id) on delete cascade,
  hostel_id uuid not null references public.hostels (id) on delete restrict,
  room_type_id uuid not null references public.room_types (id) on delete restrict,
  move_in_date date not null,
  semester text not null,
  status public.booking_status not null default 'pending',
  amount integer not null default 0,
  notes text,
  admin_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index bookings_student_idx on public.bookings (student_id, created_at desc);
create index bookings_hostel_idx on public.bookings (hostel_id, status);
create unique index bookings_one_active_per_hostel
  on public.bookings (student_id, hostel_id)
  where status in ('pending', 'confirmed');

create trigger bookings_updated_at
  before update on public.bookings
  for each row execute function public.set_updated_at();

-- The price is always taken from the room record, never from the client.
create or replace function public.prepare_booking()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_price integer;
  v_available integer;
begin
  select rt.price_per_semester + rt.utility_fee, rt.available_beds
    into v_price, v_available
  from public.room_types rt
  join public.hostels h on h.id = rt.hostel_id
  where rt.id = new.room_type_id
    and rt.hostel_id = new.hostel_id
    and h.published = true;

  if v_price is null then
    raise exception 'That room is not open for booking';
  end if;

  if v_available < 1 then
    raise exception 'That room is fully booked';
  end if;

  new.amount := v_price;
  new.status := 'pending';
  if auth.uid() is not null then
    new.student_id := auth.uid();
  end if;
  return new;
end;
$$;

create trigger bookings_prepare
  before insert on public.bookings
  for each row execute function public.prepare_booking();

-- Students may only cancel. Everything else is an admin decision.
create or replace function public.guard_booking_update()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if public.is_admin() then
    if new.status = 'confirmed' and old.status <> 'confirmed' then
      if not exists (
        select 1 from public.room_types
        where id = new.room_type_id and available_beds > 0
      ) then
        raise exception 'No beds left in that room';
      end if;
    end if;
    return new;
  end if;

  if new.status = 'cancelled'
     and old.status in ('pending', 'confirmed')
     and new.student_id = old.student_id
     and new.hostel_id = old.hostel_id
     and new.room_type_id = old.room_type_id
     and new.amount = old.amount
     and new.code = old.code then
    new.admin_note := old.admin_note;
    return new;
  end if;

  raise exception 'Students can only cancel an active booking';
end;
$$;

create trigger bookings_guard_update
  before update on public.bookings
  for each row execute function public.guard_booking_update();

-- Keep the advertised bed count in step with confirmed bookings.
create or replace function public.sync_bed_availability()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.status = 'confirmed' and old.status <> 'confirmed' then
    update public.room_types
    set available_beds = greatest(available_beds - 1, 0)
    where id = new.room_type_id;
  elsif old.status = 'confirmed' and new.status in ('rejected', 'cancelled') then
    update public.room_types
    set available_beds = available_beds + 1
    where id = old.room_type_id;
  end if;
  return new;
end;
$$;

create trigger bookings_sync_beds
  after update of status on public.bookings
  for each row execute function public.sync_bed_availability();

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings (id) on delete cascade,
  amount integer not null check (amount >= 0),
  method public.payment_method not null default 'momo',
  reference text,
  status public.payment_status not null default 'pending',
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create index payments_booking_idx on public.payments (booking_id);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  hostel_id uuid not null references public.hostels (id) on delete cascade,
  student_id uuid not null references public.profiles (id) on delete cascade,
  booking_id uuid references public.bookings (id) on delete set null,
  rating integer not null check (rating between 1 and 5),
  body text not null check (char_length(body) between 20 and 1200),
  status public.review_status not null default 'pending',
  created_at timestamptz not null default now(),
  unique (hostel_id, student_id)
);

create index reviews_hostel_idx on public.reviews (hostel_id, status);

-- A review needs a real stay behind it.
create or replace function public.check_review_eligibility()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if public.is_admin() then
    return new;
  end if;

  if not exists (
    select 1
    from public.bookings b
    where b.student_id = new.student_id
      and b.hostel_id = new.hostel_id
      and b.status in ('confirmed', 'completed')
  ) then
    raise exception 'You need a confirmed booking before reviewing this hostel';
  end if;

  if tg_op = 'UPDATE' then
    new.status := old.status;
    new.student_id := old.student_id;
    new.hostel_id := old.hostel_id;
  end if;
  return new;
end;
$$;

create trigger reviews_eligibility
  before insert or update on public.reviews
  for each row execute function public.check_review_eligibility();

create table public.favorites (
  student_id uuid not null references public.profiles (id) on delete cascade,
  hostel_id uuid not null references public.hostels (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (student_id, hostel_id)
);

create view public.hostel_ratings
with (security_invoker = true)
as
select
  hostel_id,
  round(avg(rating)::numeric, 1) as rating,
  count(*)::integer as review_count
from public.reviews
where status = 'published'
group by hostel_id;

-- ---------------------------------------------------------------------------
-- Role helper. Security definer so policies can read profiles without
-- recursing through profiles RLS.
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ---------------------------------------------------------------------------
-- Grants. RLS still decides who sees what.
-- ---------------------------------------------------------------------------
grant usage on schema public to anon, authenticated, service_role;
grant select on public.hostels, public.hostel_images, public.room_types,
  public.amenities, public.hostel_amenities, public.reviews, public.hostel_ratings
  to anon;
grant select, insert, update, delete on public.profiles, public.hostels,
  public.hostel_images, public.room_types, public.amenities, public.hostel_amenities,
  public.bookings, public.payments, public.reviews, public.favorites
  to authenticated;
grant select on public.hostel_ratings to authenticated;
grant execute on function public.is_admin() to anon, authenticated;
