import type { Metadata } from "next";

import { AdminNav } from "@/components/admin/admin-nav";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { user, profile } = await requireAdmin();

  return (
    <div className="min-h-screen bg-paper">
      <AdminNav
        name={profile?.full_name ?? ""}
        email={user.email ?? ""}
      />
      <div className="lg:pl-[248px]">
        <main className="mx-auto w-full max-w-[1120px] px-4 py-8 md:px-8 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
