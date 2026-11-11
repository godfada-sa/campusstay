import { phoneHref, whatsappHref } from "@/lib/format";
import type { HostelDetail } from "@/lib/queries";

export function ContactCard({ hostel }: { hostel: HostelDetail }) {
  const mapQuery = encodeURIComponent(
    hostel.latitude && hostel.longitude
      ? `${hostel.latitude},${hostel.longitude}`
      : `${hostel.address}, Cape Coast, Ghana`,
  );

  return (
    <aside className="card p-5 lg:sticky lg:top-24">
      <p className="eyebrow">Contact the caretaker</p>
      <p className="mt-2 font-display text-2xl">
        {hostel.contact_name || hostel.name}
      </p>
      <p className="mt-1 text-sm text-muted">
        Call or message before you travel. Ask about the room, the deposit and
        what the utility fee covers.
      </p>

      <div className="mt-5 space-y-2">
        <a href={phoneHref(hostel.phone)} className="btn btn-primary w-full">
          <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true">
            <path
              d="M4.2 3h3l1.2 3.2-1.6 1.2a9.3 9.3 0 0 0 5 5l1.2-1.6L16.2 12v3c0 1.1-.9 2-2 2A12.2 12.2 0 0 1 2.2 5c0-1.1.9-2 2-2Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
          {hostel.phone}
        </a>

        {hostel.whatsapp ? (
          <a
            href={whatsappHref(hostel.whatsapp, hostel.name)}
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline w-full"
          >
            Message on WhatsApp
          </a>
        ) : null}
      </div>

      <dl className="mt-5 space-y-3 border-t border-line pt-4 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-muted">Call between</dt>
          <dd className="text-right font-medium">{hostel.contact_hours}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted">Area</dt>
          <dd className="text-right font-medium">{hostel.area}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted">Walk to campus</dt>
          <dd className="text-right font-medium">{hostel.distance_minutes} min</dd>
        </div>
      </dl>

      <div className="mt-4 border-t border-line pt-4">
        <p className="text-sm leading-6 text-muted">{hostel.address}</p>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
          target="_blank"
          rel="noreferrer"
          className="btn-quiet mt-2 inline-flex text-sm font-semibold text-forest"
        >
          Open location in Maps
        </a>
      </div>

      <p className="mt-4 border-t border-line pt-3 text-xs leading-5 text-muted">
        We do not take payments or hold rooms. Confirm every detail with the
        caretaker.
      </p>
    </aside>
  );
}
