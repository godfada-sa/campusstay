import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";

import { StudentSignUpForm } from "./signup-form";

export const metadata: Metadata = {
  title: "Create an account",
  description: "Create a CampusStay account with your phone number.",
};

function safeNext(value: string | undefined) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/hostels";
  }
  return value;
}

export default async function StudentSignUpPage({
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
      <h2 className="mt-2 font-display text-3xl">Create an account</h2>
      <p className="mt-1 text-sm text-muted">
        Use your phone number. No SMS code is needed.
      </p>

      <StudentSignUpForm next={next} />

      <p className="mt-6 border-t border-line pt-4 text-sm text-muted">
        Already have an account?{" "}
        <Link
          href={`/login?next=${encodeURIComponent(next)}`}
          className="font-medium text-forest underline underline-offset-4"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
