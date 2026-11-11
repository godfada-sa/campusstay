import { NextResponse } from "next/server";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  hostelId: z.string().uuid(),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid hostel." }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  }

  const { data: hostel } = await supabase
    .from("hostels")
    .select("id")
    .eq("id", parsed.data.hostelId)
    .eq("published", true)
    .maybeSingle();

  if (!hostel) {
    return NextResponse.json({ error: "Hostel not found." }, { status: 404 });
  }

  const { error } = await supabase.from("hostel_interests").insert({
    hostel_id: parsed.data.hostelId,
    user_id: user.id,
  });

  if (error && error.code !== "23505") {
    return NextResponse.json(
      { error: "Could not save that. Try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
