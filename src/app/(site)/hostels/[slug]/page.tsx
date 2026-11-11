import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ContactCard } from "@/components/contact-card";
import { Gallery } from "@/components/gallery";
import { HostelCard } from "@/components/hostel-card";
import { InterestButton } from "@/components/interest-button";
import { getCurrentUser } from "@/lib/auth";
import {
  cedis,
  genderLabel,
  phoneHref,
  walkLabel,
} from "@/lib/format";
import {
  getHostelBySlug,
  getSimilarHostels,
  hasHostelInterest,
  type HostelDetail,
} from "@/lib/queries";

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const hostel = await getHostelBySlug(slug);
  if (!hostel) return { title: "Hostel not found" };

  const cover = hostel.hostel_images[0]?.url;
  return {
    title: `${hostel.name}, ${hostel.area}`,
    description: `${hostel.tagline ?? hostel.name} in ${hostel.area}, Cape Coast. Semester rent, room types and the caretaker's number.`,
    openGraph: cover
      ? {
          images: [{ url: cover, alt: hostel.name }],
        }
      : undefined,
  };
}

function amenityNames(hostel: HostelDetail) {
  return hostel.hostel_amenities
    .map((row) => row.amenities?.name)
    .filter((name): name is string => Boolean(name));
}

export default async function HostelDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const hostel = await getHostelBySlug(slug);
  if (!hostel) notFound();

  const rooms = hostel.room_types;
  const cheapest = rooms.length
    ? Math.min(...rooms.map((room) => room.price_per_semester))
    : 0;
  const utilities = rooms.length
    ? Math.min(...rooms.map((room) => room.utility_fee))
    : 0;
  const beds = rooms.reduce((sum, room) => sum + room.available_beds, 0);
  const amenities = amenityNames(hostel);
  const current = await getCurrentUser();
  const [similar, interested] = await Promise.all([
    getSimilarHostels(hostel.area, hostel.slug),
    current
      ? hasHostelInterest(hostel.id, current.user.id)
      : Promise.resolve(false),
  ]);

  const description = hostel.description
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);

  return (
    <div className="pb-24 lg:pb-0">
      <div className="wrap py-8 md:py-10">
        <nav className="text-xs text-muted" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-ink">
            Home
          </Link>
          <span className="px-2">/</span>
          <Link href="/hostels" className="hover:text-ink">
            Hostels
          </Link>
          <span className="px-2">/</span>
          <span className="text-ink">{hostel.name}</span>
        </nav>

        <div className="mt-5 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="tag">{hostel.area}</span>
              <span className="tag">{genderLabel(hostel.gender)}</span>
              {hostel.verified ? (
                <span className="tag tag-verified">Verified listing</span>
              ) : (
                <span className="tag tag-warn">Not yet verified</span>
              )}
              {beds === 0 ? <span className="tag tag-warn">Full</span> : null}
            </div>

            <h1 className="mt-3 text-[40px] leading-[1.02] sm:text-[52px]">
              {hostel.name}
            </h1>
            <p className="mt-3 max-w-2xl text-[17px] leading-7 text-muted">
              {hostel.tagline}
            </p>
            <p className="mt-2 text-sm text-muted">
              {walkLabel(hostel.distance_minutes)} to campus · {hostel.address}
            </p>
          </div>

          <div className="text-left sm:text-right">
            <p className="text-[11px] font-semibold tracking-[0.12em] text-muted uppercase">
              Rent from
            </p>
            <p className="font-display text-[34px] leading-none">
              {cedis(cheapest)}
            </p>
            <p className="mt-1 text-xs text-muted">
              per semester, plus {cedis(utilities)} utilities
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-12">
          <div className="min-w-0">
            <Gallery
              images={hostel.hostel_images.map((image) => ({
                id: image.id,
                url: image.url,
                alt: image.alt,
              }))}
              name={hostel.name}
            />

            <section className="mt-10">
              <h2 className="text-[30px]">About this hostel</h2>
              <div className="prose-copy mt-4 max-w-2xl text-[15px] leading-7 text-[#3d443b]">
                {description.length > 0 ? (
                  description.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
                ) : (
                  <p>The caretaker has not added a description yet.</p>
                )}
              </div>

              <div className="mt-6 grid gap-px border border-line bg-line sm:grid-cols-3">
                <div className="bg-card p-4">
                  <p className="eyebrow">Walk to campus</p>
                  <p className="mt-1 font-display text-2xl">
                    {hostel.distance_minutes} min
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    {hostel.landmark ?? hostel.area}
                  </p>
                </div>
                <div className="bg-card p-4">
                  <p className="eyebrow">Beds free</p>
                  <p className="mt-1 font-display text-2xl tabular-nums">{beds}</p>
                  <p className="mt-1 text-xs text-muted">
                    Across {rooms.length} room {rooms.length === 1 ? "type" : "types"}
                  </p>
                </div>
                <div className="bg-card p-4">
                  <p className="eyebrow">Utilities</p>
                  <p className="mt-1 font-display text-2xl">{cedis(utilities)}</p>
                  <p className="mt-1 text-xs text-muted">From, per semester</p>
                </div>
              </div>
            </section>

            <section className="mt-10">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <h2 className="text-[30px]">Rooms and rent</h2>
                <p className="text-xs text-muted">
                  Ask the caretaker which rooms are still free.
                </p>
              </div>

              <div className="mt-4 overflow-x-auto border border-line">
                <table className="w-full min-w-[620px] border-collapse text-left text-sm">
                  <thead className="bg-paper-deep/70 text-[11px] tracking-[0.08em] text-muted uppercase">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Room</th>
                      <th className="px-4 py-3 font-semibold">Sleeps</th>
                      <th className="px-4 py-3 text-right font-semibold">Rent</th>
                      <th className="px-4 py-3 text-right font-semibold">Utilities</th>
                      <th className="px-4 py-3 text-right font-semibold">Total</th>
                      <th className="px-4 py-3 text-right font-semibold">Beds free</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line bg-card">
                    {rooms.map((room) => (
                      <tr key={room.id}>
                        <td className="px-4 py-3">
                          <p className="font-medium">{room.name}</p>
                          {room.description ? (
                            <p className="mt-0.5 max-w-xs text-xs leading-5 text-muted">
                              {room.description}
                            </p>
                          ) : null}
                        </td>
                        <td className="px-4 py-3 tabular-nums">{room.capacity}</td>
                        <td className="px-4 py-3 text-right tabular-nums">
                          {cedis(room.price_per_semester)}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums">
                          {cedis(room.utility_fee)}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold tabular-nums">
                          {cedis(room.price_per_semester + room.utility_fee)}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums">
                          {room.available_beds > 0 ? (
                            room.available_beds
                          ) : (
                            <span className="text-xs text-clay">Full</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="mt-3 max-w-2xl text-xs leading-5 text-muted">
                {hostel.utilities_note} Pay the caretaker directly. We do not
                collect rent or deposits.
              </p>
            </section>

            <section className="mt-10">
              <h2 className="text-[30px]">Amenities</h2>
              {amenities.length === 0 ? (
                <p className="mt-3 text-sm text-muted">
                  No amenities have been listed yet.
                </p>
              ) : (
                <ul className="mt-4 grid gap-x-6 gap-y-3 border-t border-line pt-4 sm:grid-cols-2">
                  {amenities.map((amenity) => (
                    <li key={amenity} className="flex items-start gap-2.5 text-sm">
                      <svg
                        viewBox="0 0 16 16"
                        className="mt-1 h-3.5 w-3.5 shrink-0 text-forest"
                        aria-hidden="true"
                      >
                        <path
                          d="M2.5 8.5 6 12l7.5-8"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {amenity}
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="mt-10 grid gap-6 border-t border-line pt-6 sm:grid-cols-2">
              <div>
                <h2 className="text-[26px]">Getting there</h2>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {hostel.address}
                  {hostel.landmark ? (
                    <>
                      <br />
                      {hostel.landmark}
                    </>
                  ) : null}
                </p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    hostel.latitude && hostel.longitude
                      ? `${hostel.latitude},${hostel.longitude}`
                      : `${hostel.address}, Cape Coast, Ghana`,
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-block text-sm font-semibold text-forest underline underline-offset-4"
                >
                  Open in Google Maps
                </a>
              </div>

              <div>
                <h2 className="text-[26px]">Ask before you pay</h2>
                <ul className="mt-2 space-y-2 text-sm leading-6 text-muted">
                  <li>Is the utility fee fixed or metered?</li>
                  <li>How many people share the bathroom?</li>
                  <li>Does water run every day in the dry season?</li>
                  <li>What deposit is refundable, and when?</li>
                </ul>
              </div>
            </section>
          </div>

          <ContactCard hostel={hostel} />
        </div>

        <section className="mt-10 flex flex-col gap-5 border border-line bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-[26px]">Is this one on your list?</h2>
            <p className="mt-1 max-w-xl text-sm leading-6 text-muted">
              Tap once so we know students are asking about it. You still call
              the caretaker to check the room.
            </p>
          </div>
          <InterestButton
            hostelId={hostel.id}
            initiallyInterested={interested}
          />
        </section>

        {similar.length > 0 ? (
          <section className="mt-16 border-t border-line pt-10">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h2 className="text-[30px]">Other hostels in {hostel.area}</h2>
              <Link
                href={`/hostels?area=${encodeURIComponent(hostel.area)}`}
                className="text-sm font-semibold text-forest underline underline-offset-4"
              >
                See all in {hostel.area}
              </Link>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
              {similar.map((item) => (
                <HostelCard key={item.id} hostel={item} />
              ))}
            </div>
          </section>
        ) : null}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-card px-4 py-3 lg:hidden">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.1em] text-muted uppercase">
              Rent from
            </p>
            <p className="font-semibold">{cedis(cheapest)} / semester</p>
          </div>
          <a href={phoneHref(hostel.phone)} className="btn btn-primary">
            Call {hostel.phone}
          </a>
        </div>
      </div>
    </div>
  );
}
