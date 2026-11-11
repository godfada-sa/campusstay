import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Logo } from "@/components/logo";
import { getCurrentUser } from "@/lib/auth";

import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Admin login",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;
  const current = await getCurrentUser();

  if (current?.profile?.role === "admin") {
    redirect("/admin");
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_1.1fr]">
      <div className="flex flex-col justify-between border-b border-line bg-card p-6 lg:border-r lg:border-b-0 lg:p-10">
        <Logo />
        <div className="mt-16 max-w-sm lg:mt-0">
          <p className="eyebrow">Admin</p>
          <h1 className="mt-3 text-[38px] leading-[1.05]">
            Keep the UCC hostel list accurate.
          </h1>
          <p className="mt-4 text-sm leading-6 text-muted">
            Add hostels, change rent, upload photos and publish when the details
            are right. Only admins can sign in here.
          </p>
        </div>
        <p className="mt-10 text-xs text-muted lg:mt-0">
          <Link href="/" className="underline underline-offset-4">
            Back to CampusStay
          </Link>
        </p>
      </div>

      <div className="flex items-center justify-center p-6 lg:p-10">
        <div className="w-full max-w-sm">
          <h2 className="font-display text-3xl">Sign in</h2>
          <p className="mt-1 text-sm text-muted">
            Use the admin email and password.
          </p>

          {params.error === "forbidden" ? (
            <p className="mt-4 border border-[#d9b4a6] bg-[#f8eae4] px-3 py-2 text-sm text-[#7e2f13]">
              That account does not have admin access.
            </p>
          ) : null}

          <LoginForm next={params.next ?? "/admin"} />
        </div>
      </div>
    </div>
  );
}
