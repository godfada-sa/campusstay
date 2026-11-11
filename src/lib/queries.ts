import type { Database } from "@/lib/database.types";
import { createClient } from "@/lib/supabase/server";

export type HostelRow = Database["public"]["Tables"]["hostels"]["Row"];
export type RoomType = Database["public"]["Tables"]["room_types"]["Row"];
export type HostelImage = Database["public"]["Tables"]["hostel_images"]["Row"];
export type Amenity = Database["public"]["Tables"]["amenities"]["Row"];
type Gender = Database["public"]["Enums"]["gender_preference"];
type HostelCardRow = Database["public"]["Views"]["hostel_cards"]["Row"];

export type HostelCard = {
  id: string;
  name: string;
  slug: string;
  area: string;
  campus: string;
  tagline: string;
  landmark: string | null;
  phone: string | null;
  gender: Gender;
  distance_minutes: number;
  featured: boolean;
  verified: boolean;
  cover_url: string | null;
  price_from: number;
  utilities_from: number;
  beds_available: number;
  image_count: number;
  cheapest_room: string | null;
  created_at: string;
};

function toHostelCard(row: HostelCardRow): HostelCard {
  return {
    id: row.id ?? "",
    name: row.name ?? "",
    slug: row.slug ?? "",
    area: row.area ?? "",
    campus: row.campus ?? "UCC",
    tagline: row.tagline ?? "",
    landmark: row.landmark,
    phone: row.phone,
    gender: row.gender ?? "mixed",
    distance_minutes: row.distance_minutes ?? 0,
    featured: row.featured ?? false,
    verified: row.verified ?? false,
    cover_url: row.cover_url,
    price_from: row.price_from ?? 0,
    utilities_from: row.utilities_from ?? 0,
    beds_available: row.beds_available ?? 0,
    image_count: row.image_count ?? 0,
    cheapest_room: row.cheapest_room,
    created_at: row.created_at ?? new Date(0).toISOString(),
  };
}

export type HostelDetail = HostelRow & {
  hostel_images: HostelImage[];
  room_types: RoomType[];
  hostel_amenities: { amenities: Amenity | null }[];
};

export type SearchFilters = {
  q?: string;
  area?: string;
  max?: string;
  gender?: string;
  sort?: string;
  page?: string;
};

const PER_PAGE = 9;

export async function searchHostels(filters: SearchFilters) {
  const supabase = await createClient();
  const page = Math.max(1, Number(filters.page) || 1);
  const from = (page - 1) * PER_PAGE;

  let query = supabase
    .from("hostel_cards")
    .select("*", { count: "exact" })
    .range(from, from + PER_PAGE - 1);

  if (filters.q) {
    const term = filters.q.replace(/[,%()"\\]/g, "").trim();
    if (term) {
      query = query.or(
        `name.ilike.%${term}%,area.ilike.%${term}%,landmark.ilike.%${term}%,tagline.ilike.%${term}%`,
      );
    }
  }

  if (filters.area) query = query.eq("area", filters.area);
  if (filters.gender) {
    query = query.eq("gender", filters.gender as Gender);
  }

  const max = Number(filters.max);
  if (Number.isFinite(max) && max > 0) query = query.lte("price_from", max);

  switch (filters.sort) {
    case "price-asc":
      query = query.order("price_from", { ascending: true });
      break;
    case "price-desc":
      query = query.order("price_from", { ascending: false });
      break;
    case "distance":
      query = query.order("distance_minutes", { ascending: true });
      break;
    case "newest":
      query = query.order("created_at", { ascending: false });
      break;
    default:
      query = query
        .order("featured", { ascending: false })
        .order("price_from", { ascending: true });
  }

  const { data, error, count } = await query;
  if (error) throw error;

  return {
    hostels: (data ?? []).map(toHostelCard),
    total: count ?? 0,
    page,
    perPage: PER_PAGE,
    pages: Math.max(1, Math.ceil((count ?? 0) / PER_PAGE)),
  };
}

export async function getFeaturedHostels(limit = 3) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("hostel_cards")
    .select("*")
    .eq("featured", true)
    .order("price_from", { ascending: true })
    .limit(limit);
  if (error) throw error;
  return (data ?? []).map(toHostelCard);
}

export async function getRecentHostels(limit = 3) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("hostel_cards")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []).map(toHostelCard);
}

export async function getHostelBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("hostels")
    .select(
      `
      *,
      hostel_images (*),
      room_types (*),
      hostel_amenities ( amenities (*) )
    `,
    )
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;

  const hostel = data as unknown as HostelDetail;
  hostel.hostel_images = [...(hostel.hostel_images ?? [])].sort(
    (a, b) => a.sort_order - b.sort_order,
  );
  hostel.room_types = [...(hostel.room_types ?? [])].sort(
    (a, b) => a.sort_order - b.sort_order || a.price_per_semester - b.price_per_semester,
  );
  hostel.hostel_amenities = [...(hostel.hostel_amenities ?? [])].sort((a, b) =>
    (a.amenities?.name ?? "").localeCompare(b.amenities?.name ?? ""),
  );

  return hostel;
}

export async function hasHostelInterest(hostelId: string, userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("hostel_interests")
    .select("id")
    .eq("hostel_id", hostelId)
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return Boolean(data);
}

export async function getSimilarHostels(
  area: string,
  excludeSlug: string,
  limit = 3,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("hostel_cards")
    .select("*")
    .eq("area", area)
    .neq("slug", excludeSlug)
    .order("price_from", { ascending: true })
    .limit(limit);
  if (error) throw error;
  return (data ?? []).map(toHostelCard);
}

export async function getStats() {
  const supabase = await createClient();
  const [listings, verified, beds, areas] = await Promise.all([
    supabase.from("hostel_cards").select("*", { count: "exact", head: true }),
    supabase
      .from("hostel_cards")
      .select("*", { count: "exact", head: true })
      .eq("verified", true),
    supabase.from("hostel_cards").select("beds_available"),
    supabase.from("hostel_cards").select("area"),
  ]);

  const bedTotal = (beds.data ?? []).reduce(
    (sum, row) => sum + (row.beds_available ?? 0),
    0,
  );
  const areaTotal = new Set((areas.data ?? []).map((row) => row.area)).size;

  return {
    listings: listings.count ?? 0,
    verified: verified.count ?? 0,
    beds: bedTotal,
    areas: areaTotal,
  };
}

export async function getAreaCounts() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("hostel_cards").select("area");
  if (error) throw error;

  const counts = new Map<string, number>();
  for (const row of data ?? []) {
    if (!row.area) continue;
    counts.set(row.area, (counts.get(row.area) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([area, count]) => ({ area, count }))
    .sort((a, b) => b.count - a.count || a.area.localeCompare(b.area));
}

export async function getAdminStats() {
  const supabase = await createClient();
  const [total, published, verified, areas, interests] = await Promise.all([
    supabase.from("hostels").select("*", { count: "exact", head: true }),
    supabase
      .from("hostels")
      .select("*", { count: "exact", head: true })
      .eq("published", true),
    supabase
      .from("hostels")
      .select("*", { count: "exact", head: true })
      .eq("verified", true),
    supabase.from("hostels").select("area"),
    supabase
      .from("hostel_interests")
      .select("*", { count: "exact", head: true }),
  ]);

  return {
    total: total.count ?? 0,
    published: published.count ?? 0,
    verified: verified.count ?? 0,
    areas: new Set((areas.data ?? []).map((row) => row.area)).size,
    interests: interests.count ?? 0,
  };
}

export type AdminHostel = {
  id: string;
  name: string;
  slug: string;
  area: string;
  published: boolean;
  verified: boolean;
  featured: boolean;
  updated_at: string;
  image: string | null;
  price: number;
  beds: number;
  interests: number;
};

export async function getAdminHostels(search = "") {
  const supabase = await createClient();
  let query = supabase
    .from("hostels")
    .select(
      `
      id, name, slug, area, published, verified, featured, updated_at,
      hostel_images ( url, sort_order ),
      room_types ( price_per_semester, available_beds )
    `,
    )
    .order("updated_at", { ascending: false });

  if (search) {
    const term = search.replace(/[,%()"\\]/g, "").trim();
    if (term) query = query.or(`name.ilike.%${term}%,area.ilike.%${term}%`);
  }

  const [{ data, error }, { data: counts }] = await Promise.all([
    query,
    supabase
      .from("hostel_interest_counts")
      .select("hostel_id, interest_count"),
  ]);
  if (error) throw error;

  const interestByHostel = new Map(
    (counts ?? []).map((row) => [row.hostel_id, row.interest_count]),
  );

  return (data ?? []).map((row) => {
    const images = [...(row.hostel_images ?? [])].sort(
      (a, b) => a.sort_order - b.sort_order,
    );
    const rooms = row.room_types ?? [];
    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      area: row.area,
      published: row.published,
      verified: row.verified,
      featured: row.featured,
      updated_at: row.updated_at,
      image: images[0]?.url ?? null,
      price: rooms.length
        ? Math.min(...rooms.map((room) => room.price_per_semester))
        : 0,
      beds: rooms.reduce((sum, room) => sum + (room.available_beds ?? 0), 0),
      interests: interestByHostel.get(row.id) ?? 0,
    } satisfies AdminHostel;
  });
}

export async function getHostelForEdit(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("hostels")
    .select(
      `
      *,
      hostel_images (*),
      room_types (*),
      hostel_amenities ( amenities (*) )
    `,
    )
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;

  const hostel = data as unknown as HostelDetail;
  hostel.hostel_images = [...(hostel.hostel_images ?? [])].sort(
    (a, b) => a.sort_order - b.sort_order,
  );
  hostel.room_types = [...(hostel.room_types ?? [])].sort(
    (a, b) => a.sort_order - b.sort_order,
  );
  return hostel;
}

export async function getAllAmenities() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("amenities")
    .select("*")
    .order("sort_order");
  if (error) throw error;
  return (data ?? []) as Amenity[];
}

