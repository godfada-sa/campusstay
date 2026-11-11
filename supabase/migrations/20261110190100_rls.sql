-- Row level security for CampusStay.
-- Public pages read published listings. Students own their bookings, reviews
-- and saved listings. Admins get full access through public.is_admin().

alter table public.profiles enable row level security;
alter table public.hostels enable row level security;
alter table public.hostel_images enable row level security;
alter table public.room_types enable row level security;
alter table public.amenities enable row level security;
alter table public.hostel_amenities enable row level security;
alter table public.bookings enable row level security;
alter table public.payments enable row level security;
alter table public.reviews enable row level security;
alter table public.favorites enable row level security;

-- Profiles ------------------------------------------------------------------
create policy profiles_select_own on public.profiles
  for select to authenticated
  using (id = auth.uid());

create policy profiles_select_admin on public.profiles
  for select to authenticated
  using (public.is_admin());

create policy profiles_update_own on public.profiles
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

create policy profiles_admin_write on public.profiles
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Listings ------------------------------------------------------------------
create policy hostels_select_public on public.hostels
  for select to anon, authenticated
  using (published = true);

create policy hostels_select_admin on public.hostels
  for select to authenticated
  using (public.is_admin());

create policy hostels_admin_write on public.hostels
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy hostel_images_select_public on public.hostel_images
  for select to anon, authenticated
  using (exists (
    select 1 from public.hostels h
    where h.id = hostel_images.hostel_id and h.published = true
  ));

create policy hostel_images_select_admin on public.hostel_images
  for select to authenticated
  using (public.is_admin());

create policy hostel_images_admin_write on public.hostel_images
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy room_types_select_public on public.room_types
  for select to anon, authenticated
  using (exists (
    select 1 from public.hostels h
    where h.id = room_types.hostel_id and h.published = true
  ));

create policy room_types_select_admin on public.room_types
  for select to authenticated
  using (public.is_admin());

create policy room_types_admin_write on public.room_types
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy amenities_select_public on public.amenities
  for select to anon, authenticated
  using (true);

create policy amenities_admin_write on public.amenities
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy hostel_amenities_select_public on public.hostel_amenities
  for select to anon, authenticated
  using (exists (
    select 1 from public.hostels h
    where h.id = hostel_amenities.hostel_id and h.published = true
  ));

create policy hostel_amenities_select_admin on public.hostel_amenities
  for select to authenticated
  using (public.is_admin());

create policy hostel_amenities_admin_write on public.hostel_amenities
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Bookings ------------------------------------------------------------------
create policy bookings_select_own on public.bookings
  for select to authenticated
  using (student_id = auth.uid());

create policy bookings_select_admin on public.bookings
  for select to authenticated
  using (public.is_admin());

create policy bookings_insert_own on public.bookings
  for insert to authenticated
  with check (student_id = auth.uid() and status = 'pending');

create policy bookings_update_own on public.bookings
  for update to authenticated
  using (student_id = auth.uid())
  with check (student_id = auth.uid());

create policy bookings_admin_write on public.bookings
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Payments ------------------------------------------------------------------
create policy payments_select_own on public.payments
  for select to authenticated
  using (exists (
    select 1 from public.bookings b
    where b.id = payments.booking_id and b.student_id = auth.uid()
  ));

create policy payments_admin_write on public.payments
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Reviews -------------------------------------------------------------------
create policy reviews_select_public on public.reviews
  for select to anon, authenticated
  using (status = 'published');

create policy reviews_select_own on public.reviews
  for select to authenticated
  using (student_id = auth.uid());

create policy reviews_select_admin on public.reviews
  for select to authenticated
  using (public.is_admin());

create policy reviews_insert_own on public.reviews
  for insert to authenticated
  with check (student_id = auth.uid() and status = 'pending');

create policy reviews_update_own on public.reviews
  for update to authenticated
  using (student_id = auth.uid())
  with check (student_id = auth.uid());

create policy reviews_admin_write on public.reviews
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Favorites -----------------------------------------------------------------
create policy favorites_select_own on public.favorites
  for select to authenticated
  using (student_id = auth.uid());

create policy favorites_insert_own on public.favorites
  for insert to authenticated
  with check (student_id = auth.uid());

create policy favorites_delete_own on public.favorites
  for delete to authenticated
  using (student_id = auth.uid());

create policy favorites_admin_write on public.favorites
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Trigger functions are not part of the public API.
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.guard_profile_update() from public, anon, authenticated;
revoke execute on function public.prepare_booking() from public, anon, authenticated;
revoke execute on function public.guard_booking_update() from public, anon, authenticated;
revoke execute on function public.sync_bed_availability() from public, anon, authenticated;
revoke execute on function public.check_review_eligibility() from public, anon, authenticated;
