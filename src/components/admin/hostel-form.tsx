"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";

import { ImageManager } from "@/components/admin/image-manager";
import { RoomsEditor, type RoomInput } from "@/components/admin/rooms-editor";
import { SubmitButton } from "@/components/submit-button";
import { saveHostel, type HostelFormState } from "@/lib/actions/hostels";
import { UCC_AREAS } from "@/lib/constants";
import { slugify } from "@/lib/format";
import type { Amenity, HostelDetail } from "@/lib/queries";

const initial: HostelFormState = { error: null };

type Props = {
  hostel?: HostelDetail | null;
  amenities: Amenity[];
  selectedAmenities: string[];
};

export function HostelForm({ hostel, amenities, selectedAmenities }: Props) {
  const [state, formAction] = useActionState(saveHostel, initial);
  const [slugTouched, setSlugTouched] = useState(Boolean(hostel));
  const bannerRef = useRef<HTMLParagraphElement>(null);

  const [values, setValues] = useState(() => ({
    name: hostel?.name ?? "",
    slug: hostel?.slug ?? "",
    tagline: hostel?.tagline ?? "",
    description: hostel?.description ?? "",
    area: hostel?.area ?? "",
    distance_minutes: String(hostel?.distance_minutes ?? 10),
    gender: String(hostel?.gender ?? "mixed"),
    address: hostel?.address ?? "",
    landmark: hostel?.landmark ?? "",
    latitude: hostel?.latitude != null ? String(hostel.latitude) : "",
    longitude: hostel?.longitude != null ? String(hostel.longitude) : "",
    contact_name: hostel?.contact_name ?? "",
    phone: hostel?.phone ?? "",
    whatsapp: hostel?.whatsapp ?? "",
    contact_hours: hostel?.contact_hours ?? "7am to 8pm",
    utilities_note: hostel?.utilities_note ?? "",
    verified: hostel?.verified ?? false,
    featured: hostel?.featured ?? false,
    published: hostel?.published ?? true,
    amenities: selectedAmenities,
  }));

  useEffect(() => {
    if (state.error) {
      bannerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      bannerRef.current?.focus();
    }
  }, [state]);

  function set<K extends keyof typeof values>(
    key: K,
    value: (typeof values)[K],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function setName(value: string) {
    setValues((current) => ({
      ...current,
      name: value,
      slug: slugTouched ? current.slug : slugify(value),
    }));
  }

  function toggleAmenity(slug: string) {
    setValues((current) => ({
      ...current,
      amenities: current.amenities.includes(slug)
        ? current.amenities.filter((item) => item !== slug)
        : [...current.amenities, slug],
    }));
  }

  const rooms: RoomInput[] = (hostel?.room_types ?? []).map((room) => ({
    name: room.name,
    capacity: room.capacity,
    price_per_semester: room.price_per_semester,
    utility_fee: room.utility_fee,
    available_beds: room.available_beds,
    description: room.description ?? "",
  }));

  const images = (hostel?.hostel_images ?? []).map((image) => ({
    url: image.url,
    alt: image.alt ?? "",
  }));

  const areas: string[] = [...UCC_AREAS];
  if (values.area && !areas.includes(values.area)) areas.unshift(values.area);

  return (
    <form
      action={formAction}
      onReset={(event) => event.preventDefault()}
      className="mt-8 space-y-8"
    >
      <input type="hidden" name="id" value={hostel?.id ?? ""} />

      {state.error ? (
        <p
          ref={bannerRef}
          role="alert"
          tabIndex={-1}
          className="border border-[#d9b4a6] bg-[#f8eae4] px-4 py-3 text-sm text-[#7e2f13]"
        >
          {state.error}
        </p>
      ) : null}

      <section className="card p-5 md:p-6">
        <h2 className="font-display text-2xl">The basics</h2>
        <p className="mt-1 text-sm text-muted">
          Use the name and area students will recognise.
        </p>

        <div className="mt-5 field-grid">
          <div className="sm:col-span-2">
            <label className="label" htmlFor="name">
              Hostel name
            </label>
            <input
              id="name"
              name="name"
              required
              maxLength={90}
              value={values.name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Adom Court"
              className="input"
            />
          </div>

          <div>
            <label className="label" htmlFor="slug">
              Web address
            </label>
            <div className="flex items-center">
              <span className="flex h-11 items-center border border-r-0 border-line bg-paper-deep px-2.5 text-xs text-muted">
                /hostels/
              </span>
              <input
                id="slug"
                name="slug"
                maxLength={90}
                value={values.slug}
                onChange={(event) => {
                  setSlugTouched(true);
                  set("slug", event.target.value);
                }}
                placeholder="adom-court"
                className="input !rounded-l-none"
              />
            </div>
            <p className="field-hint">Leave blank to build it from the name.</p>
          </div>

          <div>
            <label className="label" htmlFor="area">
              Area
            </label>
            <select
              id="area"
              name="area"
              required
              value={values.area}
              onChange={(event) => set("area", event.target.value)}
              className="select"
            >
              <option value="" disabled>
                Choose an area
              </option>
              {areas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="label" htmlFor="tagline">
              One-line summary
            </label>
            <input
              id="tagline"
              name="tagline"
              maxLength={160}
              value={values.tagline}
              onChange={(event) => set("tagline", event.target.value)}
              placeholder="Quiet rooms off the Amamoma road"
              className="input"
            />
            <p className="field-hint">
              Keep it factual. This line appears under the hostel name.
            </p>
          </div>

          <div className="sm:col-span-2">
            <label className="label" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              maxLength={4000}
              value={values.description}
              onChange={(event) => set("description", event.target.value)}
              rows={6}
              placeholder="Describe the compound, the water supply, the gate and anything a student should know before visiting."
              className="textarea"
            />
            <p className="field-hint">
              Leave a blank line between paragraphs. No emoji or marketing claims.
            </p>
          </div>
        </div>
      </section>

      <section className="card p-5 md:p-6">
        <h2 className="font-display text-2xl">Location</h2>
        <p className="mt-1 text-sm text-muted">
          Walk time is an estimate from the hostel to the nearest campus gate.
        </p>

        <div className="mt-5 field-grid">
          <div>
            <label className="label" htmlFor="distance_minutes">
              Walk to campus (minutes)
            </label>
            <input
              id="distance_minutes"
              name="distance_minutes"
              type="number"
              min={1}
              max={120}
              required
              value={values.distance_minutes}
              onChange={(event) => set("distance_minutes", event.target.value)}
              className="input"
            />
          </div>

          <div>
            <label className="label" htmlFor="gender">
              Who can stay
            </label>
            <select
              id="gender"
              name="gender"
              value={values.gender}
              onChange={(event) => set("gender", event.target.value)}
              className="select"
            >
              <option value="mixed">Mixed</option>
              <option value="female">Female only</option>
              <option value="male">Male only</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="label" htmlFor="address">
              Address
            </label>
            <input
              id="address"
              name="address"
              maxLength={160}
              value={values.address}
              onChange={(event) => set("address", event.target.value)}
              placeholder="Amamoma, Cape Coast"
              className="input"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="label" htmlFor="landmark">
              Landmark
            </label>
            <input
              id="landmark"
              name="landmark"
              maxLength={160}
              value={values.landmark}
              onChange={(event) => set("landmark", event.target.value)}
              placeholder="Behind the Amamoma market"
              className="input"
            />
          </div>

          <div>
            <label className="label" htmlFor="latitude">
              Latitude (optional)
            </label>
            <input
              id="latitude"
              name="latitude"
              inputMode="decimal"
              value={values.latitude}
              onChange={(event) => set("latitude", event.target.value)}
              placeholder="5.1155"
              className="input"
            />
          </div>

          <div>
            <label className="label" htmlFor="longitude">
              Longitude (optional)
            </label>
            <input
              id="longitude"
              name="longitude"
              inputMode="decimal"
              value={values.longitude}
              onChange={(event) => set("longitude", event.target.value)}
              placeholder="-1.2890"
              className="input"
            />
          </div>
        </div>
      </section>

      <section className="card p-5 md:p-6">
        <h2 className="font-display text-2xl">Contact</h2>
        <p className="mt-1 text-sm text-muted">
          This is the number students will call.
        </p>

        <div className="mt-5 field-grid">
          <div>
            <label className="label" htmlFor="contact_name">
              Caretaker name
            </label>
            <input
              id="contact_name"
              name="contact_name"
              maxLength={80}
              value={values.contact_name}
              onChange={(event) => set("contact_name", event.target.value)}
              placeholder="Ama Mensah"
              className="input"
            />
          </div>

          <div>
            <label className="label" htmlFor="phone">
              Phone number
            </label>
            <input
              id="phone"
              name="phone"
              required
              maxLength={24}
              value={values.phone}
              onChange={(event) => set("phone", event.target.value)}
              placeholder="+233 24 123 4567"
              className="input"
            />
          </div>

          <div>
            <label className="label" htmlFor="whatsapp">
              WhatsApp number
            </label>
            <input
              id="whatsapp"
              name="whatsapp"
              maxLength={20}
              value={values.whatsapp}
              onChange={(event) => set("whatsapp", event.target.value)}
              placeholder="233241234567"
              className="input"
            />
            <p className="field-hint">Digits only, with the country code.</p>
          </div>

          <div>
            <label className="label" htmlFor="contact_hours">
              Call between
            </label>
            <input
              id="contact_hours"
              name="contact_hours"
              maxLength={60}
              value={values.contact_hours}
              onChange={(event) => set("contact_hours", event.target.value)}
              placeholder="7am to 8pm"
              className="input"
            />
          </div>
        </div>
      </section>

      <section className="card p-5 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl">Rooms and rent</h2>
            <p className="mt-1 text-sm text-muted">
              Rent is per semester in Ghana cedis. List each room type once.
            </p>
          </div>
        </div>
        <div className="mt-5">
          <RoomsEditor initial={rooms} />
        </div>

        <div className="mt-6 border-t border-line pt-5">
          <label className="label" htmlFor="utilities_note">
            Utilities note
          </label>
          <textarea
            id="utilities_note"
            name="utilities_note"
            maxLength={400}
            rows={3}
            value={values.utilities_note}
            onChange={(event) => set("utilities_note", event.target.value)}
            placeholder="Electricity is metered and shared by the room."
            className="textarea"
          />
        </div>
      </section>

      <section className="card p-5 md:p-6">
        <h2 className="font-display text-2xl">Amenities</h2>
        <p className="mt-1 text-sm text-muted">
          Tick only what the caretaker has confirmed.
        </p>

        <fieldset className="mt-5">
          <legend className="sr-only">Amenities</legend>
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {amenities.map((amenity) => (
              <label
                key={amenity.id}
                className="flex cursor-pointer items-center gap-2.5 border border-line bg-paper/40 px-3 py-2.5 text-sm"
              >
                <input
                  type="checkbox"
                  name="amenities"
                  value={amenity.slug}
                  checked={values.amenities.includes(amenity.slug)}
                  onChange={() => toggleAmenity(amenity.slug)}
                  className="h-4 w-4 accent-[#1d4b3a]"
                />
                {amenity.name}
              </label>
            ))}
          </div>
        </fieldset>
      </section>

      <section className="card p-5 md:p-6">
        <h2 className="font-display text-2xl">Photos</h2>
        <p className="mt-1 text-sm text-muted">
          The first photo becomes the cover image. Upload real photos of the
          hostel, not stock images.
        </p>
        <div className="mt-5">
          <ImageManager initial={images} />
        </div>
      </section>

      <section className="card p-5 md:p-6">
        <h2 className="font-display text-2xl">Visibility</h2>
        <div className="mt-4 space-y-3">
          <label className="flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              name="published"
              checked={values.published}
              onChange={(event) => set("published", event.target.checked)}
              className="mt-1 h-4 w-4 accent-[#1d4b3a]"
            />
            <span>
              <span className="font-medium">Published</span>
              <span className="block text-xs text-muted">
                Students can see this hostel.
              </span>
            </span>
          </label>

          <label className="flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              name="verified"
              checked={values.verified}
              onChange={(event) => set("verified", event.target.checked)}
              className="mt-1 h-4 w-4 accent-[#1d4b3a]"
            />
            <span>
              <span className="font-medium">Verified</span>
              <span className="block text-xs text-muted">
                Rent and contact details were checked with the caretaker.
              </span>
            </span>
          </label>

          <label className="flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              name="featured"
              checked={values.featured}
              onChange={(event) => set("featured", event.target.checked)}
              className="mt-1 h-4 w-4 accent-[#1d4b3a]"
            />
            <span>
              <span className="font-medium">Featured</span>
              <span className="block text-xs text-muted">
                Show this hostel on the homepage.
              </span>
            </span>
          </label>
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-3 border-t border-line pt-5">
        <SubmitButton pendingLabel="Saving…">
          {hostel ? "Save changes" : "Create hostel"}
        </SubmitButton>
        <Link href="/admin/hostels" className="btn btn-outline">
          Cancel
        </Link>
        {hostel ? (
          <Link
            href={`/hostels/${hostel.slug}`}
            target="_blank"
            className="text-sm font-medium text-forest underline underline-offset-4"
          >
            View public page
          </Link>
        ) : null}
      </div>
    </form>
  );
}
