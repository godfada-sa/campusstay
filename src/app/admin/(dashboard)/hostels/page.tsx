import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { cedis, formatDate } from "@/lib/format";
import { getAdminHostels } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Admin hostels",
  robots: { index: false, follow: false },
};

type SearchParams = Promise<{ q?: string; status?: string; deleted?: string }>;

export default async function AdminHostelsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const search = params.q?.trim() ?? "";
  const status = params.status ?? "all";

  const all = await getAdminHostels(search);
  const hostels = all.filter((hostel) => {
    if (status === "draft") return !hostel.published;
    if (status === "live") return hostel.published;
    if (status === "unverified") return !hostel.verified;
    return true;
  });

  const tabs = [
    { value: "all", label: `All (${all.length})` },
    {
      value: "live",
      label: `Live (${all.filter((hostel) => hostel.published).length})`,
    },
    {
      value: "draft",
      label: `Drafts (${all.filter((hostel) => !hostel.published).length})`,
    },
    {
      value: "unverified",
      label: `Unverified (${all.filter((hostel) => !hostel.verified).length})`,
    },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">UCC · Cape Coast</p>
          <h1 className="mt-2 text-[36px] leading-tight">Hostels</h1>
          <p className="mt-2 text-sm text-muted">
            {all.length} {all.length === 1 ? "hostel" : "hostels"}.
          </p>
        </div>
        <Link href="/admin/hostels/new" className="btn btn-primary">
          Add a hostel
        </Link>
      </div>

      {params.deleted ? (
        <p className="mt-6 border border-[#b9cdbf] bg-[#eaf1ea] px-4 py-3 text-sm text-[#1f4a37]">
          Listing deleted.
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-3">
        <div className="flex flex-wrap gap-3 text-sm">
          {tabs.map((tab) => {
            const active = status === tab.value;
            const query = new URLSearchParams();
            if (search) query.set("q", search);
            if (tab.value !== "all") query.set("status", tab.value);
            const href = query.toString()
              ? `/admin/hostels?${query.toString()}`
              : "/admin/hostels";
            return (
              <Link
                key={tab.value}
                href={href}
                className={
                  active
                    ? "font-semibold text-forest underline underline-offset-4"
                    : "text-muted hover:text-ink"
                }
              >
                {tab.label}
              </Link>
            );
          })}
        </div>

        <form action="/admin/hostels" method="get" className="flex gap-2">
          {status !== "all" ? (
            <input type="hidden" name="status" value={status} />
          ) : null}
          <input
            name="q"
            type="search"
            defaultValue={search}
            placeholder="Search name or area"
            className="input !min-h-9 !w-44 !py-1.5 text-sm sm:!w-56"
          />
          <button type="submit" className="btn btn-outline">
            Search
          </button>
        </form>
      </div>

      {hostels.length === 0 ? (
        <div className="card mt-6 p-8 text-center">
          <p className="font-display text-2xl">Nothing here yet</p>
          <p className="mt-2 text-sm text-muted">
            {search
              ? `No hostel matches "${search}".`
              : "Add the first hostel."}
          </p>
          <Link href="/admin/hostels/new" className="btn btn-primary mt-5">
            Add a hostel
          </Link>
        </div>
      ) : (
        <ul className="mt-5 divide-y divide-line border-y border-line">
          {hostels.map((hostel) => (
            <li
              key={hostel.id}
              className="flex flex-wrap items-center gap-4 py-4 lg:flex-nowrap"
            >
              <div className="relative h-16 w-20 shrink-0 overflow-hidden border border-line bg-paper-deep">
                {hostel.image ? (
                  <Image
                    src={hostel.image}
                    alt=""
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                ) : (
                  <span className="flex h-full items-center justify-center text-[10px] text-muted">
                    No photo
                  </span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{hostel.name}</p>
                <p className="truncate text-xs text-muted">
                  {hostel.area} · {cedis(hostel.price)} · {hostel.beds}{" "}
                  {hostel.beds === 1 ? "bed" : "beds"} · {hostel.interests}{" "}
                  interested
                </p>
                <p className="mt-1 text-[11px] text-muted">
                  Updated {formatDate(hostel.updated_at)}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {hostel.featured ? <span className="tag">Featured</span> : null}
                {hostel.verified ? (
                  <span className="tag tag-verified">Verified</span>
                ) : (
                  <span className="tag tag-muted">Unverified</span>
                )}
                {hostel.published ? (
                  <span className="tag tag-verified">Live</span>
                ) : (
                  <span className="tag tag-warn">Draft</span>
                )}
              </div>

              <div className="flex gap-3 sm:ml-2">
                <Link
                  href={`/admin/hostels/${hostel.id}`}
                  className="btn btn-outline"
                >
                  Edit
                </Link>
                <Link
                  href={`/hostels/${hostel.slug}`}
                  target="_blank"
                  className="btn btn-quiet self-center"
                >
                  View
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
