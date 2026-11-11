import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DeleteHostelButton } from "@/components/admin/delete-hostel-button";
import { HostelForm } from "@/components/admin/hostel-form";
import { getAllAmenities, getHostelForEdit } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Edit hostel",
  robots: { index: false, follow: false },
};

type Params = Promise<{ id: string }>;
type SearchParams = Promise<{ saved?: string }>;

export default async function EditHostelPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { id } = await params;
  const query = await searchParams;

  const [hostel, amenities] = await Promise.all([
    getHostelForEdit(id),
    getAllAmenities(),
  ]);

  if (!hostel) notFound();

  const selectedAmenities = hostel.hostel_amenities
    .map((row) => row.amenities?.slug)
    .filter((slug): slug is string => Boolean(slug));

  return (
    <div>
      <nav className="text-xs text-muted" aria-label="Breadcrumb">
        <Link href="/admin/hostels" className="hover:text-ink">
          Hostels
        </Link>
        <span className="px-2">/</span>
        <span className="text-ink">{hostel.name}</span>
      </nav>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Edit hostel</p>
          <h1 className="mt-2 text-[36px] leading-tight">{hostel.name}</h1>
          <p className="mt-2 text-sm text-muted">
            {hostel.published
              ? "Students can see this hostel."
              : "Only you can see this hostel."}
          </p>
        </div>
        <DeleteHostelButton id={hostel.id} name={hostel.name} />
      </div>

      {query.saved ? (
        <p className="mt-6 border border-[#b9cdbf] bg-[#eaf1ea] px-4 py-3 text-sm text-[#1f4a37]">
          Saved. The public page is up to date.
        </p>
      ) : null}

      <HostelForm
        hostel={hostel}
        amenities={amenities}
        selectedAmenities={selectedAmenities}
      />
    </div>
  );
}
