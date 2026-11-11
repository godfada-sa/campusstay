import type { Metadata } from "next";
import Link from "next/link";

import { HostelForm } from "@/components/admin/hostel-form";
import { getAllAmenities } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Add a hostel",
  robots: { index: false, follow: false },
};

export default async function NewHostelPage() {
  const amenities = await getAllAmenities();

  return (
    <div>
      <nav className="text-xs text-muted" aria-label="Breadcrumb">
        <Link href="/admin/hostels" className="hover:text-ink">
          Hostels
        </Link>
        <span className="px-2">/</span>
        <span className="text-ink">New</span>
      </nav>

      <div className="mt-4">
        <p className="eyebrow">New hostel</p>
        <h1 className="mt-2 text-[36px] leading-tight">Add a hostel</h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
          Fill in what the caretaker confirmed. Leave it unpublished until the
          phone number, rent and photos are correct.
        </p>
      </div>

      <HostelForm amenities={amenities} selectedAmenities={[]} />
    </div>
  );
}
