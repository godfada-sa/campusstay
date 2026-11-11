import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const allowed = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
} as const;

const MAX_BYTES = 4 * 1024 * 1024;

export async function POST(request: Request) {
  const current = await getCurrentUser();
  if (current?.profile?.role !== "admin") {
    return NextResponse.json({ error: "Not authorised." }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Choose an image file." }, { status: 400 });
  }

  const extension = allowed[file.type as keyof typeof allowed];
  if (!extension) {
    return NextResponse.json(
      { error: "Use a JPG, PNG or WebP image." },
      { status: 415 },
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Photos must be 4 MB or smaller." },
      { status: 413 },
    );
  }

  const path = `hostels/${crypto.randomUUID()}.${extension}`;
  const supabase = await createClient();

  const { error } = await supabase.storage
    .from("hostel-photos")
    .upload(path, file, {
      contentType: file.type,
      cacheControl: "31536000",
      upsert: false,
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data } = supabase.storage.from("hostel-photos").getPublicUrl(path);

  return NextResponse.json({ url: data.publicUrl });
}
