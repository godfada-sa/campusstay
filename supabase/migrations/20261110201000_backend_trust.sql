-- Service-role sessions have no auth.uid(). They already bypass RLS, so the
-- guard triggers should trust them while still blocking ordinary clients.

create or replace function public.guard_profile_update()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null or public.is_admin() then
    return new;
  end if;

  if new.role <> old.role then
    raise exception 'Only an admin can change a role';
  end if;
  return new;
end;
$$;

create or replace function public.guard_booking_update()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    return new;
  end if;

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

create or replace function public.check_review_eligibility()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null or public.is_admin() then
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
