"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Logo } from "@/components/logo";
import { signOut } from "@/lib/actions/auth";

const links = [
  { href: "/admin", label: "Overview", exact: true },
  { href: "/admin/hostels", label: "Hostels", exact: false },
  { href: "/admin/hostels/new", label: "Add hostel", exact: true },
];

export function AdminNav({
  name,
  email,
}: {
  name: string;
  email: string;
}) {
  const pathname = usePathname();

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <>
      <header className="flex items-center justify-between gap-4 border-b border-line bg-card px-4 py-3 lg:hidden">
        <Logo />
        <div className="flex items-center gap-4 text-sm">
          <Link href="/admin/hostels" className="font-medium">
            Hostels
          </Link>
          <form action={signOut}>
            <button type="submit" className="text-muted hover:text-ink">
              Sign out
            </button>
          </form>
        </div>
      </header>

      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[248px] flex-col border-r border-line bg-card lg:flex">
        <div className="border-b border-line px-6 py-5">
          <Logo />
          <p className="mt-2 text-[10px] font-semibold tracking-[0.14em] text-muted uppercase">
            Admin
          </p>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center justify-between rounded px-3 py-2.5 text-sm ${
                isActive(link.href, link.exact)
                  ? "bg-forest text-[#f7f2e5]"
                  : "text-ink/80 hover:bg-paper-deep"
              }`}
            >
              {link.label}
              {link.href === "/admin/hostels/new" && !isActive(link.href, true) ? (
                <span aria-hidden="true">+</span>
              ) : null}
            </Link>
          ))}

          <div className="my-3 border-t border-line" />

          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between rounded px-3 py-2.5 text-sm text-ink/80 hover:bg-paper-deep"
          >
            View site
            <span className="text-xs text-muted">↗</span>
          </Link>
        </nav>

        <div className="border-t border-line p-4">
          <p className="truncate text-sm font-medium">{name || "Admin"}</p>
          <p className="truncate text-xs text-muted">{email}</p>
          <form action={signOut} className="mt-3">
            <button type="submit" className="btn btn-outline w-full">
              Sign out
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
