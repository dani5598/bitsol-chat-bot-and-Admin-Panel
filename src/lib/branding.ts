/**
 * Product-level branding for the BITSOL AI Assistant.
 *
 * `BRANDS` (src/lib/brands.ts) holds the two *business* profiles the assistant
 * routes between. This file holds the branding that sits ABOVE both of them —
 * the assistant's own identity and the BITSOL developer attribution rendered on
 * the splash screen, login, footer, about page, admin console and chat widget.
 */
import { BRANDS } from "./brands";

export const BRANDING = {
  product: {
    name: "BITSOL AI Assistant",
    shortName: "BITSOL AI",
    /** Umbrella group both businesses belong to. */
    group: "BITSOL",
    poweredBy: "Powered by Artificial Intelligence",
    description:
      "One assistant for BITSOL Marketing and BITSOL Institute of Digital Media & Artificial Intelligence.",
  },
  developer: {
    name: "BITSOL MARKETING",
    url: "https://bitsolmarketing.com",
    tagline: "Empowering Businesses & Learners with Artificial Intelligence",
    attribution: "Designed & Developed by BITSOL MARKETING",
  },
  businesses: {
    marketing: BRANDS.MARKETING,
    institute: BRANDS.INSTITUTE,
  },
} as const;

/** Read a public branding value, allowing env overrides at build time. */
export const brandName =
  process.env.NEXT_PUBLIC_BRAND_NAME ?? BRANDING.developer.name;
export const brandUrl =
  process.env.NEXT_PUBLIC_BRAND_URL ?? BRANDING.developer.url;
export const brandTagline =
  process.env.NEXT_PUBLIC_BRAND_TAGLINE ?? BRANDING.developer.tagline;
