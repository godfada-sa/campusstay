-- CampusStay is a directory, not a booking platform. Students compare
-- hostels and call the caretaker. Remove the booking, payment, review and
-- saved-listing tables, and store the contact details on each hostel.

drop view if exists public.hostel_ratings;
drop view if exists public.hostel_cards;

drop table if exists public.payments cascade;
drop table if exists public.reviews cascade;
drop table if exists public.favorites cascade;
drop table if exists public.bookings cascade;

drop function if exists public.booking_code();
drop function if exists public.prepare_booking();
drop function if exists public.guard_booking_update();
drop function if exists public.sync_bed_availability();
drop function if exists public.check_review_eligibility();
drop function if exists public.refresh_hostel_rating();

alter table public.hostels
  drop column if exists rating,
  drop column if exists review_count,
  add column if not exists contact_name text,
  add column if not exists phone text not null default '',
  add column if not exists whatsapp text,
  add column if not exists contact_hours text not null default '7am to 8pm';

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
  h.phone,
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
