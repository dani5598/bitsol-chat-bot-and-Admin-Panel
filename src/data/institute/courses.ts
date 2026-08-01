import type { CourseItem } from "@/types";

/**
 * =============================================================================
 *  BITSOL Institute of Digital Media & Artificial Intelligence — course catalogue
 * =============================================================================
 *
 *  Each course carries the structure the brief asks for:
 *    Overview · Curriculum · Duration · Fees · Instalments · Trainer ·
 *    Career · Projects · Certification  (+ "Enroll" is a chat action).
 *
 *  FEES ARE PLACEHOLDERS. `fee.note` is rendered verbatim so a figure is never
 *  presented as confirmed. Update from Admin → Courses once the fee structure
 *  is approved; the seed script mirrors this file into the `courses` table.
 * =============================================================================
 */

const FEE_NOTE =
  "Indicative fee only — final fee, discounts and scholarship eligibility are confirmed by the admissions office.";

/** The standard instalment plan offered on most programmes. */
const STANDARD_INSTALMENTS = [
  { label: "Admission", detail: "40% at enrolment to confirm your seat" },
  { label: "Instalment 2", detail: "30% at the start of month 2" },
  { label: "Instalment 3", detail: "30% before the final project module" },
];

const SHORT_INSTALMENTS = [
  { label: "Admission", detail: "60% at enrolment to confirm your seat" },
  { label: "Instalment 2", detail: "40% at the midpoint of the course" },
];

export const INSTITUTE_COURSES: CourseItem[] = [
  // ------------------------------------------------------- Marketing track
  {
    slug: "digital-marketing",
    name: "Digital Marketing",
    group: "Digital Marketing",
    tagline: "The complete foundation — strategy, ads, content and analytics.",
    overview:
      "A practical, end-to-end digital marketing programme. You learn how customers are found, attracted and converted online, then run real campaigns with real budget under supervision. By the end you can plan a strategy, launch paid campaigns, produce content and report on results with confidence.",
    curriculum: [
      "Digital marketing landscape, funnels and buyer psychology",
      "Market, competitor and audience research",
      "Content marketing and copywriting that converts",
      "Social media strategy across Facebook, Instagram, TikTok and LinkedIn",
      "Meta Ads Manager — campaign structure, audiences, creative testing",
      "Google Ads — search, display, YouTube and shopping basics",
      "Email marketing and automation flows",
      "Landing pages and conversion rate optimisation",
      "Google Analytics 4, Tag Manager and reporting dashboards",
      "Budgeting, ROI measurement and client reporting",
      "Live campaign lab with real ad spend",
    ],
    duration: "3 months · 3 classes per week · 2 hours per class",
    fee: { startingAt: "From PKR 35,000", model: "Full course fee", note: FEE_NOTE },
    instalments: STANDARD_INSTALMENTS,
    trainer: "Senior digital marketing strategist with agency campaign experience",
    careers: [
      "Digital Marketing Executive",
      "Social Media Manager",
      "Performance Marketing Associate",
      "Freelance marketing consultant",
      "In-house marketer for a family business",
    ],
    projects: [
      "Full digital marketing strategy for a real local business",
      "Live Meta ads campaign managed end to end",
      "Content calendar and 30-day publishing plan",
      "Analytics dashboard and monthly client report",
    ],
    certification: "BITSOL Institute Certificate in Digital Marketing",
    eligibility: "Matric or above · basic computer and internet familiarity",
    keywords: [
      "digital marketing", "marketing course", "ads", "facebook ads", "google ads",
      "online marketing", "marketing", "ppc",
    ],
  },

  {
    slug: "digital-marketing-with-ai",
    name: "Digital Marketing with AI",
    group: "Digital Marketing",
    tagline: "Do a marketing team's work with AI as your co-pilot.",
    overview:
      "Our flagship programme. Everything in the core digital marketing course, rebuilt around AI: generating campaign strategy, producing creative at scale, writing ad copy variants in seconds, automating reporting and building an AI assistant that handles customer replies. This is how modern marketers work.",
    curriculum: [
      "Digital marketing foundations and funnel design",
      "AI tools landscape for marketers — what to use for what",
      "Prompt engineering for research, strategy and copywriting",
      "AI-generated ad creative, images and short-form video",
      "AI-assisted Meta and Google campaign building",
      "SEO content production with AI (without getting penalised)",
      "Automating reporting and insights with AI",
      "Building a marketing chatbot for lead capture",
      "AI workflow automation for agencies and freelancers",
      "Ethics, accuracy checking and brand safety",
      "Capstone: run an AI-powered campaign for a real client",
    ],
    duration: "3.5 months · 3 classes per week · 2 hours per class",
    fee: { startingAt: "From PKR 45,000", model: "Full course fee", note: FEE_NOTE },
    instalments: STANDARD_INSTALMENTS,
    trainer: "AI marketing specialist from the BITSOL Marketing delivery team",
    careers: [
      "AI Marketing Specialist",
      "Growth Marketer",
      "Marketing Automation Executive",
      "High-value freelance marketer",
      "Agency owner",
    ],
    projects: [
      "AI-assisted campaign strategy and creative set",
      "Working marketing chatbot trained on a business's content",
      "Automated weekly reporting workflow",
      "Full client campaign from brief to results report",
    ],
    certification: "BITSOL Institute Certificate in AI-Powered Digital Marketing",
    eligibility: "Matric or above · basic computer skills · no AI experience needed",
    keywords: [
      "digital marketing with ai", "ai marketing", "marketing with ai",
      "ai course", "chatgpt marketing", "ai tools", "flagship",
    ],
  },

  {
    slug: "seo",
    name: "SEO",
    group: "Digital Marketing",
    tagline: "Rank businesses on Google — a skill clients pay monthly for.",
    overview:
      "A specialist course in search engine optimisation. You learn technical SEO, keyword research, on-page optimisation, content strategy, link building and local SEO, and practise on live websites. SEO is one of the most reliable recurring-income skills in freelancing.",
    curriculum: [
      "How search engines crawl, index and rank",
      "Keyword research and search intent mapping",
      "On-page SEO — titles, structure, internal linking, schema",
      "Technical SEO — speed, Core Web Vitals, crawl budget, indexation",
      "Content strategy and SEO writing",
      "Off-page SEO and safe link building",
      "Local SEO and Google Business Profile optimisation",
      "E-commerce SEO essentials",
      "Tools: Search Console, Ahrefs/Semrush, Screaming Frog, GA4",
      "SEO audits, proposals and client reporting",
    ],
    duration: "2 months · 3 classes per week · 2 hours per class",
    fee: { startingAt: "From PKR 30,000", model: "Full course fee", note: FEE_NOTE },
    instalments: SHORT_INSTALMENTS,
    trainer: "SEO consultant managing live client ranking campaigns",
    careers: [
      "SEO Executive / Specialist",
      "Content strategist",
      "Freelance SEO consultant (monthly retainers)",
      "In-house SEO for e-commerce",
    ],
    projects: [
      "Complete technical SEO audit of a live website",
      "Keyword map and content plan for a real business",
      "On-page optimisation implemented and measured",
      "Monthly SEO client report",
    ],
    certification: "BITSOL Institute Certificate in Search Engine Optimisation",
    eligibility: "Matric or above · comfortable using a computer and browser",
    keywords: ["seo", "search engine", "ranking", "google ranking", "keywords", "backlinks"],
  },

  {
    slug: "social-media-marketing",
    name: "Social Media Marketing",
    group: "Digital Marketing",
    tagline: "Grow pages, run ads, manage clients.",
    overview:
      "A focused course on building and monetising social media presence: content strategy, short-form video, community growth, paid promotion and managing multiple client accounts professionally.",
    curriculum: [
      "Platform mechanics — Facebook, Instagram, TikTok, LinkedIn, YouTube",
      "Content pillars, calendars and batching",
      "Short-form video: hooks, editing, retention",
      "Copywriting for social captions and hooks",
      "Organic growth tactics and algorithm behaviour",
      "Paid promotion and boosting fundamentals",
      "Community management, DMs and reputation handling",
      "Influencer collaboration and UGC",
      "Analytics, reporting and client communication",
      "Packaging and pricing a social media management service",
    ],
    duration: "2 months · 3 classes per week · 2 hours per class",
    fee: { startingAt: "From PKR 28,000", model: "Full course fee", note: FEE_NOTE },
    instalments: SHORT_INSTALMENTS,
    trainer: "Social media manager running multi-brand content operations",
    careers: [
      "Social Media Manager",
      "Content Creator",
      "Community Manager",
      "Freelance social media handler",
    ],
    projects: [
      "30-day content calendar with produced assets",
      "Short-form video series with performance analysis",
      "Client-ready social media proposal and pricing sheet",
    ],
    certification: "BITSOL Institute Certificate in Social Media Marketing",
    eligibility: "Matric or above · active social media user",
    keywords: [
      "social media", "smm", "instagram", "facebook", "tiktok", "content creation",
      "social media marketing", "page management",
    ],
  },

  // ----------------------------------------------------------- Design track
  {
    slug: "graphic-designing",
    name: "Graphic Designing",
    group: "Design & Media",
    tagline: "From tools to taste — design that clients approve first time.",
    overview:
      "A complete graphic design programme covering design principles, typography, colour and layout alongside professional tooling in Photoshop, Illustrator, Canva and Figma. You finish with a portfolio strong enough to win freelance work.",
    curriculum: [
      "Design principles — balance, hierarchy, contrast, whitespace",
      "Colour theory and building palettes",
      "Typography and pairing rules",
      "Adobe Photoshop — retouching, compositing, effects",
      "Adobe Illustrator — vector, logos, iconography",
      "Canva and Figma for fast client work",
      "Social media creative and ad design",
      "Logo and brand identity design",
      "Print design — flyers, banners, packaging, prepress basics",
      "AI image tools in a professional design workflow",
      "Portfolio building and client presentation",
    ],
    duration: "3 months · 3 classes per week · 2 hours per class",
    fee: { startingAt: "From PKR 32,000", model: "Full course fee", note: FEE_NOTE },
    instalments: STANDARD_INSTALMENTS,
    trainer: "Practising brand designer with agency and freelance clients",
    careers: [
      "Graphic Designer",
      "Brand Identity Designer",
      "Social Media Designer",
      "Freelance designer on Fiverr/Upwork",
      "In-house designer",
    ],
    projects: [
      "Complete brand identity — logo, palette, typography, guidelines",
      "Social media creative set for a real business",
      "Print collateral: flyer, standee and packaging mockup",
      "10-piece professional portfolio",
    ],
    certification: "BITSOL Institute Certificate in Graphic Designing",
    eligibility: "Matric or above · basic computer skills",
    keywords: [
      "graphic design", "graphics", "designing", "photoshop", "illustrator",
      "canva", "logo design", "design course", "adobe",
    ],
  },

  {
    slug: "video-editing",
    name: "Video Editing",
    group: "Design & Media",
    tagline: "Edit the short-form video every brand is desperate for.",
    overview:
      "Professional video editing for social media and commercial work. Premiere Pro and CapCut for editing, After Effects for motion graphics, plus colour, sound and the storytelling craft that separates a good edit from a viral one.",
    curriculum: [
      "Video storytelling, pacing and structure",
      "Adobe Premiere Pro — full editing workflow",
      "CapCut for fast mobile-first short-form editing",
      "After Effects — motion graphics, titles, transitions",
      "Colour correction and grading",
      "Audio editing, mixing and music selection",
      "Reels, TikTok and YouTube Shorts formats and hooks",
      "Subtitles, captions and accessibility",
      "AI video tools — generation, upscaling, auto-captioning",
      "Client delivery, revisions and file management",
    ],
    duration: "2.5 months · 3 classes per week · 2 hours per class",
    fee: { startingAt: "From PKR 32,000", model: "Full course fee", note: FEE_NOTE },
    instalments: STANDARD_INSTALMENTS,
    trainer: "Video editor producing commercial and social content",
    careers: [
      "Video Editor",
      "Motion Graphics Designer",
      "Content Producer",
      "Freelance short-form editor (high demand internationally)",
      "YouTube channel manager",
    ],
    projects: [
      "Brand commercial edit with motion graphics",
      "Series of 10 short-form reels with hooks and captions",
      "Documentary-style edit with colour grade and sound mix",
      "Showreel for client pitching",
    ],
    certification: "BITSOL Institute Certificate in Video Editing & Motion Graphics",
    eligibility: "Matric or above · a laptop capable of running editing software",
    keywords: [
      "video editing", "video", "premiere", "after effects", "capcut", "reels",
      "editing course", "motion graphics", "youtube editing",
    ],
  },

  // ------------------------------------------------------ Development track
  {
    slug: "full-stack-web-development",
    name: "Full Stack Web Development",
    group: "Development",
    tagline: "Build complete web applications, front to back.",
    overview:
      "The most technical programme we offer. You start with HTML, CSS and JavaScript, move through React and Next.js on the front end, then Node.js, databases and APIs on the back end — and deploy real, working applications you can show an employer.",
    curriculum: [
      "HTML5, CSS3 and responsive layout (Flexbox, Grid)",
      "Tailwind CSS and modern component styling",
      "JavaScript fundamentals through to ES6+ and async",
      "Git, GitHub and collaborative workflow",
      "React — components, state, hooks, routing",
      "Next.js — rendering strategies, routing, server components",
      "Node.js and Express API development",
      "Databases — PostgreSQL and MongoDB, schema design",
      "Authentication, authorisation and security basics",
      "REST APIs, third-party integration and payments",
      "Testing, debugging and performance",
      "Deployment, hosting, CI/CD and domains",
      "AI-assisted coding as a professional workflow",
    ],
    duration: "6 months · 4 classes per week · 2 hours per class",
    fee: { startingAt: "From PKR 75,000", model: "Full course fee", note: FEE_NOTE },
    instalments: [
      { label: "Admission", detail: "30% at enrolment to confirm your seat" },
      { label: "Instalment 2", detail: "25% at the start of month 2" },
      { label: "Instalment 3", detail: "25% at the start of month 4" },
      { label: "Instalment 4", detail: "20% before the final project module" },
    ],
    trainer: "Full stack engineer shipping production systems at BITSOL",
    careers: [
      "Frontend Developer",
      "Backend Developer",
      "Full Stack Developer",
      "Freelance web application developer",
      "Startup technical co-founder",
    ],
    projects: [
      "Responsive multi-page website from a design file",
      "React dashboard consuming a live API",
      "Full stack application with authentication and database",
      "E-commerce build with payments, deployed to production",
    ],
    certification: "BITSOL Institute Diploma in Full Stack Web Development",
    eligibility:
      "Intermediate or above recommended · strong English reading · own laptop required",
    keywords: [
      "web development", "full stack", "mern", "react", "nextjs", "node",
      "javascript", "programming", "coding", "developer", "frontend", "backend",
    ],
  },

  {
    slug: "wordpress",
    name: "WordPress Development",
    group: "Development",
    tagline: "Build client websites in days, not months.",
    overview:
      "Learn to build professional, fast, secure WordPress websites without deep coding — using Elementor, WooCommerce and the plugin ecosystem. The fastest route from zero to a paid web development service.",
    curriculum: [
      "Hosting, domains, cPanel and WordPress installation",
      "WordPress core — posts, pages, media, menus, users",
      "Themes and child themes",
      "Elementor page building and responsive design",
      "Essential plugins and how to choose safely",
      "WooCommerce — products, checkout, shipping, payments",
      "On-page SEO with Yoast/Rank Math",
      "Speed optimisation and caching",
      "Security hardening, backups and maintenance",
      "Migration, staging and client handover",
      "Pricing, proposals and selling WordPress services",
    ],
    duration: "2 months · 3 classes per week · 2 hours per class",
    fee: { startingAt: "From PKR 28,000", model: "Full course fee", note: FEE_NOTE },
    instalments: SHORT_INSTALMENTS,
    trainer: "WordPress developer delivering client sites weekly",
    careers: [
      "WordPress Developer",
      "Freelance web designer",
      "Web maintenance retainer provider",
      "Agency web builder",
    ],
    projects: [
      "Business website built and deployed live",
      "WooCommerce store with payment gateway",
      "Website speed and SEO optimisation case study",
    ],
    certification: "BITSOL Institute Certificate in WordPress Development",
    eligibility: "Matric or above · basic computer skills",
    keywords: ["wordpress", "elementor", "woocommerce", "website builder", "cms", "wp"],
  },

  {
    slug: "shopify",
    name: "Shopify & E-Commerce",
    group: "Development",
    tagline: "Launch and run stores that actually sell.",
    overview:
      "Everything needed to build, launch and manage Shopify stores — for your own products or as a paid service. Covers store setup, theme customisation, product strategy, apps, conversion optimisation and international dropshipping fundamentals.",
    curriculum: [
      "E-commerce business models and product research",
      "Shopify store setup, settings and navigation",
      "Theme selection and customisation (Liquid basics)",
      "Product pages that convert — copy, images, trust signals",
      "Collections, variants, inventory and shipping rules",
      "Payment gateways for Pakistan and international selling",
      "Essential apps and integrations",
      "Conversion rate optimisation and checkout tuning",
      "Store SEO and email flows",
      "Dropshipping and supplier management",
      "Store audits and selling Shopify services to clients",
    ],
    duration: "2 months · 3 classes per week · 2 hours per class",
    fee: { startingAt: "From PKR 30,000", model: "Full course fee", note: FEE_NOTE },
    instalments: SHORT_INSTALMENTS,
    trainer: "E-commerce specialist managing live Shopify stores",
    careers: [
      "Shopify Developer / Store Manager",
      "E-commerce Manager",
      "Freelance store builder",
      "Own online store owner",
    ],
    projects: [
      "Fully built and launched Shopify store",
      "Conversion optimisation audit with before/after metrics",
      "Product research and launch plan",
    ],
    certification: "BITSOL Institute Certificate in Shopify & E-Commerce",
    eligibility: "Matric or above · basic computer skills",
    keywords: ["shopify", "ecommerce", "online store", "dropshipping", "store", "e commerce"],
  },

  // ---------------------------------------------------------------- AI track
  {
    slug: "ai-automation",
    name: "AI Automation",
    group: "Artificial Intelligence",
    tagline: "Automate business processes and charge for it.",
    overview:
      "Learn to connect AI to real business systems using n8n, Make and Zapier alongside AI APIs. You'll build automations that handle lead routing, document processing, reporting and customer follow-up — the highest-demand freelance skill of the moment.",
    curriculum: [
      "Automation thinking — identifying what is worth automating",
      "n8n, Make and Zapier fundamentals",
      "APIs, webhooks, JSON and authentication",
      "Connecting AI models into automation workflows",
      "Document and data extraction pipelines",
      "CRM, sheets, email and WhatsApp integrations",
      "Error handling, logging and reliability",
      "Cost control and token efficiency",
      "Packaging automation as a client service",
      "Capstone: a complete automation delivered for a real business",
    ],
    duration: "2.5 months · 3 classes per week · 2 hours per class",
    fee: { startingAt: "From PKR 40,000", model: "Full course fee", note: FEE_NOTE },
    instalments: STANDARD_INSTALMENTS,
    trainer: "Automation engineer from the BITSOL AI delivery team",
    careers: [
      "AI Automation Specialist",
      "Workflow Automation Consultant",
      "Operations Analyst",
      "Freelance automation builder (strong international demand)",
    ],
    projects: [
      "Lead capture → CRM → WhatsApp follow-up automation",
      "Document processing pipeline with AI extraction",
      "Automated weekly reporting workflow",
    ],
    certification: "BITSOL Institute Certificate in AI Automation",
    eligibility: "Matric or above · logical thinking · no coding background required",
    keywords: [
      "ai automation", "automation", "n8n", "make", "zapier", "workflow",
      "no code", "integration",
    ],
  },

  {
    slug: "prompt-engineering",
    name: "Prompt Engineering",
    group: "Artificial Intelligence",
    tagline: "Get expert-level output from AI, reliably and repeatably.",
    overview:
      "A rigorous course in getting professional results from large language models. Structured prompting, context engineering, reasoning techniques, evaluation and building reusable prompt systems for real business tasks — not tricks that stop working next month.",
    curriculum: [
      "How language models actually work (and where they fail)",
      "Prompt anatomy — role, context, task, constraints, format",
      "Few-shot, chain-of-thought and structured output techniques",
      "Context engineering and working with long documents",
      "Retrieval-augmented generation (RAG) fundamentals",
      "Reducing hallucination and verifying output",
      "Prompt evaluation and systematic testing",
      "Building reusable prompt libraries and templates",
      "Domain prompting for marketing, sales, HR and support",
      "Comparing models — Claude, GPT, Gemini — and choosing well",
    ],
    duration: "1.5 months · 3 classes per week · 2 hours per class",
    fee: { startingAt: "From PKR 25,000", model: "Full course fee", note: FEE_NOTE },
    instalments: SHORT_INSTALMENTS,
    trainer: "AI solutions architect working on production LLM systems",
    careers: [
      "Prompt Engineer",
      "AI Content Specialist",
      "AI Operations Associate",
      "Freelance AI consultant",
      "Force multiplier in any existing role",
    ],
    projects: [
      "Prompt library for a specific business function",
      "Evaluated prompt system with measured accuracy",
      "AI-assisted content production pipeline",
    ],
    certification: "BITSOL Institute Certificate in Prompt Engineering",
    eligibility: "Matric or above · good English comprehension",
    keywords: [
      "prompt engineering", "prompting", "chatgpt", "claude", "llm", "ai basics",
      "prompt", "gpt",
    ],
  },

  {
    slug: "ai-agents",
    name: "AI Agents",
    group: "Artificial Intelligence",
    tagline: "Build AI that takes action, not just answers.",
    overview:
      "An advanced course in building autonomous AI agents — systems that use tools, call APIs, make decisions and complete multi-step tasks. You'll build working agents with proper guardrails, memory and monitoring, and learn to sell them as a service.",
    curriculum: [
      "Agent architectures — ReAct, tool use, planning loops",
      "Function/tool calling with modern AI APIs",
      "Memory, state and context management",
      "Multi-agent systems and task decomposition",
      "Guardrails, approval gates and safe action design",
      "Vector databases and retrieval for agent knowledge",
      "Building with agent frameworks and SDKs",
      "Monitoring, logging, evaluation and debugging",
      "Cost, latency and reliability engineering",
      "Capstone: a deployed agent solving a real business task",
    ],
    duration: "2.5 months · 3 classes per week · 2 hours per class",
    fee: { startingAt: "From PKR 50,000", model: "Full course fee", note: FEE_NOTE },
    instalments: STANDARD_INSTALMENTS,
    trainer: "AI engineer building agent systems in production",
    careers: [
      "AI Agent Developer",
      "AI Engineer",
      "AI Solutions Consultant",
      "Technical founder",
    ],
    projects: [
      "Customer support agent with tool access and handoff",
      "Research agent producing structured reports",
      "Operations agent integrated with a live CRM",
    ],
    certification: "BITSOL Institute Certificate in AI Agent Development",
    eligibility:
      "Prompt Engineering or programming background strongly recommended",
    keywords: [
      "ai agents", "agent", "autonomous", "tool calling", "langchain", "rag",
      "ai engineering",
    ],
  },

  {
    slug: "whatsapp-chatbots",
    name: "WhatsApp Chatbots",
    group: "Artificial Intelligence",
    tagline: "Build the bots every local business is asking for.",
    overview:
      "A hands-on course in building WhatsApp chatbots for businesses — from the official Business API setup through conversation design, AI integration, CRM connection and selling the finished product as a recurring-revenue service.",
    curriculum: [
      "WhatsApp Business API — accounts, verification, policies",
      "Conversation design and menu flows",
      "Message templates, approval rules and 24-hour windows",
      "Connecting AI models for natural, trained answers",
      "Lead capture, CRM sync and notifications",
      "Broadcast campaigns and audience segmentation",
      "Human handoff and shared team inbox setup",
      "Testing, analytics and iteration",
      "Compliance — opt-in, opt-out and avoiding bans",
      "Pricing and selling chatbot services with monthly retainers",
    ],
    duration: "1.5 months · 3 classes per week · 2 hours per class",
    fee: { startingAt: "From PKR 30,000", model: "Full course fee", note: FEE_NOTE },
    instalments: SHORT_INSTALMENTS,
    trainer: "Chatbot developer from the BITSOL Marketing automation team",
    careers: [
      "Chatbot Developer",
      "Conversational Designer",
      "Freelance WhatsApp automation provider",
      "Marketing automation executive",
    ],
    projects: [
      "Working WhatsApp bot for a real local business",
      "Broadcast campaign with segmentation and results",
      "Client proposal with monthly retainer pricing",
    ],
    certification: "BITSOL Institute Certificate in WhatsApp Chatbot Development",
    eligibility: "Matric or above · basic computer skills",
    keywords: [
      "whatsapp chatbot", "whatsapp bot", "chatbot course", "whatsapp api",
      "bot building", "conversational",
    ],
  },

  // ------------------------------------------------------- Business & career
  {
    slug: "freelancing",
    name: "Freelancing",
    group: "Business & Career",
    tagline: "Turn a skill into international income.",
    overview:
      "The business side of working for yourself. Profile building on Fiverr and Upwork, gig positioning, proposal writing, client communication, pricing, delivery, dispute handling and getting paid in Pakistan — taught by people who actually earn this way.",
    curriculum: [
      "Choosing and validating a profitable service",
      "Fiverr — gig creation, SEO, images, packages",
      "Upwork — profile, proposals, connects strategy",
      "LinkedIn and direct outreach for higher-value clients",
      "Portfolio building without prior clients",
      "Proposal writing that wins without competing on price",
      "Pricing, packaging and raising your rates",
      "Client communication, scope control and revisions",
      "Delivery, reviews and repeat business",
      "Payments — Payoneer, Wise, bank transfer, tax basics in Pakistan",
      "Scaling from freelancer to small agency",
    ],
    duration: "1.5 months · 3 classes per week · 2 hours per class",
    fee: { startingAt: "From PKR 22,000", model: "Full course fee", note: FEE_NOTE },
    instalments: SHORT_INSTALMENTS,
    trainer: "Top-rated freelancer with a sustained international client base",
    careers: [
      "Independent freelancer",
      "Agency owner",
      "Remote contractor for international clients",
    ],
    projects: [
      "Live, optimised Fiverr and Upwork profiles",
      "Portfolio of 5 client-ready samples",
      "10 real proposals sent with feedback review",
    ],
    certification: "BITSOL Institute Certificate in Professional Freelancing",
    eligibility:
      "Any existing skill (design, writing, marketing, development) · functional English",
    keywords: [
      "freelancing", "fiverr", "upwork", "freelance", "online earning", "remote work",
      "earn online", "dollars",
    ],
  },

  {
    slug: "startup-with-ai",
    name: "Startup with AI",
    group: "Business & Career",
    tagline: "Launch a real business with AI doing the heavy lifting.",
    overview:
      "For founders and aspiring founders. Idea validation, lean business modelling, building an MVP with AI and no-code tools, first customers, pricing, and running lean operations where AI replaces the team you can't yet afford.",
    curriculum: [
      "Idea generation and honest validation",
      "Lean business model and unit economics",
      "Market research and competitor analysis with AI",
      "Building an MVP with no-code and AI tools",
      "Branding and launch assets in days, not months",
      "Getting the first 10 customers",
      "Pricing, offers and sales conversations",
      "AI-run operations — support, content, admin, reporting",
      "Financial basics, runway and cash flow",
      "Pitching, funding options and growth planning",
    ],
    duration: "2 months · 2 classes per week · 2.5 hours per class",
    fee: { startingAt: "From PKR 35,000", model: "Full course fee", note: FEE_NOTE },
    instalments: SHORT_INSTALMENTS,
    trainer: "Founder-practitioner with operating and mentoring experience",
    careers: [
      "Startup founder",
      "Product manager",
      "Business development lead",
      "Innovation consultant",
    ],
    projects: [
      "Validated business model canvas",
      "Working MVP built with AI/no-code tools",
      "Go-to-market plan and pitch deck",
    ],
    certification: "BITSOL Institute Certificate in AI-Powered Entrepreneurship",
    eligibility: "Matric or above · a business idea or genuine intent to start one",
    keywords: [
      "startup", "business", "entrepreneur", "founder", "mvp", "no code",
      "own business", "start business",
    ],
  },

  {
    slug: "tiktok-shop",
    name: "TikTok Shop",
    group: "Business & Career",
    tagline: "Sell on the fastest-growing social commerce platform.",
    overview:
      "A practical course on TikTok Shop: seller account setup, product research, content that converts, affiliate partnerships, live selling and order operations — for your own products or as a managed service for brands.",
    curriculum: [
      "TikTok Shop ecosystem, regions and seller requirements",
      "Seller account setup, verification and compliance",
      "Product research and winning-product criteria",
      "Product listings, pricing and shipping setup",
      "Short-form content that drives purchases",
      "Affiliate and creator partnership programmes",
      "Live selling — setup, script, engagement, conversion",
      "TikTok Ads for Shop and Spark Ads",
      "Order management, fulfilment, returns and reviews",
      "Scaling and managing TikTok Shop for clients",
    ],
    duration: "1.5 months · 3 classes per week · 2 hours per class",
    fee: { startingAt: "From PKR 25,000", model: "Full course fee", note: FEE_NOTE },
    instalments: SHORT_INSTALMENTS,
    trainer: "Social commerce specialist running live TikTok Shop operations",
    careers: [
      "TikTok Shop Seller",
      "Social Commerce Manager",
      "Affiliate marketer",
      "Freelance TikTok Shop manager",
    ],
    projects: [
      "Live seller account with optimised listings",
      "Content series driving measurable orders",
      "Live selling session planned and executed",
    ],
    certification: "BITSOL Institute Certificate in TikTok Shop & Social Commerce",
    eligibility: "Matric or above · smartphone and active TikTok familiarity",
    keywords: [
      "tiktok shop", "tiktok", "social commerce", "live selling", "affiliate",
      "tiktok selling", "online selling",
    ],
  },

  {
    slug: "psx-stock-trading",
    name: "PSX Stock Trading Mastery",
    group: "Business & Career",
    tagline: "Understand the Pakistan Stock Exchange before you risk a rupee in it.",
    overview:
      "A disciplined, practical introduction to investing and trading on the Pakistan Stock Exchange. You learn how the market actually works, how to read a company's financials, how to analyse charts, and — most importantly — how to manage risk. The emphasis throughout is on process and capital preservation rather than tips and predictions.",
    curriculum: [
      "How the PSX works — participants, sessions, settlement and the KSE-100",
      "Opening a CDC sub-account and choosing a broker",
      "Order types, spreads, circuit breakers and market mechanics",
      "Reading financial statements: profit & loss, balance sheet, cash flow",
      "Fundamental analysis — P/E, book value, dividend yield, sector comparison",
      "Technical analysis — trend, support and resistance, volume, indicators",
      "Building a thesis and writing it down before entering a trade",
      "Risk management — position sizing, stop losses, and what you can afford to lose",
      "Portfolio construction and diversification across sectors",
      "Trading psychology: discipline, and why most retail accounts lose money",
      "Taxation, CGT and regulatory basics for Pakistani investors",
      "Paper-trading lab — a full simulated portfolio, reviewed weekly",
    ],
    duration: "2 months · 3 classes per week · 2 hours per class",
    fee: { startingAt: "From PKR 35,000", model: "Full course fee", note: FEE_NOTE },
    instalments: SHORT_INSTALMENTS,
    trainer: "Active PSX market participant with hands-on trading experience",
    careers: [
      "Self-directed investor",
      "Equity research assistant",
      "Brokerage house trainee",
      "Financial content creator",
      "Personal portfolio manager",
    ],
    projects: [
      "Full fundamental analysis of a listed PSX company",
      "Simulated portfolio traded and journalled over the course",
      "Written investment thesis with entry, exit and risk limits",
    ],
    certification: "BITSOL Institute Certificate in Stock Market Investing",
    eligibility:
      "Matric or above · basic numeracy · this is an education course, not investment advice",
    keywords: [
      "psx", "stock", "stocks", "stock market", "trading", "share market",
      "shares", "invest", "investing", "investment", "kse", "kse 100",
      "equity", "broker", "cdc", "portfolio", "stock trading",
    ],
  },
];

/** Groups used by the menu panel and courses landing section. */
export const COURSE_GROUPS = [
  "Digital Marketing",
  "Design & Media",
  "Development",
  "Artificial Intelligence",
  "Business & Career",
] as const;

/** Look up a course by slug. */
export function findCourse(slug: string): CourseItem | undefined {
  return INSTITUTE_COURSES.find((c) => c.slug === slug);
}

/** Best-effort match of free text ("mujhe seo seekhna hai") to a course. */
export function matchCourse(text: string): CourseItem | undefined {
  const q = text.toLowerCase();
  let best: { course: CourseItem; score: number } | null = null;
  for (const course of INSTITUTE_COURSES) {
    let score = 0;
    if (q.includes(course.name.toLowerCase())) score += 5;
    for (const kw of course.keywords) if (q.includes(kw)) score += 2;
    if (score > (best?.score ?? 0)) best = { course, score };
  }
  return best && best.score >= 2 ? best.course : undefined;
}
