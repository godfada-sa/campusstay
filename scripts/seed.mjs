// Seeds the CampusStay demo: users, listings, rooms, bookings, payments and
// reviews. Safe to run more than once. Destructive only for demo records.
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const root = process.cwd();
const env = Object.fromEntries(
  (await readFile(path.join(root, ".env.local"), "utf8"))
    .split(/\r?\n/)
    .filter((line) => line && !line.startsWith("#") && line.includes("="))
    .map((line) => {
      const i = line.indexOf("=");
      return [line.slice(0, i).trim(), line.slice(i + 1).trim()];
    }),
);

const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const uid = (seed) => {
  const h = createHash("sha256").update(seed).digest("hex");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-4${h.slice(13, 16)}-8${h.slice(17, 20)}-${h.slice(20, 32)}`;
};

if (!env.ADMIN_EMAIL || !env.ADMIN_PASSWORD) {
  throw new Error(
    "Set ADMIN_EMAIL and ADMIN_PASSWORD in .env.local before running the seed.",
  );
}

const people = [
  {
    key: "admin",
    email: env.ADMIN_EMAIL,
    password: env.ADMIN_PASSWORD,
    full_name: env.ADMIN_NAME ?? "CampusStay Admin",
    phone: env.ADMIN_PHONE ?? "",
    role: "admin",
  },
];

const amenities = [
  ["Wi-Fi", "wifi"],
  ["Study desk", "study-desk"],
  ["Ensuite bathroom", "ensuite"],
  ["Shared kitchen", "shared-kitchen"],
  ["Water storage", "water-storage"],
  ["Standby power", "standby-power"],
  ["24-hour security", "security"],
  ["Laundry area", "laundry"],
  ["Parking", "parking"],
  ["Reading room", "reading-room"],
  ["Fenced compound", "fenced"],
  ["Waste collection", "waste"],
];

const hostels = [
  {
    slug: "adom-court",
    name: "Adom Court",
    tagline: "Quiet rooms off the Amamoma road",
    area: "Amamoma",
    address: "Amamoma Road, Cape Coast",
    landmark: "Opposite the Amamoma junction",
    gender: "mixed",
    distance_minutes: 7,
    latitude: 5.1362,
    longitude: -1.2799,
    verified: true,
    featured: true,
    utilities_note: "GH₵600 per semester covers water and electricity. Meters are read once a month.",
    description:
      "Seven minutes on foot from the science block, set back from the main road. Every room has a bed, a study desk and a wardrobe. The shared kitchen has gas burners, a fridge and a separate washing area. A 2,000 litre tank keeps water running during dry weeks.",
    images: ["exterior-1", "interior-1", "interior-4"],
    amenities: ["wifi", "study-desk", "ensuite", "shared-kitchen", "water-storage", "security", "fenced", "waste"],
    rooms: [
      ["Single room", 1, 6200, 600, 3, "One person. Ensuite bathroom and a private balcony."],
      ["Double room", 2, 4300, 500, 6, "Two single beds, two desks and a shared bathroom."],
      ["Four in a room", 4, 2900, 450, 8, "Four beds with individual wardrobes. Shared bathroom on the corridor."],
    ],
  },
  {
    slug: "greenfield-lodge",
    name: "Greenfield Lodge",
    tagline: "New block with a reading room",
    area: "Kwaprow",
    address: "Kwaprow Main Road, Cape Coast",
    landmark: "Two buildings past the Kwaprow taxi rank",
    gender: "mixed",
    distance_minutes: 12,
    latitude: 5.1271,
    longitude: -1.2861,
    verified: true,
    featured: true,
    utilities_note: "Utility fee is fixed for the semester and reviewed in January.",
    description:
      "Built in 2023 with wide corridors and good cross ventilation. There is a reading room on the ground floor and a covered area for drying clothes when it rains. Security is at the gate through the night and visitors sign in at the desk.",
    images: ["exterior-2", "interior-2", "interior-6"],
    amenities: ["wifi", "study-desk", "ensuite", "shared-kitchen", "standby-power", "security", "reading-room", "parking"],
    rooms: [
      ["Single room", 1, 5400, 550, 4, "One person with an ensuite bathroom and a desk by the window."],
      ["Double room", 2, 3900, 500, 2, "Two beds, two desks and a shared bathroom."],
      ["Three in a room", 3, 3100, 480, 6, "Three beds with separate wardrobes."],
    ],
  },
  {
    slug: "apewosika-heights",
    name: "Apewosika Heights",
    tagline: "Female only, close to the north gate",
    area: "Apewosika",
    address: "Apewosika Road, Cape Coast",
    landmark: "Behind the Apewosika community clinic",
    gender: "female",
    distance_minutes: 9,
    latitude: 5.1338,
    longitude: -1.2912,
    verified: true,
    featured: false,
    utilities_note: "Water is included. Electricity is split by meter reading each month.",
    description:
      "A female-only house with a resident caretaker. Rooms are furnished with a bed, desk and wardrobe, and each floor has a shared bathroom with hot water points. The compound is walled and the gate closes at 10pm.",
    images: ["exterior-3", "interior-3", "interior-5"],
    amenities: ["wifi", "study-desk", "shared-kitchen", "water-storage", "security", "laundry", "fenced"],
    rooms: [
      ["Single room", 1, 7000, 650, 1, "One person with a private bathroom and a reading corner."],
      ["Double room", 2, 4800, 550, 3, "Two beds with a shared bathroom and balcony access."],
    ],
  },
  {
    slug: "nana-aba-hostel",
    name: "Nana Aba Hostel",
    tagline: "Simple rooms, short walk to lectures",
    area: "Abura",
    address: "Abura Market Road, Cape Coast",
    landmark: "Next to the Abura lorry station",
    gender: "female",
    distance_minutes: 15,
    latitude: 5.1198,
    longitude: -1.2751,
    verified: true,
    featured: false,
    utilities_note: "Utilities are shared equally by the six rooms in the house.",
    description:
      "A small house with six rooms and a shared kitchen. The landlord lives next door and handles repairs the same week. The lorry station is a two minute walk, which makes the trip to campus easy on rainy mornings.",
    images: ["exterior-7", "interior-1"],
    amenities: ["study-desk", "shared-kitchen", "water-storage", "laundry", "fenced", "waste"],
    rooms: [
      ["Double room", 2, 3600, 400, 2, "Two beds, one desk and a shared bathroom."],
      ["Three in a room", 3, 2800, 350, 3, "Three beds with a shared bathroom and kitchen access."],
    ],
  },
  {
    slug: "hilltop-residence",
    name: "Hilltop Residence",
    tagline: "Male only, five minutes from Ola",
    area: "Ola",
    address: "Ola Estate Road, Cape Coast",
    landmark: "Up the hill from Ola junction",
    gender: "male",
    distance_minutes: 6,
    latitude: 5.1389,
    longitude: -1.2822,
    verified: false,
    featured: false,
    utilities_note: "Prepaid meters. Top up at the shop by the junction.",
    description:
      "A walk-up block with eight rooms and a shared veranda. The rooms are basic but dry, and the compound drains well in the rainy season. There is space to park two cars behind the gate.",
    images: ["exterior-5", "interior-6"],
    amenities: ["study-desk", "shared-kitchen", "water-storage", "standby-power", "parking", "fenced"],
    rooms: [
      ["Single room", 1, 5800, 600, 2, "One person with a private bathroom."],
      ["Double room", 2, 4100, 500, 4, "Two beds and a shared bathroom."],
      ["Four in a room", 4, 2700, 400, 0, "Four beds. Currently full for this semester."],
    ],
  },
  {
    slug: "sankofa-hostel",
    name: "Sankofa Hostel",
    tagline: "Furnished rooms with standby power",
    area: "Amamoma",
    address: "Amamoma Estate, Cape Coast",
    landmark: "Beside the Amamoma community centre",
    gender: "mixed",
    distance_minutes: 10,
    latitude: 5.1349,
    longitude: -1.2811,
    verified: true,
    featured: true,
    utilities_note: "Water and waste collection are included. Electricity is prepaid.",
    description:
      "The house runs on a hybrid inverter when the grid goes off, so lights and fans stay on during outages. Rooms come furnished and the shared kitchen has two cookers. The estate road is tarred up to the gate.",
    images: ["exterior-1", "interior-2", "interior-4"],
    amenities: ["wifi", "study-desk", "ensuite", "shared-kitchen", "standby-power", "security", "laundry", "parking"],
    rooms: [
      ["Single room", 1, 6500, 600, 2, "Private room with an ensuite bathroom and inverter socket."],
      ["Double room", 2, 4400, 520, 4, "Two beds, two desks and a shared bathroom."],
      ["Three in a room", 3, 3200, 480, 5, "Three beds with separate wardrobes."],
    ],
  },
  {
    slug: "coastal-view-lodge",
    name: "Coastal View Lodge",
    tagline: "Budget rooms near Akotokyir",
    area: "Akotokyir",
    address: "Akotokyir Road, Cape Coast",
    landmark: "After the Akotokyir basic school",
    gender: "mixed",
    distance_minutes: 18,
    latitude: 5.1152,
    longitude: -1.2695,
    verified: false,
    featured: false,
    utilities_note: "Utilities are shared. Expect about GH₵120 a month per person.",
    description:
      "A straightforward lodge for students who want lower rent and do not mind the trotro ride. Rooms have beds and desks, and there is a large shared kitchen at the back. The beach road is a short walk away.",
    images: ["exterior-1", "interior-4"],
    amenities: ["shared-kitchen", "water-storage", "laundry", "waste"],
    rooms: [
      ["Double room", 2, 3400, 380, 4, "Two beds and a shared bathroom."],
      ["Four in a room", 4, 2500, 350, 6, "Four beds with lockable wardrobes."],
    ],
  },
  {
    slug: "pax-hall",
    name: "Pax Hall",
    tagline: "Male block with a study room",
    area: "Kwaprow",
    address: "Kwaprow Junction, Cape Coast",
    landmark: "Behind the Kwaprow filling station",
    gender: "male",
    distance_minutes: 11,
    latitude: 5.1284,
    longitude: -1.2845,
    verified: true,
    featured: false,
    utilities_note: "Utility fee covers water only. Electricity is prepaid per room.",
    description:
      "A quiet male block with a study room on the first floor. Rooms are arranged along one corridor with shared bathrooms at each end. The caretaker is on site during the day and the gate is locked at night.",
    images: ["exterior-3", "interior-3"],
    amenities: ["study-desk", "shared-kitchen", "water-storage", "standby-power", "security", "reading-room", "fenced"],
    rooms: [
      ["Single room", 1, 4900, 500, 3, "One person with a shared bathroom."],
      ["Double room", 2, 3500, 450, 5, "Two beds and a shared bathroom."],
    ],
  },
  {
    slug: "tawia-heights",
    name: "Tawia Heights",
    tagline: "Female rooms with a shared veranda",
    area: "Ayensu",
    address: "Ayensu Road, Cape Coast",
    landmark: "Near the Ayensu taxi rank",
    gender: "female",
    distance_minutes: 14,
    latitude: 5.1226,
    longitude: -1.2877,
    verified: false,
    featured: false,
    utilities_note: "Water is included. Electricity is split evenly among the four rooms.",
    description:
      "Four rooms open onto a shared veranda where most students study in the evening. The house is on a quiet lane with a wall and gate. A new water tank was installed in 2025 and the kitchen was repainted this year.",
    images: ["exterior-5", "interior-5"],
    amenities: ["study-desk", "shared-kitchen", "water-storage", "laundry", "fenced", "waste"],
    rooms: [
      ["Single room", 1, 6000, 550, 1, "One person with a shared bathroom."],
      ["Double room", 2, 4200, 500, 3, "Two beds and a shared bathroom."],
      ["Three in a room", 3, 3000, 450, 4, "Three beds with separate wardrobes."],
    ],
  },
];

const contacts = {
  "adom-court": {
    contact_name: "Akosua Frimpong",
    phone: "+233 24 315 8842",
    whatsapp: "233243158842",
    contact_hours: "7am to 8pm",
  },
  "greenfield-lodge": {
    contact_name: "Michael Eshun",
    phone: "+233 20 774 2190",
    whatsapp: "233207742190",
    contact_hours: "8am to 6pm",
  },
  "apewosika-heights": {
    contact_name: "Abena Sarpong",
    phone: "+233 55 902 1174",
    whatsapp: "233559021174",
    contact_hours: "7am to 7pm",
  },
  "nana-aba-hostel": {
    contact_name: "Nana Aba Koomson",
    phone: "+233 27 441 6603",
    whatsapp: "233274416603",
    contact_hours: "8am to 7pm",
  },
  "hilltop-residence": {
    contact_name: "Daniel Owusu",
    phone: "+233 24 887 5521",
    whatsapp: "233248875521",
    contact_hours: "7am to 8pm",
  },
  "sankofa-hostel": {
    contact_name: "Kobina Parker",
    phone: "+233 50 336 7719",
    whatsapp: "233503367719",
    contact_hours: "8am to 6pm",
  },
  "coastal-view-lodge": {
    contact_name: "Efua Arthur",
    phone: "+233 23 118 4406",
    whatsapp: "233231184406",
    contact_hours: "7am to 8pm",
  },
  "pax-hall": {
    contact_name: "Joseph Tetteh",
    phone: "+233 20 559 3308",
    whatsapp: "233205593308",
    contact_hours: "8am to 5pm",
  },
  "tawia-heights": {
    contact_name: "Tawia Mensah",
    phone: "+233 27 620 9931",
    whatsapp: "233276209931",
    contact_hours: "7am to 7pm",
  },
};

for (const h of hostels) Object.assign(h, contacts[h.slug]);

const credits = JSON.parse(await readFile(path.join(root, "public", "seed", "credits.json"), "utf8"));
const creditFor = (name) => credits.find((c) => c.file === `${name}.jpg`);

async function ensureUser(person) {
  const { data: list, error: listError } = await admin.auth.admin.listUsers({ perPage: 1000 });
  if (listError) throw listError;
  const existing = list.users.find((u) => u.email?.toLowerCase() === person.email);

  let user = existing;
  if (!user) {
    const { data, error } = await admin.auth.admin.createUser({
      email: person.email,
      password: person.password,
      email_confirm: true,
      user_metadata: { full_name: person.full_name, phone: person.phone },
    });
    if (error) throw error;
    user = data.user;
    console.log("created user", person.email);
  } else {
    console.log("kept user", person.email);
  }

  const { error: profileError } = await admin
    .from("profiles")
    .update({ full_name: person.full_name, phone: person.phone, role: person.role })
    .eq("id", user.id);
  if (profileError) throw profileError;

  return user;
}

async function main() {
  console.log("Seeding", env.NEXT_PUBLIC_SUPABASE_URL);

  const amenityIds = {};
  for (const [i, [name, slug]] of amenities.entries()) {
    const id = uid(`amenity:${slug}`);
    const { error } = await admin
      .from("amenities")
      .upsert({ id, name, slug, sort_order: i }, { onConflict: "id" });
    if (error) throw error;
    amenityIds[slug] = id;
  }

  for (const person of people) {
    await ensureUser(person);
  }

  // Remove the student accounts created by the first pass of this seed.
  const legacy = ["student", "ama", "kofi", "esi", "yaa", "kojo"];
  const { data: userList } = await admin.auth.admin.listUsers({ perPage: 1000 });
  for (const user of userList?.users ?? []) {
    const local = user.email?.split("@")[0];
    if (user.email?.endsWith("@campusstay.gh") && legacy.includes(local)) {
      await admin.auth.admin.deleteUser(user.id);
      console.log("removed demo user", user.email);
    }
  }

  for (const h of hostels) {
    const id = uid(`hostel:${h.slug}`);
    const { error } = await admin.from("hostels").upsert(
      {
        id,
        name: h.name,
        slug: h.slug,
        tagline: h.tagline,
        description: h.description,
        campus: "UCC",
        area: h.area,
        address: h.address,
        landmark: h.landmark,
        gender: h.gender,
        distance_minutes: h.distance_minutes,
        latitude: h.latitude,
        longitude: h.longitude,
        verified: h.verified,
        featured: h.featured,
        published: true,
        utilities_note: h.utilities_note,
        contact_name: h.contact_name,
        phone: h.phone,
        whatsapp: h.whatsapp,
        contact_hours: h.contact_hours,
      },
      { onConflict: "id" },
    );
    if (error) throw error;

    // Images
    for (const [i, image] of h.images.entries()) {
      const file = `${image}.jpg`;
      const storagePath = `${h.slug}/${file}`;
      const buf = await readFile(path.join(root, "public", "seed", file));
      const { error: uploadError } = await admin.storage
        .from("hostel-photos")
        .upload(storagePath, buf, { contentType: "image/jpeg", upsert: true });
      if (uploadError) throw uploadError;

      const { data: pub } = admin.storage.from("hostel-photos").getPublicUrl(storagePath);
      const credit = creditFor(image);
      const { error: imageError } = await admin.from("hostel_images").upsert(
        {
          id: uid(`image:${h.slug}:${image}`),
          hostel_id: id,
          url: pub.publicUrl,
          alt: credit?.alt ?? h.name,
          sort_order: i,
        },
        { onConflict: "id" },
      );
      if (imageError) throw imageError;
    }

    // Rooms
    for (const [i, room] of h.rooms.entries()) {
      const [name, capacity, price, utility, beds, description] = room;
      const { error: roomError } = await admin.from("room_types").upsert(
        {
          id: uid(`room:${h.slug}:${name}`),
          hostel_id: id,
          name,
          capacity,
          price_per_semester: price,
          utility_fee: utility,
          available_beds: beds,
          description,
          sort_order: i,
        },
        { onConflict: "id" },
      );
      if (roomError) throw roomError;
    }

    // Amenities
    await admin.from("hostel_amenities").delete().eq("hostel_id", id);
    const { error: amenityError } = await admin.from("hostel_amenities").insert(
      h.amenities.map((slug) => ({ hostel_id: id, amenity_id: amenityIds[slug] })),
    );
    if (amenityError) throw amenityError;

    console.log("seeded", h.name);
  }

  const { count: hostelCount } = await admin
    .from("hostels")
    .select("*", { count: "exact", head: true });
  console.log(`Done. ${hostelCount} hostels.`);
  console.log("Admin account ready.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
