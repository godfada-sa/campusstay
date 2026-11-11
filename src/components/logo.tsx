import Link from "next/link";

export function Logo({ tone = "ink" }: { tone?: "ink" | "light" }) {
  const text = tone === "light" ? "text-[#fbf8f0]" : "text-ink";
  const mark = tone === "light" ? "text-[#e9e2d1]" : "text-forest";

  return (
    <Link href="/" className={`inline-flex items-center gap-2.5 ${text}`}>
      <svg
        viewBox="0 0 32 32"
        className={`h-7 w-7 ${mark}`}
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M4 15 L16 4.5 L28 15"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7 13.5 V27 H25 V13.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13 27 V19.5 H19 V27"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="font-display text-[21px] leading-none tracking-[-0.01em]">
        CampusStay
      </span>
    </Link>
  );
}
