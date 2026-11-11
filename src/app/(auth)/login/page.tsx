import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";

import { StudentLoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to open hostel details on CampusStay.",
};

function safeNext(value: string | undefined) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/hostels";
  }
  return value;
}

export default async function StudentLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  const next = safeNext(params.next);
  const current = await getCurrentUser();

  if (current) {
    redirect(next);
  }

  return (
    <div>
      <p className="eyebrow">Students</p>
      <h2 className="mt-2 font-display text-3xl">Sign in</h2>
      <p className="mt-1 text-sm text-muted">
        Use the phone number you signed up with.
      </p>

      <StudentLoginForm next={next} />

      <p className="mt-6 border-t border-line pt-4 text-sm text-muted">
        New here?{" "}
        <Link
          href={`/signup?next=${encodeURIComponent(next)}`}
          className="font-medium text-forest underline underline-offset-4"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
