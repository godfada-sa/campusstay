-- Hostel photos live in one public bucket. Anyone can look, only admins write.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'hostel-photos',
  'hostel-photos',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "hostel photos are public" on storage.objects;
create policy "hostel photos are public" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'hostel-photos');

drop policy if exists "admins upload hostel photos" on storage.objects;
create policy "admins upload hostel photos" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'hostel-photos' and public.is_admin());

drop policy if exists "admins update hostel photos" on storage.objects;
create policy "admins update hostel photos" on storage.objects
  for update to authenticated
  using (bucket_id = 'hostel-photos' and public.is_admin())
  with check (bucket_id = 'hostel-photos' and public.is_admin());

drop policy if exists "admins delete hostel photos" on storage.objects;
create policy "admins delete hostel photos" on storage.objects
  for delete to authenticated
  using (bucket_id = 'hostel-photos' and public.is_admin());
