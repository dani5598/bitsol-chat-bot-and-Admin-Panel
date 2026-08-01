/**
 * =============================================================================
 *  Department router
 * =============================================================================
 *
 *  Decides whether a conversation belongs to BITSOL Marketing or BITSOL
 *  Institute, and — just as importantly — when it CANNOT tell, so the assistant
 *  asks instead of guessing.
 *
 *  Precedence, highest first:
 *
 *    1. An explicit switch in the newest message ("institute", "admission")
 *       — the user is allowed to change department at any point.
 *    2. The department already pinned to the conversation (sticky memory).
 *    3. Keyword scoring of the newest message.
 *    4. Keyword scoring of recent history (a follow-up like "and the price?"
 *       carries no signal of its own).
 *
 *  Scoring is deliberately conservative: a clear winner needs to beat the
 *  runner-up by a margin, otherwise we return `null` and the assistant asks the
 *  disambiguation question from the brief.
 * =============================================================================
 */
import type { Department } from "@/lib/brands";
import type { ChatTurn } from "./types";

export interface RoutingDecision {
  department: Department | null;
  /** 0–1. Below `CONFIDENCE_FLOOR` we treat the result as undetermined. */
  confidence: number;
  /** True when the newest message moved the conversation to a new business. */
  switched: boolean;
  reason: string;
}

const CONFIDENCE_FLOOR = 0.55;

/** Phrases that unambiguously name one business — treated as an explicit pick. */
const EXPLICIT_MARKETING = [
  "bitsol marketing",
  "marketing department",
  "business services",
  "🏢",
];

const EXPLICIT_INSTITUTE = [
  "bitsol institute",
  "institute of digital media",
  "the institute",
  "institute department",
  "🎓",
];

/**
 * Weighted signals. Weight 3 = decisive on its own, 2 = strong, 1 = supporting.
 * Roman Urdu and Urdu terms are included because a large share of BITSOL's
 * audience types that way.
 */
const MARKETING_SIGNALS: Array<[string, number]> = [
  // Intent to buy a service
  ["quote", 3], ["quotation", 3], ["proposal", 2], ["hire you", 3],
  ["for my business", 3], ["for our company", 3], ["my company", 2],
  ["build me", 2], ["banwana", 3], ["banwani", 3], ["banwa", 2],
  ["karwana hai", 2], ["service chahiye", 3], ["kaam karwana", 3],
  ["consultation", 2], ["meeting", 2], ["agency", 2],
  // Services
  ["chatbot for", 3], ["whatsapp automation", 3], ["whatsapp api", 3],
  ["ai agent for", 3], ["digital marketing service", 3], ["run ads", 2],
  ["ad campaign", 2], ["seo service", 3], ["website development", 2],
  ["website for", 3], ["mobile app", 2], ["software development", 2],
  ["custom software", 3], ["branding", 2], ["logo design", 2],
  ["ui ux", 2], ["corporate training", 3], ["portfolio", 2],
  ["client", 1], ["invoice", 2], ["billing", 2], ["support ticket", 2],
  ["roi", 2], ["leads", 2], ["sales", 1], ["crm", 1],
];

const INSTITUTE_SIGNALS: Array<[string, number]> = [
  // Intent to learn
  ["admission", 3], ["admissions", 3], ["daakhla", 3], ["dakhla", 3],
  ["enroll", 3], ["enrol", 3], ["enrollment", 3], ["i want to learn", 3],
  ["want to study", 3], ["seekhna", 3], ["sikhna", 3], ["sikhna hai", 3],
  ["parhna", 3], ["padhna", 3], ["student", 3], ["class", 2],
  ["classes", 2], ["course", 3], ["courses", 3], ["training course", 2],
  ["diploma", 3], ["certificate course", 3], ["batch", 3], ["batches", 3],
  ["timetable", 3], ["time table", 3], ["semester", 2],
  // Institute operations
  ["fee structure", 3], ["fees", 2], ["fee kitni", 3], ["scholarship", 3],
  ["wazifa", 3], ["instalment", 2], ["installment", 2], ["qist", 2],
  ["attendance", 3], ["assignment", 3], ["result", 2], ["lms", 3],
  ["student portal", 3], ["roll number", 3], ["trainer", 2], ["teacher", 2],
  ["faculty", 2], ["internship", 3], ["career guidance", 3],
  ["which course", 3], ["freelancing course", 3], ["prospectus", 3],
  ["eligibility", 2], ["curriculum", 2], ["syllabus", 3],
  ["admission officer", 3], ["campus", 2],
];

/**
 * Route a conversation.
 *
 * @param message  The newest user message.
 * @param current  Department already pinned to the conversation, if any.
 * @param history  Recent turns, used only when the newest message is neutral.
 */
export function routeDepartment(
  message: string,
  current: Department | null = null,
  history: ChatTurn[] = []
): RoutingDecision {
  const text = normalise(message);

  // 1. Explicit naming always wins — this is how "switch at any time" works.
  const explicit = detectExplicit(text);
  if (explicit) {
    return {
      department: explicit,
      confidence: 1,
      switched: current != null && current !== explicit,
      reason: "User named the business explicitly.",
    };
  }

  // 2/3. Score the newest message.
  const fresh = score(text);
  const freshWinner = pick(fresh);

  if (freshWinner) {
    // A strong signal for the *other* business is a department switch.
    if (current && freshWinner.department !== current && fresh.margin >= 4) {
      return {
        department: freshWinner.department,
        confidence: freshWinner.confidence,
        switched: true,
        reason: "Newest message clearly concerns the other business.",
      };
    }
    if (!current) {
      return {
        department: freshWinner.department,
        confidence: freshWinner.confidence,
        switched: false,
        reason: "Newest message matched this business's vocabulary.",
      };
    }
  }

  // 2 (continued). Sticky memory — a neutral follow-up stays where it was.
  if (current) {
    return {
      department: current,
      confidence: 0.9,
      switched: false,
      reason: "Continuing the department already chosen in this conversation.",
    };
  }

  // 4. Fall back to recent history for the very first turns.
  const historyText = history
    .slice(-6)
    .filter((t) => t.role === "user")
    .map((t) => normalise(t.content))
    .join(" ");
  const historic = score(historyText);
  const historicWinner = pick(historic);
  if (historicWinner) {
    return {
      department: historicWinner.department,
      confidence: historicWinner.confidence * 0.9,
      switched: false,
      reason: "Inferred from earlier messages in this conversation.",
    };
  }

  return {
    department: null,
    confidence: 0,
    switched: false,
    reason: "Not enough signal — the assistant should ask which business.",
  };
}

// ------------------------------------------------------------------ helpers --

function normalise(text: string): string {
  return ` ${(text ?? "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}🏢🎓\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim()} `;
}

function detectExplicit(text: string): Department | null {
  const marketing = EXPLICIT_MARKETING.some((p) => text.includes(p));
  const institute = EXPLICIT_INSTITUTE.some((p) => text.includes(p));
  // If both are named ("difference between marketing and institute") it isn't
  // an explicit pick — fall through to scoring and, likely, to asking.
  if (marketing && !institute) return "MARKETING";
  if (institute && !marketing) return "INSTITUTE";
  return null;
}

interface Scores {
  marketing: number;
  institute: number;
  margin: number;
}

function score(text: string): Scores {
  let marketing = 0;
  let institute = 0;
  for (const [term, weight] of MARKETING_SIGNALS) {
    if (text.includes(` ${term} `) || text.includes(`${term} `)) marketing += weight;
  }
  for (const [term, weight] of INSTITUTE_SIGNALS) {
    if (text.includes(` ${term} `) || text.includes(`${term} `)) institute += weight;
  }
  return { marketing, institute, margin: Math.abs(marketing - institute) };
}

function pick(
  scores: Scores
): { department: Department; confidence: number } | null {
  const total = scores.marketing + scores.institute;
  if (total === 0) return null;

  const department: Department =
    scores.marketing > scores.institute ? "MARKETING" : "INSTITUTE";
  const winner = Math.max(scores.marketing, scores.institute);
  const confidence = winner / total;

  // Require both a decent share AND a real margin, so "I want a course for my
  // company" (signals on both sides) falls through to the clarifying question.
  if (confidence < CONFIDENCE_FLOOR || scores.margin < 2) return null;
  return { department, confidence };
}
