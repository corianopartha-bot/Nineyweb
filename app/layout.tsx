import type { Metadata } from "next";
import { Instrument_Serif, Barlow } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const barlow = Barlow({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-barlow",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${site.name} · ${site.role}`,
  description: `${site.philosophy.line1}${site.philosophy.line2}`,
  authors: [{ name: site.name }],
  openGraph: {
    title: `${site.name} · ${site.role}`,
    description: `${site.philosophy.line1}${site.philosophy.line2}`,
    type: "website",
    locale: "zh_CN",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="zh-CN"
      className={`${instrumentSerif.variable} ${barlow.variable}`}
    >
      <body className="font-body antialiased">
        {children}
        <div className="grain-overlay" aria-hidden />
      </body>
    </html>
  );
}
