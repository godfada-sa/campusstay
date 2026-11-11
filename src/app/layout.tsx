import type { Metadata } from "next";
import { Inter, Newsreader } from "next/font/google";

import { Preloader } from "@/components/preloader";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
  weight: ["400", "500", "600"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "CampusStay | Hostels near the University of Cape Coast",
    template: "%s | CampusStay",
  },
  description:
    "Hostels around the University of Cape Coast, with semester rent, the walk to campus and the caretaker's number. No bookings, no payments.",
  openGraph: {
    title: "CampusStay",
    description:
      "Hostels around the University of Cape Coast, with semester rent, the walk to campus and the caretaker's number.",
    siteName: "CampusStay",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`${inter.variable} ${newsreader.variable}`}>
        <Preloader />
        <noscript>
          <style>{`.preloader{display:none !important}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
