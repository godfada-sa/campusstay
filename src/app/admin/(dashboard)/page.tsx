import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { cedis, formatDate } from "@/lib/format";
import { getAdminHostels, getAdminStats } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Admin overview",
  robots: { index: false, follow: false },
};

export default async function AdminOverviewPage() {
  const [stats, hostels] = await Promise.all([
    getAdminStats(),
    getAdminHostels(),
  ]);

  const recent = hostels.slice(0, 5);
  const drafts = hostels.filter((hostel) => !hostel.published);

  const cards = [
    { label: "Hostels", value: stats.total, note: "Every hostel you have added" },
    { label: "Published", value: stats.published, note: "Students can see these" },
    { label: "Verified", value: stats.verified, note: "Checked with the caretaker" },
    { label: "Areas", value: stats.areas, note: "Neighbourhoods with hostels" },
    { label: "Interests", value: stats.interests, note: "Taps from students" },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Admin</p>
          <h1 className="mt-2 text-[36px] leading-tight">Overview</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
            Check that rent, phone numbers and vacancies match what the
            caretaker told you.
          </p>
        </div>
        <Link href="/admin/hostels/new" className="btn btn-primary">
          Add a hostel
        </Link>
      </div>

      <dl className="mt-8 grid grid-cols-2 gap-px border border-line bg-line md:grid-cols-3 lg:grid-cols-5">
        {cards.map((card) => (
          <div key={card.label} className="bg-card p-4 md:p-5">
            <dt className="text-[11px] font-semibold tracking-[0.12em] text-muted uppercase">
              {card.label}
            </dt>
            <dd className="mt-1 font-display text-[34px] leading-none tabular-nums">
              {card.value}
            </dd>
            <p className="mt-2 text-xs leading-5 text-muted">{card.note}</p>
          </div>
        ))}
      </dl>

      {drafts.length > 0 ? (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border border-[#e0c9a6] bg-[#f7eddd] px-4 py-3">
          <p className="text-sm text-[#7a511e]">
            {drafts.length} {drafts.length === 1 ? "listing is" : "listings are"}{" "}
            unpublished and hidden from students.
          </p>
          <Link
            href="/admin/hostels?status=draft"
            className="text-sm font-semibold text-[#7a511e] underline underline-offset-4"
          >
            Review drafts
          </Link>
        </div>
      ) : null}

      <section className="mt-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-display text-2xl">Recently updated</h2>
          <Link
            href="/admin/hostels"
            className="text-sm font-semibold text-forest underline underline-offset-4"
          >
            All hostels
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="card mt-4 p-6 text-sm text-muted">
            No hostels yet.{" "}
            <Link href="/admin/hostels/new" className="text-forest underline">
              Add the first one
            </Link>
            .
          </div>
        ) : (
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {recent.map((hostel) => (
              <li key={hostel.id}>
                <Link
                  href={`/admin/hostels/${hostel.id}`}
                  className="flex items-center gap-4 py-3 transition-colors hover:bg-card"
                >
                  <div className="relative h-12 w-16 shrink-0 overflow-hidden border border-line bg-paper-deep">
                    {hostel.image ? (
                      <Image
                        src={hostel.image}
                        alt=""
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{hostel.name}</p>
                    <p className="truncate text-xs text-muted">
                      {hostel.area} · updated {formatDate(hostel.updated_at)}
                    </p>
                  </div>
                  <div className="hidden text-right sm:block">
                    <p className="text-sm font-medium">{cedis(hostel.price)}</p>
                    <p className="text-xs text-muted">
                      {hostel.beds} {hostel.beds === 1 ? "bed" : "beds"} free
                    </p>
                  </div>
                  <span
                    className={`tag ${
                      hostel.published ? "tag-verified" : "tag-warn"
                    }`}
                  >
                    {hostel.published ? "Live" : "Draft"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
