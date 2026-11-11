import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap flex min-h-[58vh] max-w-2xl flex-col justify-center py-16">
      <p className="eyebrow">404</p>
      <h1 className="mt-3 text-[42px]">That page is not here</h1>
      <p className="mt-3 max-w-lg text-[15px] leading-7 text-muted">
        This hostel may have been removed, or the link is old. Try the full
        list.
      </p>
      <div className="mt-6 flex gap-3">
        <Link href="/hostels" className="btn btn-primary">
          See all hostels
        </Link>
        <Link href="/" className="btn btn-outline">
          Go home
        </Link>
      </div>
    </div>
  );
}
