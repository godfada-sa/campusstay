"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { getCurrentUser } from "@/lib/auth";
import { slugify } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";

export type HostelFormState = { error: string | null };

const roomSchema = z.object({
  name: z.string().trim().min(1, "Room name is required").max(80),
  capacity: z.coerce.number().int().min(1).max(8),
  price_per_semester: z.coerce.number().int().min(0).max(100000),
  utility_fee: z.coerce.number().int().min(0).max(100000),
  available_beds: z.coerce.number().int().min(0).max(200),
  description: z.string().trim().max(400).optional().default(""),
});

const imageSchema = z.object({
  url: z.string().url(),
  alt: z.string().trim().max(160).optional().default(""),
});

const hostelSchema = z.object({
  id: z.string().uuid().or(z.literal("")),
  name: z.string().trim().min(2, "Name is too short").max(90),
  slug: z
    .string()
    .trim()
    .max(90)
    .optional()
    .transform((value) => (value ? slugify(value) : "")),
  tagline: z.string().trim().max(160).optional().default(""),
  description: z.string().trim().max(4000).optional().default(""),
  area: z.string().trim().min(1, "Choose an area").max(60),
  address: z.string().trim().max(160).optional().default(""),
  landmark: z.string().trim().max(160).optional().default(""),
  gender: z.enum(["mixed", "female", "male"]),
  distance_minutes: z.coerce.number().int().min(1).max(120),
  latitude: z
    .string()
    .optional()
    .transform((value) => (value ? Number(value) : null))
    .refine((value) => value === null || Number.isFinite(value), "Latitude is invalid"),
  longitude: z
    .string()
    .optional()
    .transform((value) => (value ? Number(value) : null))
    .refine((value) => value === null || Number.isFinite(value), "Longitude is invalid"),
  contact_name: z.string().trim().max(80).optional().default(""),
  phone: z
    .string()
    .trim()
    .min(7, "Add a phone number")
    .max(24)
    .regex(/^[+0-9 ()-]+$/, "Use digits, spaces and + only"),
  whatsapp: z
    .string()
    .trim()
    .optional()
    .default("")
    .refine(
      (value) => value === "" || /^\d{9,15}$/.test(value),
      "WhatsApp should be digits only, for example 233241234567",
    ),
  contact_hours: z.string().trim().max(60).optional().default(""),
  utilities_note: z.string().trim().max(400).optional().default(""),
  verified: z.boolean(),
  featured: z.boolean(),
  published: z.boolean(),
});

function bool(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

async function requireAdminAction() {
  const current = await getCurrentUser();
  if (current?.profile?.role !== "admin") {
    return { error: "Your admin session has expired. Sign in again." as string };
  }
  return null;
}

function parseJson<T>(value: FormDataEntryValue | null, fallback: T): T {
  if (typeof value !== "string" || !value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export async function saveHostel(
  _previous: HostelFormState,
  formData: FormData,
): Promise<HostelFormState> {
  const denial = await requireAdminAction();
  if (denial) return denial;

  const parsed = hostelSchema.safeParse({
    id: String(formData.get("id") ?? ""),
    name: String(formData.get("name") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    tagline: String(formData.get("tagline") ?? ""),
    description: String(formData.get("description") ?? ""),
    area: String(formData.get("area") ?? ""),
    address: String(formData.get("address") ?? ""),
    landmark: String(formData.get("landmark") ?? ""),
    gender: String(formData.get("gender") ?? "mixed"),
    distance_minutes: String(formData.get("distance_minutes") ?? "10"),
    latitude: String(formData.get("latitude") ?? ""),
    longitude: String(formData.get("longitude") ?? ""),
    contact_name: String(formData.get("contact_name") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    whatsapp: String(formData.get("whatsapp") ?? ""),
    contact_hours: String(formData.get("contact_hours") ?? ""),
    utilities_note: String(formData.get("utilities_note") ?? ""),
    verified: bool(formData, "verified"),
    featured: bool(formData, "featured"),
    published: bool(formData, "published"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form fields." };
  }

  const rooms = z
    .array(roomSchema)
    .safeParse(parseJson<unknown>(formData.get("rooms"), []));
  if (!rooms.success) {
    return { error: rooms.error.issues[0]?.message ?? "Check the room details." };
  }

  const images = z
    .array(imageSchema)
    .safeParse(parseJson<unknown>(formData.get("images"), []));
  if (!images.success) {
    return { error: "One of the photo URLs is invalid." };
  }

  const amenitySlugs = formData
    .getAll("amenities")
    .map((value) => String(value))
    .filter(Boolean);

  const values = parsed.data;
  const slug = values.slug || slugify(values.name);
  if (!slug) return { error: "Add a name that can be used in the web address." };

  const supabase = await createClient();

  const payload = {
    name: values.name,
    slug,
    tagline: values.tagline || null,
    description: values.description,
    area: values.area,
    address: values.address,
    landmark: values.landmark || null,
    gender: values.gender,
    distance_minutes: values.distance_minutes,
    latitude: values.latitude,
    longitude: values.longitude,
    contact_name: values.contact_name || null,
    phone: values.phone,
    whatsapp: values.whatsapp || null,
    contact_hours: values.contact_hours || "7am to 8pm",
    utilities_note:
      values.utilities_note ||
      "Electricity and water are billed separately each semester.",
    verified: values.verified,
    featured: values.featured,
    published: values.published,
  };

  let hostelId = values.id;

  if (hostelId) {
    const { error } = await supabase
      .from("hostels")
      .update(payload)
      .eq("id", hostelId);
    if (error) {
      return {
        error:
          error.code === "23505"
            ? "That web address is already used by another hostel."
            : error.message,
      };
    }
  } else {
    const { data, error } = await supabase
      .from("hostels")
      .insert(payload)
      .select("id")
      .single();
    if (error || !data) {
      return {
        error:
          error?.code === "23505"
            ? "That web address is already used by another hostel."
            : (error?.message ?? "Could not save the hostel."),
      };
    }
    hostelId = data.id;
  }

  const { error: clearError } = await supabase
    .from("room_types")
    .delete()
    .eq("hostel_id", hostelId);
  if (clearError) return { error: clearError.message };

  await supabase.from("hostel_images").delete().eq("hostel_id", hostelId);
  await supabase.from("hostel_amenities").delete().eq("hostel_id", hostelId);

  if (rooms.data.length > 0) {
    const { error } = await supabase.from("room_types").insert(
      rooms.data.map((room, index) => ({
        hostel_id: hostelId,
        name: room.name,
        capacity: room.capacity,
        price_per_semester: room.price_per_semester,
        utility_fee: room.utility_fee,
        available_beds: room.available_beds,
        description: room.description || null,
        sort_order: index,
      })),
    );
    if (error) return { error: error.message };
  }

  if (images.data.length > 0) {
    const { error } = await supabase.from("hostel_images").insert(
      images.data.map((image, index) => ({
        hostel_id: hostelId,
        url: image.url,
        alt: image.alt || `${values.name} photo ${index + 1}`,
        sort_order: index,
      })),
    );
    if (error) return { error: error.message };
  }

  if (amenitySlugs.length > 0) {
    const { data: amenityRows, error: amenityError } = await supabase
      .from("amenities")
      .select("id, slug")
      .in("slug", amenitySlugs);
    if (amenityError) return { error: amenityError.message };

    const { error } = await supabase.from("hostel_amenities").insert(
      (amenityRows ?? []).map((amenity) => ({
        hostel_id: hostelId,
        amenity_id: amenity.id,
      })),
    );
    if (error) return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/hostels");
  revalidatePath(`/hostels/${slug}`);
  revalidatePath("/admin");
  revalidatePath("/admin/hostels");

  redirect(`/admin/hostels/${hostelId}?saved=1`);
}

export async function deleteHostel(formData: FormData) {
  const denial = await requireAdminAction();
  if (denial) redirect("/admin/login");

  const id = String(formData.get("id") ?? "");
  if (!id) redirect("/admin/hostels");

  const supabase = await createClient();

  const { data: images } = await supabase
    .from("hostel_images")
    .select("url")
    .eq("hostel_id", id);

  const { error } = await supabase.from("hostels").delete().eq("id", id);
  if (error) redirect(`/admin/hostels/${id}?error=${encodeURIComponent(error.message)}`);

  const paths = (images ?? [])
    .map((image) => {
      const marker = "/storage/v1/object/public/hostel-photos/";
      const index = image.url.indexOf(marker);
      return index >= 0 ? decodeURIComponent(image.url.slice(index + marker.length)) : null;
    })
    .filter((path): path is string => Boolean(path));

  if (paths.length > 0) {
    await supabase.storage.from("hostel-photos").remove(paths);
  }

  revalidatePath("/");
  revalidatePath("/hostels");
  revalidatePath("/admin");
  revalidatePath("/admin/hostels");
  redirect("/admin/hostels?deleted=1");
}
