import type { Database } from "@/lib/database.types";

export type Gender = Database["public"]["Enums"]["gender_preference"];

export function cedis(value: number | null | undefined) {
  if (value === null || value === undefined) return "—";
  return `GH₵ ${Math.round(value).toLocaleString("en-GH")}`;
}

export function genderLabel(gender: Gender | string | null | undefined) {
  if (gender === "female") return "Female only";
  if (gender === "male") return "Male only";
  return "Mixed";
}

export function walkLabel(minutes: number) {
  if (minutes < 2) return "Under 2 min walk";
  return `${minutes} min walk`;
}

export function formatDate(value: string | Date | null | undefined) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function phoneHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function whatsappHref(whatsapp: string | null, hostelName: string) {
  const digits = (whatsapp ?? "").replace(/[^\d]/g, "");
  const text = encodeURIComponent(
    `Hello, I saw ${hostelName} on CampusStay. Is there a room available this semester?`,
  );
  return `https://wa.me/${digits}?text=${text}`;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function initials(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}
