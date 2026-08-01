import type { MenuEntry } from "@/types";
import { INSTITUTE_COURSES } from "./courses";

/**
 * BITSOL Institute conversation menu.
 *
 * Same contract as the Marketing menu: leaves either send a prompt answered
 * from the Institute knowledge base, or open a structured workflow.
 */
export const INSTITUTE_MENU: MenuEntry[] = [
  {
    id: "in-about",
    label: "About Institute",
    labelUr: "ادارے کے بارے میں",
    prompt: "Tell me about BITSOL Institute of Digital Media & Artificial Intelligence.",
  },
  {
    id: "in-courses",
    label: "Courses",
    labelUr: "کورسز",
    prompt: "What courses do you offer?",
    children: INSTITUTE_COURSES.map((course) => ({
      id: `in-course-${course.slug}`,
      label: course.name,
      labelUr: course.name,
      prompt: `Tell me about the ${course.name} course — curriculum, duration, fee, instalments, trainer, careers, projects and certification.`,
    })),
  },
  {
    id: "in-admissions",
    label: "Admissions",
    labelUr: "داخلے",
    prompt: "I want to apply for admission.",
    action: { kind: "ADMISSION_FORM" },
  },
  {
    id: "in-fees",
    label: "Fee Structure",
    labelUr: "فیس اسٹرکچر",
    prompt: "What is the fee structure for your courses?",
  },
  {
    id: "in-scholarships",
    label: "Scholarships",
    labelUr: "وظائف",
    prompt: "Do you offer scholarships or discounts?",
  },
  {
    id: "in-batches",
    label: "Upcoming Batches",
    labelUr: "آنے والے بیچز",
    prompt: "When do the next batches start and are seats available?",
  },
  {
    id: "in-timetable",
    label: "Timetable",
    labelUr: "ٹائم ٹیبل",
    prompt: "What are the class timings and timetable options?",
  },
  {
    id: "in-portal",
    label: "Student Portal",
    labelUr: "اسٹوڈنٹ پورٹل",
    prompt:
      "I'm an enrolled student — tell me about the student portal, attendance, assignments, fee status, results and certificates.",
  },
  {
    id: "in-career",
    label: "Career Guidance",
    labelUr: "کیریئر رہنمائی",
    prompt: "Help me choose the right course for my goals.",
    action: { kind: "CAREER_FORM" },
  },
  {
    id: "in-internship",
    label: "Internship Program",
    labelUr: "انٹرن شپ پروگرام",
    prompt: "Tell me about your internship programme.",
  },
  {
    id: "in-certifications",
    label: "Certifications",
    labelUr: "سرٹیفکیٹس",
    prompt: "What certificate will I receive and how is it verified?",
  },
  {
    id: "in-events",
    label: "Events",
    labelUr: "تقریبات",
    prompt: "What events, seminars and free workshops do you hold?",
  },
  {
    id: "in-downloads",
    label: "Downloads",
    labelUr: "ڈاؤن لوڈز",
    prompt: "Can I download the prospectus, course outline or admission form?",
  },
  {
    id: "in-faqs",
    label: "FAQs",
    labelUr: "عام سوالات",
    prompt: "What are the most frequently asked questions about admission and courses?",
  },
  {
    id: "in-contact",
    label: "Contact",
    labelUr: "رابطہ",
    prompt: "How do I contact the institute?",
  },
  {
    id: "in-officer",
    label: "Admission Officer",
    labelUr: "داخلہ آفیسر",
    prompt: "I'd like to speak to an admission officer.",
    action: { kind: "ADMISSION_FORM" },
  },
];

/** Empty-state suggestions for a new BITSOL Institute conversation. */
export const INSTITUTE_SUGGESTIONS = [
  {
    title: "Which course suits me?",
    titleUr: "میرے لیے کون سا کورس بہتر ہے؟",
    prompt:
      "I'm not sure which course to pick. Can you guide me based on my interest and goals?",
  },
  {
    title: "Digital Marketing with AI",
    titleUr: "اے آئی کے ساتھ ڈیجیٹل مارکیٹنگ",
    prompt: "Tell me about the Digital Marketing with AI course.",
  },
  {
    title: "Fee structure & instalments",
    titleUr: "فیس اور اقساط",
    prompt: "What is the fee structure and can I pay in instalments?",
  },
  {
    title: "Apply for admission",
    titleUr: "داخلے کے لیے درخواست",
    prompt: "I want to apply for admission.",
  },
  {
    title: "Upcoming batches",
    titleUr: "آنے والے بیچز",
    prompt: "When does the next batch start?",
  },
  {
    title: "Freelancing & earning online",
    titleUr: "فری لانسنگ اور آن لائن کمائی",
    prompt: "I want to start freelancing. Which course should I take?",
  },
];

/** Quick-reply chips shown under the composer in an Institute conversation. */
export const INSTITUTE_QUICK_REPLIES = [
  "Fee structure",
  "Next batch",
  "Apply for admission",
  "Scholarships",
  "اردو میں بتائیں",
];
