import Image from "next/image";
import Link from "next/link";

import { cedis, genderLabel, initials, walkLabel } from "@/lib/format";
import type { HostelCard as HostelCardRow } from "@/lib/queries";

function CoverFallback({ name }: { name: string }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-paper-deep text-muted">
      <svg viewBox="0 0 48 48" className="h-9 w-9" aria-hidden="true">
        <path
          d="M7 23 L24 8 L41 23 M11 21 V40 H37 V21"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="text-xs font-semibold tracking-[0.12em] uppercase">
        {initials(name)}
      </span>
    </div>
  );
}

export function HostelCard({ hostel }: { hostel: HostelCardRow }) {
  return (
    <article className="group card overflow-hidden transition-colors duration-200 hover:border-[#b9b3a2]">
      <Link href={`/hostels/${hostel.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-paper-deep">
          {hostel.cover_url ? (
            <Image
              src={hostel.cover_url}
              alt=""
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
            />
          ) : (
            <CoverFallback name={hostel.name} />
          )}

          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            {hostel.verified ? (
              <span className="tag tag-verified">Verified</span>
            ) : null}
            {hostel.beds_available === 0 ? (
              <span className="tag tag-warn">Full</span>
            ) : null}
          </div>
        </div>

        <div className="p-3 sm:p-4">
          <div className="flex items-start justify-between gap-2">
            <p className="eyebrow !text-[10px] sm:!text-[11px]">
              {hostel.area} · {walkLabel(hostel.distance_minutes)}
            </p>
            <p className="hidden shrink-0 text-[11px] text-muted sm:block">
              {genderLabel(hostel.gender)}
            </p>
          </div>

          <h3 className="mt-2 font-display text-[19px] leading-tight sm:text-[25px]">
            {hostel.name}
          </h3>
          <p className="mt-1 line-clamp-2 text-[13px] leading-5 text-muted sm:text-sm sm:leading-6">
            {hostel.tagline}
          </p>

          <div className="mt-3 flex flex-col gap-1 border-t border-line pt-2.5 sm:mt-4 sm:flex-row sm:items-end sm:justify-between sm:gap-3 sm:pt-3">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.12em] text-muted uppercase">
                Rent from
              </p>
              <p className="mt-0.5 text-[14px] font-semibold sm:text-[15px]">
                {cedis(hostel.price_from)}
                <span className="ml-1 text-[11px] font-normal text-muted sm:text-xs">
                  / semester
                </span>
              </p>
            </div>
            <p className="text-[11px] text-muted sm:text-xs">
              {hostel.beds_available > 0
                ? `${hostel.beds_available} beds free`
                : "Full"}
            </p>
          </div>
        </div>
      </Link>
    </article>
  );
}
