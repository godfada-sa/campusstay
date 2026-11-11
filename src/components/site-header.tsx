import Link from "next/link";

import { Logo } from "@/components/logo";
import { studentSignOut } from "@/lib/actions/auth";
import { getCurrentUser } from "@/lib/auth";

const links = [
  { href: "/hostels", label: "Hostels" },
  { href: "/#areas", label: "Areas" },
  { href: "/#how-it-works", label: "Before you pay" },
];

export async function SiteHeader() {
  const current = await getCurrentUser();
  const firstName = current?.profile?.full_name.trim().split(/\s+/)[0];
  const isAdmin = current?.profile?.role === "admin";

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper">
      <div className="wrap flex h-[70px] items-center justify-between gap-6">
        <Logo />

        <nav className="hidden items-center gap-6 text-[14px] font-medium md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-ink/80 transition-colors hover:text-forest"
            >
              {link.label}
            </Link>
          ))}

          {current ? (
            <>
              {isAdmin ? (
                <Link
                  href="/admin"
                  className="text-ink/80 transition-colors hover:text-forest"
                >
                  Admin
                </Link>
              ) : null}
              {firstName ? (
                <span className="text-sm text-muted">Hi, {firstName}</span>
              ) : null}
              <form action={studentSignOut}>
                <button
                  type="submit"
                  className="text-[14px] font-medium text-ink/80 transition-colors hover:text-forest"
                >
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="text-ink/80 transition-colors hover:text-forest"
            >
              Sign in
            </Link>
          )}

          <Link href="/hostels" className="btn btn-primary">
            Find a hostel
          </Link>
        </nav>

        <details className="group relative md:hidden">
          <summary className="flex h-10 cursor-pointer list-none items-center gap-2 rounded border border-line px-3 text-[13px] font-semibold [&::-webkit-details-marker]:hidden">
            Menu
            <span aria-hidden="true" className="text-muted">
              +
            </span>
          </summary>
          <div className="absolute right-0 top-12 w-60 border border-line bg-card p-2 shadow-[0_12px_30px_rgba(27,34,28,0.08)]">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded px-3 py-2.5 text-sm hover:bg-paper-deep"
              >
                {link.label}
              </Link>
            ))}

            {current ? (
              <>
                {isAdmin ? (
                  <Link
                    href="/admin"
                    className="block rounded px-3 py-2.5 text-sm hover:bg-paper-deep"
                  >
                    Admin
                  </Link>
                ) : null}
                <form action={studentSignOut}>
                  <button
                    type="submit"
                    className="block w-full rounded px-3 py-2.5 text-left text-sm hover:bg-paper-deep"
                  >
                    Sign out
                  </button>
                </form>
              </>
            ) : (
              <Link
                href="/login"
                className="block rounded px-3 py-2.5 text-sm hover:bg-paper-deep"
              >
                Sign in
              </Link>
            )}

            <Link href="/hostels" className="btn btn-primary mt-2 w-full">
              Find a hostel
            </Link>
          </div>
        </details>
      </div>
    </header>
  );
}
