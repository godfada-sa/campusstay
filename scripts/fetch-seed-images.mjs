// Downloads a small, licence-clear photo set for the demo listings.
// Credits are written to public/seed/credits.json and docs/IMAGE_CREDITS.md.
import { access, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(url, attempts = 5) {
  for (let i = 0; i < attempts; i++) {
    const res = await fetch(url, { headers: { "User-Agent": "CampusStayDemo/1.0 (demo project)" } });
    if (res.ok) return res;
    if (res.status === 429) {
      const wait = Number(res.headers.get("retry-after") ?? 5) * 1000;
      console.log(`rate limited, waiting ${wait / 1000}s`);
      await sleep(wait);
      continue;
    }
    throw new Error(`${res.status} for ${url}`);
  }
  throw new Error(`gave up on ${url}`);
}

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

const files = [
  ["File:GETFUND Hostel UENR.jpg", "exterior-1", "Hostel block exterior"],
  ["File:Hostel Block B (GCTU).jpg", "exterior-2", "Hostel block exterior"],
  ["File:Ghana Hostels Limited (UEW).jpg", "exterior-3", "Hostel courtyard"],
  ["File:International Students Hostel 2, University of Ghana.jpg", "exterior-4", "Hostel entrance"],
  ["File:UHAS SOKODE HOSTEL.jpg", "exterior-5", "Hostel building"],
  ["File:Apartment Villagio Ghana.jpg", "exterior-6", "Apartment exterior"],
  ["File:Small apartment in Accra.jpg", "exterior-7", "Apartment block"],
  ["File:Guest house 2024.jpg", "exterior-8", "Guest house exterior"],
  ["File:Female student writing and studying at dorm room desk.jpg", "interior-1", "Study desk in a room"],
  ["File:Hostel 6-bed dorm room, Kuching, Malaysia.jpg", "interior-2", "Shared room with beds"],
  ["File:Interiér turistické ubytovny.jpg", "interior-3", "Shared room"],
  ["File:Apartment Kitchen 1 2018-09-28.jpg", "interior-4", "Shared kitchen"],
  ["File:Room with bathroom at Kabalulumana Hostel, Mount Isa, 2023, 01.jpg", "interior-5", "Room and bathroom"],
  ["File:Budget Backpackers room (542725264).jpg", "interior-6", "Bedroom"],
  ["File:SRC Hostel.JPG", "exterior-9", "SRC Hostel, University of Cape Coast"],
  ["File:University of Cape Coast 01.jpg", "campus-1", "University of Cape Coast"],
  ["File:University of Cape Coast 02.jpg", "campus-2", "University of Cape Coast"],
  ["File:Gurene Wikimedia Community Meetup, University of Cape Coast - 18th September, 2021 - 02.jpg", "campus-3", "University of Cape Coast"],
];

const outDir = path.join(process.cwd(), "public", "seed");
await mkdir(outDir, { recursive: true });

const credits = [];

for (const [title, name, alt] of files) {
  const api =
    "https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo" +
    "&iiprop=url|size|extmetadata&iiurlwidth=1280&titles=" +
    encodeURIComponent(title);
  const res = await get(api);
  const data = await res.json();
  const page = Object.values(data.query?.pages ?? {})[0];
  const info = page?.imageinfo?.[0];
  if (!info) {
    console.warn("no image", title);
    continue;
  }

  const file = `${name}.jpg`;
  const target = path.join(outDir, file);
  const buf = (await exists(target))
    ? null
    : Buffer.from(await (await get(info.thumburl.split("?")[0])).arrayBuffer());
  if (buf) await writeFile(target, buf);

  const meta = info.extmetadata ?? {};
  const strip = (v) => (v?.value ?? "").replace(/<[^>]*>/g, "").trim();
  credits.push({
    file,
    alt,
    title: title.replace(/^File:/, ""),
    source: info.descriptionurl,
    author: strip(meta.Artist),
    license: strip(meta.LicenseShortName) || "see source",
    width: info.width,
    height: info.height,
  });
  console.log(buf ? `saved ${file} ${Math.round(buf.length / 1024)} KB` : `kept ${file}`);
  await sleep(1200);
}

await writeFile(path.join(outDir, "credits.json"), JSON.stringify(credits, null, 2));

const md = [
  "# Image credits",
  "",
  "Demo photography comes from Wikimedia Commons. Replace these with real",
  "listing photos before showing the site to students.",
  "",
  ...credits.map(
    (c) =>
      `- **${c.file}**: [${c.title}](${c.source}) by ${c.author || "unknown"}, ${c.license}.`,
  ),
  "",
];
await mkdir(path.join(process.cwd(), "docs"), { recursive: true });
await writeFile(path.join(process.cwd(), "docs", "IMAGE_CREDITS.md"), md.join("\n"));
console.log("done", credits.length);
