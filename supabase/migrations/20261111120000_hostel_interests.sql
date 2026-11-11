-- Interest taps. One signed-in student can tap a hostel once; the unique
-- constraint makes repeat submissions harmless. Only admins can read all rows.

create table public.hostel_interests (
  id uuid primary key default gen_random_uuid(),
  hostel_id uuid not null references public.hostels (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint hostel_interests_hostel_user_key unique (hostel_id, user_id)
);

create index hostel_interests_hostel_id_idx
  on public.hostel_interests (hostel_id);

create index hostel_interests_created_at_idx
  on public.hostel_interests (created_at desc);

alter table public.hostel_interests enable row level security;

grant select, insert on public.hostel_interests to authenticated;

create policy hostel_interests_insert_own on public.hostel_interests
  for insert to authenticated
  with check (
    user_id = auth.uid()
    and exists (
      select 1
      from public.hostels h
      where h.id = hostel_interests.hostel_id
        and h.published = true
    )
  );

create policy hostel_interests_select_own on public.hostel_interests
  for select to authenticated
  using (user_id = auth.uid());

create policy hostel_interests_select_admin on public.hostel_interests
  for select to authenticated
  using (public.is_admin());

-- Counts are only granted to authenticated users. The view runs with the
-- caller's rights, so students only see their own rows and admins see all.
create view public.hostel_interest_counts
with (security_invoker = true)
as
select hostel_id, count(*)::integer as interest_count
from public.hostel_interests
group by hostel_id;

grant select on public.hostel_interest_counts to authenticated;
