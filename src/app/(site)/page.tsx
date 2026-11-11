import Image from "next/image";
import Link from "next/link";

import { HostelCard } from "@/components/hostel-card";
import { SearchForm } from "@/components/search-form";
import { cedis, walkLabel } from "@/lib/format";
import {
  getAreaCounts,
  getFeaturedHostels,
  getStats,
} from "@/lib/queries";

export default async function HomePage() {
  const [featured, areas, stats] = await Promise.all([
    getFeaturedHostels(3),
    getAreaCounts(),
    getStats(),
  ]);

  const lead = featured[0];

  return (
    <>
      <section className="border-b border-line">
        <div className="wrap grid gap-10 py-12 md:py-16 lg:grid-cols-[1.06fr_0.94fr] lg:items-center lg:gap-16 lg:py-20">
          <div>
            <p className="eyebrow">University of Cape Coast · Off-campus</p>
            <h1 className="mt-4 max-w-[15ch] text-[42px] leading-[1.03] sm:text-[54px] lg:text-[62px]">
              Know what a room costs before you travel.
            </h1>
            <p className="mt-5 max-w-[52ch] text-[17px] leading-7 text-muted">
              Hostels around UCC, with the semester rent, the walk to campus and
              a number to call. Ring ahead, then go and see the room.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/hostels" className="btn btn-primary">
                See all {stats.listings} hostels
              </Link>
              <Link href="#how-it-works" className="btn btn-outline">
                How it works
              </Link>
            </div>

            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-line pt-5">
              <div>
                <dt className="text-[11px] font-semibold tracking-[0.12em] text-muted uppercase">
                  Hostels
                </dt>
                <dd className="mt-1 font-display text-3xl tabular-nums">
                  {stats.listings}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold tracking-[0.12em] text-muted uppercase">
                  Verified
                </dt>
                <dd className="mt-1 font-display text-3xl tabular-nums">
                  {stats.verified}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold tracking-[0.12em] text-muted uppercase">
                  Beds free
                </dt>
                <dd className="mt-1 font-display text-3xl tabular-nums">
                  {stats.beds}
                </dd>
              </div>
            </dl>
          </div>

          {lead ? (
            <figure className="relative">
              <Link
                href={`/hostels/${lead.slug}`}
                className="group block overflow-hidden border border-line bg-paper-deep"
              >
                <div className="relative aspect-[5/4]">
                  {lead.cover_url ? (
                    <Image
                      src={lead.cover_url}
                      alt=""
                      fill
                      priority
                      sizes="(min-width: 1024px) 520px, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-muted">
                      Photos coming soon
                    </div>
                  )}
                </div>
              </Link>
              <figcaption className="mt-2 flex items-start justify-between gap-4 text-xs text-muted">
                <span>
                  {lead.name}, {lead.area}. {walkLabel(lead.distance_minutes)} to
                  campus.
                </span>
                <span className="shrink-0 tabular-nums">
                  from {cedis(lead.price_from)}
                </span>
              </figcaption>
            </figure>
          ) : null}
        </div>
      </section>

      <section className="border-b border-line bg-paper-deep/45">
        <div className="wrap py-6">
          <SearchForm compact />
        </div>
      </section>

      <section id="areas" className="wrap scroll-mt-24 py-14 md:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Where students live</p>
            <h2 className="mt-2 text-[34px] sm:text-[40px]">Areas around campus</h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-muted">
            Most students live in these communities. Walk times come from the
            caretaker, so check the route yourself the first time.
          </p>
        </div>

        <div className="mt-7 grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-3 lg:grid-cols-4">
          {areas.map((area) => (
            <Link
              key={area.area}
              href={`/hostels?area=${encodeURIComponent(area.area)}`}
              className="group flex items-baseline justify-between gap-3 bg-card px-4 py-4 transition-colors hover:bg-paper-deep"
            >
              <span className="font-medium">{area.area}</span>
              <span className="text-xs tabular-nums text-muted">
                {area.count} {area.count === 1 ? "hostel" : "hostels"}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-card">
        <div className="wrap py-14 md:py-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Around campus</p>
              <h2 className="mt-2 text-[34px] sm:text-[40px]">
                Rooms around campus
              </h2>
            </div>
            <Link
              href="/hostels"
              className="text-sm font-semibold text-forest underline decoration-[#b9c3b5] underline-offset-4 hover:decoration-forest"
            >
              View all hostels
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
            {featured.map((hostel) => (
              <HostelCard key={hostel.id} hostel={hostel} />
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="wrap scroll-mt-24 py-14 md:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <p className="eyebrow">Before you pay</p>
            <h2 className="mt-2 text-[34px] sm:text-[40px]">
              What to do before you pay
            </h2>
            <p className="mt-4 max-w-sm text-[15px] leading-7 text-muted">
              We do not hold rooms or take payments. You speak to the caretaker
              and arrange everything with them.
            </p>
          </div>

          <ol className="divide-y divide-line border-y border-line">
            {[
              {
                title: "Start with the area",
                body: "Pick the community you want to live in. Visit at the time of day you will normally be walking back.",
              },
              {
                title: "Check the room and the rent",
                body: "Each room type shows the semester rent, the utility fee and how many people share it. Ask whether water and electricity are included.",
              },
              {
                title: "Call the caretaker",
                body: "Use the number on the listing. Ask about the deposit, water supply and the exact route before you travel.",
              },
            ].map((step, index) => (
              <li key={step.title} className="flex gap-5 py-6">
                <span className="w-7 shrink-0 pt-1 font-display text-2xl text-clay tabular-nums">
                  {index + 1}
                </span>
                <div>
                  <h3 className="text-[21px] leading-tight">{step.title}</h3>
                  <p className="mt-1.5 max-w-xl text-sm leading-6 text-muted">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-forest text-[#efeadd]">
        <div className="wrap grid gap-8 py-12 md:grid-cols-[1fr_auto] md:items-center md:py-14">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.14em] text-[#a9b5a6] uppercase">
              Before you pay a deposit
            </p>
            <h2 className="mt-2 max-w-2xl text-[30px] sm:text-[36px]">
              Visit in daylight and check the water, the meter and the gate.
            </h2>
          </div>
          <Link href="/hostels" className="btn bg-[#f7f2e5] text-forest-deep hover:bg-white">
            See the hostels
          </Link>
        </div>
      </section>
    </>
  );
}
