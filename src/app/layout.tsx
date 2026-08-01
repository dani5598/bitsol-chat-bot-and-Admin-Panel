import type { Metadata, Viewport } from "next";
import "./globals.css";
import { BRANDING } from "@/lib/branding";
import { BRANDS } from "@/lib/brands";

export const metadata: Metadata = {
  title: {
    default: `${BRANDING.product.name} · ${BRANDS.MARKETING.shortName} & ${BRANDS.INSTITUTE.shortName}`,
    template: `%s · ${BRANDING.product.shortName}`,
  },
  description:
    "One AI assistant for BITSOL Marketing and BITSOL Institute of Digital Media & Artificial Intelligence — services, quotes and consultations for businesses; courses, admissions, fees and career guidance for students. English, Urdu, Roman Urdu and Punjabi.",
  applicationName: BRANDING.product.name,
  authors: [{ name: BRANDING.developer.name, url: BRANDING.developer.url }],
  keywords: [
    "BITSOL",
    "BITSOL Marketing",
    "BITSOL Institute",
    "AI chatbot",
    "WhatsApp automation",
    "digital marketing",
    "SEO",
    "web development",
    "digital marketing course",
    "AI course",
    "admission",
    "Faisalabad",
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  openGraph: {
    title: BRANDING.product.name,
    description: BRANDING.developer.tagline,
    siteName: BRANDING.product.name,
    type: "website",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#1e2a78",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-dvh font-sans">{children}</body>
    </html>
  );
}
