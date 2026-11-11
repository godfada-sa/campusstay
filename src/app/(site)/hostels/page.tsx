import type { Metadata } from "next";
import Link from "next/link";

import { HostelCard } from "@/components/hostel-card";
import { Pagination } from "@/components/pagination";
import { GENDER_OPTIONS, SORT_OPTIONS, UCC_AREAS } from "@/lib/constants";
import { searchHostels } from "@/lib/queries";

type SearchParams = Record<string, string | string[] | undefined>;

function one(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function FilterFields({
  filters,
}: {
  filters: { q: string; area: string; max: string; gender: string };
}) {
  return (
    <>
      <div>
        <label className="label" htmlFor="q">
          Search
        </label>
        <input
          id="q"
          name="q"
          type="search"
          defaultValue={filters.q}
          placeholder="Name or landmark"
          className="input"
        />
      </div>

      <div>
        <label className="label" htmlFor="area">
          Area
        </label>
        <select id="area" name="area" defaultValue={filters.area} className="select">
          <option value="">All areas</option>
          {UCC_AREAS.map((area) => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="label" htmlFor="max">
          Maximum rent
        </label>
        <select id="max" name="max" defaultValue={filters.max} className="select">
          <option value="">Any rent</option>
          <option value="3000">GH₵ 3,000</option>
          <option value="4000">GH₵ 4,000</option>
          <option value="5000">GH₵ 5,000</option>
          <option value="6000">GH₵ 6,000</option>
          <option value="7000">GH₵ 7,000</option>
        </select>
      </div>

      <fieldset>
        <legend className="label">Sharing</legend>
        <div className="space-y-2">
          {GENDER_OPTIONS.map((option) => (
            <label
              key={option.value || "any"}
              className="flex cursor-pointer items-center gap-2.5 text-sm"
            >
              <input
                type="radio"
                name="gender"
                value={option.value}
                defaultChecked={filters.gender === option.value}
                className="h-4 w-4 accent-[#1d4b3a]"
              />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>

      <button type="submit" className="btn btn-primary w-full">
        Apply filters
      </button>
    </>
  );
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const params = await searchParams;
  const area = one(params.area);
  return {
    title: area ? `Hostels in ${area}` : "Hostels around UCC",
    description: area
      ? `Hostels in ${area}, Cape Coast, with semester rent, room types and phone numbers.`
      : "Hostels around the University of Cape Coast, with semester rent, room types and phone numbers.",
  };
}

export default async function HostelsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const raw = await searchParams;
  const filters = {
    q: one(raw.q) ?? "",
    area: one(raw.area) ?? "",
    max: one(raw.max) ?? "",
    gender: one(raw.gender) ?? "",
    sort: one(raw.sort) ?? "featured",
    page: one(raw.page) ?? "1",
  };

  const { hostels, total, page, pages } = await searchHostels(filters);

  const active = [
    filters.area ? { label: filters.area, key: "area" } : null,
    filters.max ? { label: `Under GH₵ ${Number(filters.max).toLocaleString()}`, key: "max" } : null,
    filters.gender
      ? {
          label:
            GENDER_OPTIONS.find((option) => option.value === filters.gender)
              ?.label ?? filters.gender,
          key: "gender",
        }
      : null,
    filters.q ? { label: `"${filters.q}"`, key: "q" } : null,
  ].filter(Boolean) as { label: string; key: string }[];

  const hrefForSort = (sort: string) => {
    const search = new URLSearchParams();
    if (filters.q) search.set("q", filters.q);
    if (filters.area) search.set("area", filters.area);
    if (filters.max) search.set("max", filters.max);
    if (filters.gender) search.set("gender", filters.gender);
    if (sort !== "featured") search.set("sort", sort);
    const query = search.toString();
    return query ? `/hostels?${query}` : "/hostels";
  };

  return (
    <div className="wrap py-9 md:py-12">
      <nav className="text-xs text-muted" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <span className="px-2">/</span>
        <span className="text-ink">Hostels</span>
      </nav>

      <div className="mt-5 flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="eyebrow">UCC · Cape Coast</p>
          <h1 className="mt-2 text-[38px] sm:text-[46px]">
            {filters.area ? `Hostels in ${filters.area}` : "Hostels around UCC"}
          </h1>
          <p className="mt-2 text-sm text-muted">
            {total} {total === 1 ? "hostel" : "hostels"}.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[250px_1fr] lg:gap-10">
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <details className="card lg:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4 text-sm font-semibold [&::-webkit-details-marker]:hidden">
              <span>Filter hostels</span>
              <span className="text-xs font-normal text-muted">
                {active.length > 0
                  ? `${active.length} applied · Change`
                  : "Area, rent, sharing · Change"}
              </span>
            </summary>
            <form
              action="/hostels"
              method="get"
              className="space-y-4 border-t border-line p-4"
            >
              <FilterFields filters={filters} />
            </form>
          </details>

          <form
            action="/hostels"
            method="get"
            className="card hidden space-y-4 p-4 lg:block"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">Filter hostels</h2>
              <Link href="/hostels" className="text-xs text-muted hover:text-ink">
                Clear
              </Link>
            </div>

            <FilterFields filters={filters} />
          </form>

          <p className="mt-3 px-1 text-xs leading-5 text-muted">
            Prices and vacancies come from the caretaker. Confirm both on the
            phone before you travel.
          </p>
        </aside>

        <section>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
            <div className="flex flex-wrap gap-1.5">
              {active.length === 0 ? (
                <span className="text-xs text-muted">Showing all</span>
              ) : (
                active.map((item) => (
                  <span key={item.key} className="tag">
                    {item.label}
                  </span>
                ))
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
              <span className="text-muted">Sort</span>
              {SORT_OPTIONS.map((option) => (
                <Link
                  key={option.value}
                  href={hrefForSort(option.value)}
                  className={
                    filters.sort === option.value
                      ? "font-semibold text-forest underline underline-offset-2"
                      : "text-muted hover:text-ink"
                  }
                >
                  {option.label}
                </Link>
              ))}
            </div>
          </div>

          {hostels.length === 0 ? (
            <div className="card mt-6 p-8 text-center">
              <h2 className="font-display text-2xl">No hostels match that search</h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
                Try a nearby area, or raise the rent.
              </p>
              <Link href="/hostels" className="btn btn-outline mt-5">
                Clear filters
              </Link>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-3">
              {hostels.map((hostel) => (
                <HostelCard key={hostel.id} hostel={hostel} />
              ))}
            </div>
          )}

          <Pagination
            page={page}
            pages={pages}
            params={{
              q: filters.q,
              area: filters.area,
              max: filters.max,
              gender: filters.gender,
              sort: filters.sort,
            }}
          />
        </section>
      </div>
    </div>
  );
}
