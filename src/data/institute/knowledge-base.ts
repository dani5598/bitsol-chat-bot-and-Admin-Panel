import type { KnowledgeEntry } from "@/types";
import { BRANDS } from "@/lib/brands";
import { INSTITUTE_COURSES } from "./courses";

/**
 * =============================================================================
 *  BITSOL Institute of Digital Media & AI — knowledge base
 * =============================================================================
 *
 *  Loaded only for INSTITUTE conversations. Marketing content is never mixed in.
 *
 *  Two sources:
 *    1. Hand-written institute entries (admissions, fees, scholarships,
 *       batches, student services, career guidance, policies…)
 *    2. Auto-derived entries, one per course, built from the catalogue.
 *
 *  Seeded into `knowledge_base_institute` and editable from Admin → Knowledge
 *  Base thereafter.
 * =============================================================================
 */

const brand = BRANDS.INSTITUTE;

const INSTITUTE_ENTRIES: KnowledgeEntry[] = [
  {
    id: "in-about",
    department: "INSTITUTE",
    kind: "ARTICLE",
    category: "About",
    question: "Tell me about BITSOL Institute of Digital Media & Artificial Intelligence.",
    answer: `${brand.description}\n\nWe focus on four things: **Admissions**, **Learning**, **Student Services** and **Career Guidance**. Classes are small and practical — you build real projects, not just watch lectures. Trainers are working professionals from the BITSOL delivery team, so what you learn is what the market is actually paying for today. We're located in ${brand.contact.city}.`,
    keywords: ["about", "institute", "who are you", "academy", "school", "introduction", "bitsol institute"],
  },
  {
    id: "in-why-us",
    department: "INSTITUTE",
    kind: "ARTICLE",
    category: "About",
    question: "Why should I study at BITSOL Institute?",
    answer:
      "- **Project-based, not theory-based.** Every course ends with work you can show a client or employer.\n- **Trainers who still do the job.** Our instructors deliver live client projects at BITSOL Marketing.\n- **AI built into everything.** Even the traditional courses teach the AI workflow professionals now use.\n- **Career support included.** Freelancing guidance, portfolio review, internship opportunities and job referrals.\n- **Flexible fees.** Instalment plans and merit/need-based scholarships are available.\n- **Small batches** so you actually get attention.",
    keywords: ["why", "why choose", "best institute", "different", "better", "advantage", "worth it"],
  },
  {
    id: "in-courses-overview",
    department: "INSTITUTE",
    kind: "COURSE",
    category: "Courses",
    question: "What courses do you offer?",
    answer:
      "**Digital Marketing** — Digital Marketing · Digital Marketing with AI · SEO · Social Media Marketing\n**Design & Media** — Graphic Designing · Video Editing\n**Development** — Full Stack Web Development · WordPress · Shopify & E-Commerce\n**Artificial Intelligence** — AI Automation · Prompt Engineering · AI Agents · WhatsApp Chatbots\n**Business & Career** — Freelancing · Startup with AI · TikTok Shop\n\nName any course and I'll give you the full overview, curriculum, duration, fees, instalment plan, trainer, career paths, projects and certification — and I can start your admission inquiry right away.",
    keywords: ["courses", "course list", "what courses", "programs", "classes", "subjects", "offer", "menu"],
  },
  {
    id: "in-admission-process",
    department: "INSTITUTE",
    kind: "ARTICLE",
    category: "Admissions",
    question: "What is the admission process?",
    answer:
      "1. **Inquiry** — share your name, contact, qualification, city and the course you're interested in. I'll generate an admission reference number for you.\n2. **Counselling call** — an admission officer calls to confirm the course fits your goals and background.\n3. **Seat confirmation** — pay the admission instalment to reserve your seat in the upcoming batch.\n4. **Registration** — submit CNIC/B-Form copy, last qualification certificate and two photographs.\n5. **Orientation** — meet your trainer, get your class schedule and student portal access.\n6. **Classes begin** on your batch start date.\n\nShall I start your admission inquiry now?",
    keywords: ["admission", "how to apply", "apply", "enroll", "enrol", "join", "registration", "process", "daakhla"],
  },
  {
    id: "in-fee-structure",
    department: "INSTITUTE",
    kind: "POLICY",
    category: "Fees",
    question: "What is the fee structure?",
    answer:
      "Indicative course fees:\n\n- Freelancing — from PKR 22,000\n- Prompt Engineering — from PKR 25,000\n- TikTok Shop — from PKR 25,000\n- Social Media Marketing — from PKR 28,000\n- WordPress — from PKR 28,000\n- SEO — from PKR 30,000\n- Shopify & E-Commerce — from PKR 30,000\n- WhatsApp Chatbots — from PKR 30,000\n- Graphic Designing — from PKR 32,000\n- Video Editing — from PKR 32,000\n- Digital Marketing — from PKR 35,000\n- Startup with AI — from PKR 35,000\n- AI Automation — from PKR 40,000\n- Digital Marketing with AI — from PKR 45,000\n- AI Agents — from PKR 50,000\n- Full Stack Web Development — from PKR 75,000\n\n**These are indicative figures.** The final fee, any current discount and scholarship eligibility are confirmed by the admissions office. Instalment plans are available on every course.",
    keywords: ["fee", "fees", "fee structure", "cost", "price", "how much", "charges", "kitni fees", "payment"],
  },
  {
    id: "in-instalments",
    department: "INSTITUTE",
    kind: "POLICY",
    category: "Fees",
    question: "Can I pay the fee in instalments?",
    answer:
      "Yes, every course has an instalment plan.\n\n- **Short courses (6–8 weeks):** 60% at admission, 40% at the midpoint.\n- **Standard courses (2–3.5 months):** 40% at admission, 30% in month 2, 30% before the final project module.\n- **Full Stack Web Development (6 months):** 30% / 25% / 25% / 20% across the programme.\n\nThe admission instalment reserves your seat. Ask the admissions office about custom plans if you need one.",
    keywords: ["instalment", "installment", "easy payment", "monthly", "qist", "kist", "part payment", "plan"],
  },
  {
    id: "in-scholarships",
    department: "INSTITUTE",
    kind: "POLICY",
    category: "Scholarships",
    question: "Do you offer scholarships or discounts?",
    answer:
      "Yes, limited seats each batch:\n\n- **Merit scholarship** — for strong academic results or a demonstrable portfolio.\n- **Need-based support** — for students facing genuine financial hardship.\n- **Women in Tech** — encouraging female participation in AI and development courses.\n- **Sibling & referral discount** — for two or more family members, or when you refer a friend who enrols.\n- **Early-bird discount** — for enrolling before the batch registration deadline.\n\nScholarships are awarded by the admissions committee and cannot be combined. Let me start your inquiry and note that you'd like to be considered.",
    keywords: ["scholarship", "discount", "concession", "free", "financial aid", "wazifa", "reduction", "offer"],
  },
  {
    id: "in-batches",
    department: "INSTITUTE",
    kind: "ARTICLE",
    category: "Batches",
    question: "When do new batches start?",
    answer:
      "New batches typically start at the beginning of each month, with morning, afternoon and evening options. Weekend batches run for working professionals. Seats are limited — most batches cap at 20–25 students so trainers can give individual attention.\n\nTell me which course you're interested in and I'll note your preferred batch timing on your admission inquiry; the admissions office will confirm the exact next start date and remaining seats.",
    keywords: ["batch", "batches", "start date", "when", "next batch", "schedule", "admission open", "new batch", "timing"],
  },
  {
    id: "in-timetable",
    department: "INSTITUTE",
    kind: "ARTICLE",
    category: "Batches",
    question: "What are the class timings and timetable?",
    answer:
      "Standard slots:\n\n- **Morning** — 9:00 AM – 11:00 AM\n- **Afternoon** — 2:00 PM – 4:00 PM\n- **Evening** — 6:00 PM – 8:00 PM\n- **Weekend** — Saturday & Sunday, 10:00 AM – 1:00 PM\n\nMost courses run 3 classes a week at 2 hours each; Full Stack Web Development runs 4 classes a week. Your exact timetable is issued at orientation and is always visible in the student portal.",
    keywords: ["timing", "timetable", "schedule", "class time", "morning", "evening", "weekend", "hours", "days"],
  },
  {
    id: "in-online-classes",
    department: "INSTITUTE",
    kind: "ARTICLE",
    category: "Batches",
    question: "Do you offer online classes?",
    answer:
      "Yes. Most courses run on-campus, online-live, or hybrid. Online-live classes are held on video conferencing with the same trainer, the same schedule and the same projects — sessions are recorded so you can revise later. On-campus students get lab access and in-person project reviews. Tell me which you prefer and I'll note it on your inquiry.",
    keywords: ["online", "online class", "remote", "zoom class", "distance", "virtual", "recorded", "campus"],
  },
  {
    id: "in-student-portal",
    department: "INSTITUTE",
    kind: "ARTICLE",
    category: "Student Services",
    question: "What is the student portal and what can I do there?",
    answer:
      "Every enrolled student gets portal access on orientation day. Inside you can check:\n\n- **Attendance** record and percentage\n- **Assignments** — briefs, due dates, submissions and feedback\n- **Fee status** — paid, pending and upcoming instalments\n- **Results** and assessment scores\n- **Certificates** once your course is complete\n- **LMS** — recorded lectures, slides and resources\n- **Announcements** from your trainer and the institute\n\nIf you're already enrolled and need help with any of these, tell me your roll number and I'll raise a student support ticket.",
    keywords: ["portal", "student portal", "lms", "attendance", "assignment", "result", "fee status", "login", "dashboard"],
  },
  {
    id: "in-attendance-policy",
    department: "INSTITUTE",
    kind: "POLICY",
    category: "Student Services",
    question: "What is the attendance policy?",
    answer:
      "A minimum of **75% attendance** is required to sit the final assessment and receive your certificate. Attendance is marked each class and visible in the student portal. If you fall ill or have an emergency, inform your trainer or the office in advance so it can be recorded as excused. Students who drop below the threshold can usually repeat the missed module with a later batch — talk to the office early rather than late.",
    keywords: ["attendance", "absent", "leave", "75", "policy", "miss class", "hazri"],
  },
  {
    id: "in-certification",
    department: "INSTITUTE",
    kind: "ARTICLE",
    category: "Certification",
    question: "What certificate will I receive?",
    answer:
      "On completing your course you receive a **BITSOL Institute certificate** for that programme, carrying a unique verification code that employers and clients can check. To qualify you need at least 75% attendance, submission of the required assignments, and a passing grade on the final project. Full Stack Web Development awards a **Diploma** rather than a certificate. Certificates are issued within 2–3 weeks of the final assessment and are available in the student portal.",
    keywords: ["certificate", "certification", "diploma", "verify", "recognition", "award", "sanad"],
  },
  {
    id: "in-career-guidance",
    department: "INSTITUTE",
    kind: "ARTICLE",
    category: "Career Guidance",
    question: "Can you help me choose the right course for my goals?",
    answer:
      "Yes — that's what career guidance is for. Tell me four things and I'll recommend a path:\n\n1. **Interest** — do you enjoy design, writing, numbers, tech or talking to people?\n2. **Education** — your current qualification.\n3. **Goal** — a job, freelancing income, or running your own business?\n4. **Experience** — anything you've already tried, even informally.\n\nQuick guide: creative → Graphic Designing or Video Editing · technical → Full Stack Web Development or AI Agents · business-minded → Digital Marketing with AI or Startup with AI · fastest route to income → Freelancing plus one delivery skill.",
    keywords: ["career", "guidance", "which course", "suggest", "recommend", "advice", "confused", "counselling", "best course", "for me"],
  },
  {
    id: "in-jobs",
    department: "INSTITUTE",
    kind: "ARTICLE",
    category: "Career Guidance",
    question: "Will I get a job after completing the course?",
    answer:
      "We don't guarantee jobs — nobody honestly can. What we do provide: a portfolio of real project work, freelancing profile setup and proposal training, CV and LinkedIn review, interview preparation, internship opportunities for top performers, and referrals to our hiring network including BITSOL Marketing itself. Students who complete their projects and actively apply generally find work; students who only attend classes generally don't. The effort matters.",
    keywords: ["job", "jobs", "placement", "employment", "hiring", "salary", "career", "naukri", "work after course"],
  },
  {
    id: "in-internship",
    department: "INSTITUTE",
    kind: "ARTICLE",
    category: "Career Guidance",
    question: "Do you offer internships?",
    answer:
      "Yes. Top-performing students are offered internships with BITSOL Marketing and partner companies after completing their course. Internships run 4–12 weeks on live client projects with a mentor, and carry a completion certificate and a written reference. Selection is based on project quality, attendance and trainer recommendation — not on who asks first.",
    keywords: ["internship", "intern", "experience", "practical", "work experience", "apprenticeship", "training"],
  },
  {
    id: "in-eligibility",
    department: "INSTITUTE",
    kind: "POLICY",
    category: "Admissions",
    question: "What are the eligibility requirements?",
    answer:
      "For most courses: **Matric (10th grade) or above**, basic computer and internet familiarity, and the commitment to attend regularly. Full Stack Web Development recommends Intermediate or above with comfortable English reading and your own laptop. AI Agents expects prior programming or Prompt Engineering experience. Video Editing needs a laptop capable of running editing software. Age is not a barrier — we have students from 16 to 50+.",
    keywords: ["eligibility", "requirement", "qualification", "who can", "age", "matric", "criteria", "laptop", "prerequisite"],
  },
  {
    id: "in-documents",
    department: "INSTITUTE",
    kind: "POLICY",
    category: "Admissions",
    question: "What documents are required for admission?",
    answer:
      "- CNIC or B-Form copy (student)\n- CNIC copy of parent/guardian for students under 18\n- Last qualification certificate or result card\n- Two passport-size photographs\n- Fee payment receipt for the admission instalment\n\nYou can start your inquiry without any documents — they're only needed at registration once your seat is confirmed.",
    keywords: ["documents", "papers", "cnic", "b form", "photo", "required", "bring", "kagzat"],
  },
  {
    id: "in-refund",
    department: "INSTITUTE",
    kind: "POLICY",
    category: "Fees",
    question: "What is the refund policy?",
    answer:
      "Admission fees are non-refundable once a seat is reserved. If you withdraw within the first week of classes, the remaining unused portion of the course fee may be refunded at the administration's discretion after deducting the admission charge. After the first week, fees are not refundable, but a one-time deferral to a later batch can usually be arranged for a genuine reason. Please raise any concern with the office as early as possible.",
    keywords: ["refund", "return fee", "cancel", "withdraw", "money back", "leave course", "policy"],
  },
  {
    id: "in-events",
    department: "INSTITUTE",
    kind: "ARTICLE",
    category: "Events",
    question: "Do you hold events, seminars or free workshops?",
    answer:
      "Regularly. We run free introductory seminars on AI and freelancing, hands-on weekend workshops, guest sessions with industry practitioners, student demo days where final projects are presented, and an annual certificate distribution ceremony. Free seminars are a good way to see the teaching style before committing to a course. Share your contact details and I'll make sure you're informed about the next one.",
    keywords: ["event", "events", "seminar", "workshop", "free class", "demo", "webinar", "session", "ceremony"],
  },
  {
    id: "in-downloads",
    department: "INSTITUTE",
    kind: "DOCUMENT",
    category: "Downloads",
    question: "Can I download the prospectus, course outline or admission form?",
    answer:
      "Yes — the institute prospectus, individual course outlines, the fee structure sheet, the admission form and the academic calendar are all available as downloads. Tell me which one you need and I'll point you to it, or I can email it to you if you share your address. The admissions office can also send anything on WhatsApp.",
    keywords: ["download", "prospectus", "brochure", "pdf", "form", "outline", "curriculum pdf", "calendar", "document"],
  },
  {
    id: "in-contact",
    department: "INSTITUTE",
    kind: "ARTICLE",
    category: "Contact",
    question: "How do I contact the institute or an admission officer?",
    answer: `**Phone / WhatsApp:** ${brand.contact.phone}\n**Email:** ${brand.contact.email}\n**Campus:** ${brand.contact.address}, ${brand.contact.city}\n**Office hours:** ${brand.contact.hours}\n\nOr stay right here — I can start your admission inquiry, answer course and fee questions, or connect you directly to an admission officer for a callback.`,
    keywords: ["contact", "phone", "number", "address", "location", "campus", "admission officer", "call", "whatsapp", "visit"],
  },
  {
    id: "in-marketing-crosslink",
    department: "INSTITUTE",
    kind: "ARTICLE",
    category: "About",
    question: "Do you also provide services for businesses, like building a website?",
    answer:
      "Business services — websites, AI chatbots, WhatsApp automation, digital marketing, software and branding — are handled by our sister company, **BITSOL Marketing**. If you need work done *for* your business rather than training *for* yourself, tell me and I'll switch you over to the BITSOL Marketing side.",
    keywords: ["service", "website banwana", "for my business", "company", "marketing services", "hire", "build", "agency"],
  },
];

/** One knowledge entry per course, derived from the catalogue. */
const COURSE_ENTRIES: KnowledgeEntry[] = INSTITUTE_COURSES.map((course) => ({
  id: `in-course-${course.slug}`,
  department: "INSTITUTE" as const,
  kind: "COURSE" as const,
  category: "Courses",
  question: `Tell me about the ${course.name} course.`,
  answer: [
    `**${course.name}** — ${course.tagline}`,
    "",
    `**Overview**\n${course.overview}`,
    "",
    `**Curriculum**\n${course.curriculum.map((c) => `- ${c}`).join("\n")}`,
    "",
    `**Duration:** ${course.duration}`,
    `**Eligibility:** ${course.eligibility}`,
    "",
    `**Fee**\n${course.fee.startingAt} · ${course.fee.model}\n_${course.fee.note}_`,
    "",
    `**Instalment plan**\n${course.instalments.map((i) => `- **${i.label}:** ${i.detail}`).join("\n")}`,
    "",
    `**Trainer**\n${course.trainer}`,
    "",
    `**Career paths**\n${course.careers.map((c) => `- ${c}`).join("\n")}`,
    "",
    `**Projects you'll build**\n${course.projects.map((p) => `- ${p}`).join("\n")}`,
    "",
    `**Certification**\n${course.certification}`,
  ].join("\n"),
  keywords: [course.slug.replace(/-/g, " "), course.name.toLowerCase(), ...course.keywords],
}));

export const INSTITUTE_KNOWLEDGE_BASE: KnowledgeEntry[] = [
  ...INSTITUTE_ENTRIES,
  ...COURSE_ENTRIES,
];

/** Categories surfaced to the model as its scope statement. */
export const INSTITUTE_KB_CATEGORIES = Array.from(
  new Set(INSTITUTE_KNOWLEDGE_BASE.map((e) => e.category))
);
