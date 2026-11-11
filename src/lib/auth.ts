import { cache } from "react";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export const getCurrentUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return { user, profile };
});

export async function requireAdmin() {
  const current = await getCurrentUser();
  if (!current) redirect("/admin/login");
  if (current.profile?.role !== "admin") redirect("/admin/login?error=forbidden");
  return current;
}
