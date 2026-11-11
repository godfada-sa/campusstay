"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { normalizeGhanaPhone } from "@/lib/phone";
import { createClient } from "@/lib/supabase/server";

export type LoginState = { error: string | null };
export type StudentAuthState = { error: string | null };

function safeNext(value: string | null | undefined) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/hostels";
  }
  return value;
}

function friendlyAuthError(message: string) {
  const text = message.toLowerCase();

  if (text.includes("already") || text.includes("registered")) {
    return "That phone number already has an account. Sign in instead.";
  }
  if (text.includes("rate limit") || text.includes("too many")) {
    return "Too many attempts. Wait a minute and try again.";
  }
  if (text.includes("phone")) {
    return "Check the phone number and try again.";
  }
  if (text.includes("password")) {
    return "Use a password with at least 8 characters.";
  }
  return "Something went wrong. Try again.";
}

export async function studentSignUp(
  _previous: StudentAuthState,
  formData: FormData,
): Promise<StudentAuthState> {
  const fullName = String(formData.get("full_name") ?? "").trim();
  const phoneInput = String(formData.get("phone") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm_password") ?? "");
  const next = safeNext(String(formData.get("next") ?? ""));

  if (fullName.length < 2) {
    return { error: "Enter your full name." };
  }

  const phone = normalizeGhanaPhone(phoneInput);
  if (!phone) {
    return { error: "Enter a Ghana phone number, for example 024 123 4567." };
  }

  if (password.length < 8) {
    return { error: "Use at least 8 characters for the password." };
  }

  if (password !== confirm) {
    return { error: "The two passwords do not match." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    phone,
    password,
    options: {
      data: { full_name: fullName, phone },
    },
  });

  if (error) {
    return { error: friendlyAuthError(error.message) };
  }

  if (!data.session) {
    return {
      error:
        "Account created, but the sign-in step did not finish. Try signing in.",
    };
  }

  revalidatePath("/", "layout");
  redirect(next);
}

export async function studentLogin(
  _previous: StudentAuthState,
  formData: FormData,
): Promise<StudentAuthState> {
  const phoneInput = String(formData.get("phone") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = safeNext(String(formData.get("next") ?? ""));

  const phone = normalizeGhanaPhone(phoneInput);
  if (!phone || !password) {
    return { error: "Enter your phone number and password." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    phone,
    password,
  });

  if (error || !data.user) {
    return { error: "That phone number and password do not match." };
  }

  revalidatePath("/", "layout");
  redirect(next);
}

export async function studentSignOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

export async function adminLogin(
  _previous: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return { error: "Email or password is incorrect." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .maybeSingle();

  if (profile?.role !== "admin") {
    await supabase.auth.signOut();
    return { error: "This account does not have admin access." };
  }

  revalidatePath("/", "layout");
  redirect(next.startsWith("/") ? next : "/admin");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/admin/login");
}
