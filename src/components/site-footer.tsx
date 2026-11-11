import Link from "next/link";

import { Logo } from "@/components/logo";

const areas = ["Amamoma", "Kwaprow", "Apewosika", "Abura", "Ola", "Ayensu"];

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-forest-deep text-[#e8e3d5]">
      <div className="wrap grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr] md:py-16">
        <div>
          <Logo tone="light" />
          <p className="mt-4 max-w-xs text-sm leading-6 text-[#c7c2b3]">
            Hostels around the University of Cape Coast. Call the caretaker to
            confirm the rent and the vacancy.
          </p>
        </div>

        <div>
          <p className="eyebrow !text-[#a9b5a6]">Areas</p>
          <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            {areas.map((area) => (
              <li key={area}>
                <Link
                  href={`/hostels?area=${encodeURIComponent(area)}`}
                  className="text-[#d8d3c4] transition-colors hover:text-white"
                >
                  {area}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow !text-[#a9b5a6]">Site</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link
                href="/hostels"
                className="text-[#d8d3c4] transition-colors hover:text-white"
              >
                All hostels
              </Link>
            </li>
            <li>
              <Link
                href="/#how-it-works"
                className="text-[#d8d3c4] transition-colors hover:text-white"
              >
                Before you pay
              </Link>
            </li>
            <li>
              <Link
                href="/admin/login"
                className="text-[#a9b5a6] transition-colors hover:text-white"
              >
                Admin login
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="wrap flex flex-col gap-2 py-5 text-xs text-[#9faa9c] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} CampusStay. Demo listings for UCC.</p>
          <p>Demo photos, not the actual properties.</p>
        </div>
      </div>
    </footer>
  );
}
