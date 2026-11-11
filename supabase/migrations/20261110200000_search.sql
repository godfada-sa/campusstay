-- Denormalised ratings and a read view for the search page.
alter table public.hostels
  add column rating numeric(2, 1) not null default 0,
  add column review_count integer not null default 0;

create or replace function public.refresh_hostel_rating()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_hostel uuid;
begin
  v_hostel := coalesce(new.hostel_id, old.hostel_id);

  update public.hostels h
  set rating = coalesce((
        select round(avg(r.rating)::numeric, 1)
        from public.reviews r
        where r.hostel_id = v_hostel and r.status = 'published'
      ), 0),
      review_count = (
        select count(*)::integer
        from public.reviews r
        where r.hostel_id = v_hostel and r.status = 'published'
      )
  where h.id = v_hostel;

  return null;
end;
$$;

create trigger reviews_refresh_rating
  after insert or update or delete on public.reviews
  for each row execute function public.refresh_hostel_rating();

create view public.hostel_cards
with (security_invoker = true)
as
select
  h.id,
  h.name,
  h.slug,
  h.tagline,
  h.area,
  h.campus,
  h.gender,
  h.distance_minutes,
  h.landmark,
  h.verified,
  h.featured,
  h.rating,
  h.review_count,
  h.created_at,
  coalesce((
    select min(rt.price_per_semester) from public.room_types rt
    where rt.hostel_id = h.id
  ), 0) as price_from,
  coalesce((
    select min(rt.utility_fee) from public.room_types rt
    where rt.hostel_id = h.id
  ), 0) as utilities_from,
  coalesce((
    select sum(rt.available_beds) from public.room_types rt
    where rt.hostel_id = h.id
  ), 0) as beds_available,
  (
    select rt.name from public.room_types rt
    where rt.hostel_id = h.id
    order by rt.price_per_semester
    limit 1
  ) as cheapest_room,
  (
    select i.url from public.hostel_images i
    where i.hostel_id = h.id
    order by i.sort_order, i.created_at
    limit 1
  ) as cover_url,
  (
    select count(*)::integer from public.hostel_images i
    where i.hostel_id = h.id
  ) as image_count
from public.hostels h
where h.published = true;

grant select on public.hostel_cards to anon, authenticated;
grant select on public.hostels to anon, authenticated;
revoke execute on function public.refresh_hostel_rating() from public, anon, authenticated;
