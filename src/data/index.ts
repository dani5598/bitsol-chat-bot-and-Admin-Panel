/**
 * =============================================================================
 *  Department content registry
 * =============================================================================
 *
 *  The single place that maps a `Department` to its content. Every consumer —
 *  the AI retrieval layer, the menu panel, the suggestion grid, the seed script
 *  — goes through here, which is what makes "never mix business information"
 *  structural rather than a convention: you cannot reach Institute content
 *  while holding a MARKETING department value.
 * =============================================================================
 */
import type { Department } from "@/lib/brands";
import type { CourseItem, KnowledgeEntry, MenuEntry, ServiceItem } from "@/types";

import { MARKETING_SERVICES, MARKETING_SERVICE_GROUPS, findService, matchService } from "./marketing/services";
import { MARKETING_KNOWLEDGE_BASE, MARKETING_KB_CATEGORIES } from "./marketing/knowledge-base";
import { MARKETING_MENU, MARKETING_SUGGESTIONS, MARKETING_QUICK_REPLIES } from "./marketing/menu";

import { INSTITUTE_COURSES, COURSE_GROUPS, findCourse, matchCourse } from "./institute/courses";
import { INSTITUTE_KNOWLEDGE_BASE, INSTITUTE_KB_CATEGORIES } from "./institute/knowledge-base";
import { INSTITUTE_MENU, INSTITUTE_SUGGESTIONS, INSTITUTE_QUICK_REPLIES } from "./institute/menu";

export {
  MARKETING_SERVICES,
  MARKETING_SERVICE_GROUPS,
  findService,
  matchService,
  MARKETING_KNOWLEDGE_BASE,
  MARKETING_MENU,
  INSTITUTE_COURSES,
  COURSE_GROUPS,
  findCourse,
  matchCourse,
  INSTITUTE_KNOWLEDGE_BASE,
  INSTITUTE_MENU,
};

export interface SuggestionCard {
  title: string;
  titleUr: string;
  prompt: string;
}

export interface DepartmentContent {
  knowledgeBase: KnowledgeEntry[];
  categories: string[];
  menu: MenuEntry[];
  suggestions: SuggestionCard[];
  quickReplies: string[];
  /** Catalogue names, injected into the prompt so the model knows the range. */
  catalogue: string[];
}

const CONTENT: Record<Department, DepartmentContent> = {
  MARKETING: {
    knowledgeBase: MARKETING_KNOWLEDGE_BASE,
    categories: MARKETING_KB_CATEGORIES,
    menu: MARKETING_MENU,
    suggestions: MARKETING_SUGGESTIONS,
    quickReplies: MARKETING_QUICK_REPLIES,
    catalogue: MARKETING_SERVICES.map((s) => s.name),
  },
  INSTITUTE: {
    knowledgeBase: INSTITUTE_KNOWLEDGE_BASE,
    categories: INSTITUTE_KB_CATEGORIES,
    menu: INSTITUTE_MENU,
    suggestions: INSTITUTE_SUGGESTIONS,
    quickReplies: INSTITUTE_QUICK_REPLIES,
    catalogue: INSTITUTE_COURSES.map((c) => c.name),
  },
};

/** Everything the assistant and UI need for one business. */
export function departmentContent(department: Department): DepartmentContent {
  return CONTENT[department];
}

/** Services for Marketing, courses for Institute — used by the catalog API. */
export function departmentCatalogue(
  department: Department
): ServiceItem[] | CourseItem[] {
  return department === "MARKETING" ? MARKETING_SERVICES : INSTITUTE_COURSES;
}
