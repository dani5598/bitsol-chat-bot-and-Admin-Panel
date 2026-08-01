/**
 * =============================================================================
 *  BITSOL AI Assistant — Dual-brand registry
 * =============================================================================
 *
 *  The assistant serves TWO independent businesses under one BITSOL umbrella:
 *
 *    1. BITSOL Marketing  — business services, digital solutions, AI automation
 *    2. BITSOL Institute of Digital Media & Artificial Intelligence — education
 *
 *  Everything that differs between them (name, voice, theme, contact details,
 *  menus, knowledge base, workflows, reference-id prefixes) is resolved through
 *  this single registry so no module ever hard-codes one business. Keeping the
 *  two profiles side by side also makes the "never mix business information"
 *  rule enforceable: a module asks for `brand(department)` and gets exactly one.
 *
 *  This file is isomorphic (no server-only imports) so client components can
 *  theme themselves from the same source of truth.
 * =============================================================================
 */

/** The two businesses the assistant routes between. */
export type Department = "MARKETING" | "INSTITUTE";

/** All departments, in menu order. */
export const DEPARTMENTS: readonly Department[] = ["MARKETING", "INSTITUTE"] as const;

/** URL/database-friendly slug for a department. */
export type DepartmentSlug = "marketing" | "institute";

export interface BrandContact {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  hours: string;
  website: string;
  mapUrl?: string;
}

export interface BrandProfile {
  id: Department;
  slug: DepartmentSlug;
  /** Full public name. */
  name: string;
  /** Compact name for headers and chips. */
  shortName: string;
  /** Emoji used in the welcome menu and quick replies. */
  emoji: string;
  /** One-line positioning statement. */
  tagline: string;
  /** Two-sentence description used on the landing page and in the AI prompt. */
  description: string;
  /** What this business exists to do — fed to the system prompt as scope. */
  purpose: readonly string[];
  /** Prefix for every reference id this business generates (leads, tickets…). */
  referencePrefix: string;
  /** Theme applied via `data-department` on a wrapping element. */
  theme: {
    /** Tailwind gradient stops used for hero panels and splash. */
    gradient: string;
    /** Accent colour name, for docs only — real values live in globals.css. */
    accentName: string;
  };
  contact: BrandContact;
}

/**
 * NOTE ON ACCURACY — the contact block below holds representative defaults so
 * the product is demo-ready out of the box. They are overridable at runtime
 * from Admin → Settings (`settings` table) and should be reviewed by BITSOL
 * before go-live. The assistant is explicitly instructed never to invent
 * contact details beyond what is supplied here.
 */
export const BRANDS: Record<Department, BrandProfile> = {
  MARKETING: {
    id: "MARKETING",
    slug: "marketing",
    name: "BITSOL Marketing",
    shortName: "BITSOL Marketing",
    emoji: "🏢",
    tagline: "Business growth, engineered with Artificial Intelligence.",
    description:
      "BITSOL Marketing is a full-service digital and AI solutions company. We build AI chatbots, WhatsApp automation, AI agents, websites, mobile apps and complete brand systems for businesses that want to grow faster with less manual work.",
    purpose: [
      "Business Services",
      "Digital Solutions",
      "AI Automation",
      "Software Development",
    ],
    referencePrefix: "BM",
    theme: {
      gradient: "from-[#0b1d5b] via-[#123a8a] to-[#0f766e]",
      accentName: "Electric Blue",
    },
    contact: {
      phone: "+92 300 0000000",
      whatsapp: "+92 300 0000000",
      email: "info@bitsolmarketing.com",
      address: "BITSOL Marketing, Faisalabad",
      city: "Faisalabad, Pakistan",
      hours: "Monday–Saturday, 10:00 AM – 7:00 PM (PKT)",
      website: "https://bitsolmarketing.com",
    },
  },

  INSTITUTE: {
    id: "INSTITUTE",
    slug: "institute",
    name: "BITSOL Institute of Digital Media & Artificial Intelligence",
    shortName: "BITSOL Institute",
    emoji: "🎓",
    tagline: "Learn digital media and AI skills that actually pay.",
    description:
      "BITSOL Institute of Digital Media & Artificial Intelligence trains students in digital marketing, AI automation, design, video, development and freelancing. Every course is project-based, taught by working professionals, and ends with a certificate plus career support.",
    purpose: ["Admissions", "Learning", "Student Services", "Career Guidance"],
    referencePrefix: "BI",
    theme: {
      gradient: "from-[#0b3d2e] via-[#0f766e] to-[#115e59]",
      accentName: "Academy Emerald",
    },
    contact: {
      phone: "+92 300 0000000",
      whatsapp: "+92 300 0000000",
      email: "admissions@bitsolinstitute.com",
      address: "BITSOL Institute of Digital Media & AI, Faisalabad",
      city: "Faisalabad, Pakistan",
      hours: "Monday–Saturday, 9:00 AM – 8:00 PM (PKT)",
      website: "https://bitsolmarketing.com",
    },
  },
};

/** Resolve a brand profile. Returns `null` for an undetermined department. */
export function brand(department: Department): BrandProfile;
export function brand(department: Department | null | undefined): BrandProfile | null;
export function brand(department: Department | null | undefined): BrandProfile | null {
  return department ? BRANDS[department] : null;
}

/** Map a slug (`"marketing"`) back to a department (`"MARKETING"`). */
export function departmentFromSlug(slug: string): Department | null {
  const normalised = slug.trim().toLowerCase();
  if (normalised === "marketing") return "MARKETING";
  if (normalised === "institute") return "INSTITUTE";
  return null;
}

/** Narrow an untrusted value to a `Department`. */
export function asDepartment(value: unknown): Department | null {
  return value === "MARKETING" || value === "INSTITUTE" ? value : null;
}
