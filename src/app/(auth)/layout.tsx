import Link from "next/link";

import { Logo } from "@/components/logo";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_1.1fr]">
      <div className="flex flex-col justify-between border-b border-line bg-card p-6 lg:border-r lg:border-b-0 lg:p-10">
        <Logo />
        <div className="mt-16 max-w-sm lg:mt-0">
          <p className="eyebrow">CampusStay</p>
          <h1 className="mt-3 text-[38px] leading-[1.05]">
            Find a room before the semester starts.
          </h1>
          <p className="mt-4 text-sm leading-6 text-muted">
            Rent, the walk to campus and the caretaker&apos;s number for hostels
            around UCC.
          </p>
        </div>
        <p className="mt-10 text-xs text-muted lg:mt-0">
          <Link href="/" className="underline underline-offset-4">
            Back to CampusStay
          </Link>
        </p>
      </div>

      <div className="flex items-center justify-center p-6 lg:p-10">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
