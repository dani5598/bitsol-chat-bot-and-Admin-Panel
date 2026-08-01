# BITSOL AI Assistant

One enterprise-grade AI assistant serving **two businesses** under the BITSOL
umbrella, with a strict wall between them:

| | |
| --- | --- |
| 🏢 **BITSOL Marketing** | Business services, digital solutions, AI automation, software development |
| 🎓 **BITSOL Institute of Digital Media & Artificial Intelligence** | Admissions, learning, student services, career guidance |

The assistant works out which business a visitor needs, remembers that choice
for the rest of the conversation, lets them switch at any time — and never mixes
information between the two.

> **Powered by Artificial Intelligence**
> **Designed & Developed by [BITSOL MARKETING](https://bitsolmarketing.com)** —
> _Empowering Businesses & Learners with Artificial Intelligence._

---

## ✨ What's inside

**Conversational layer**
- 👋 Welcome screen: *"Please choose how I can assist you today — 🏢 BITSOL Marketing / 🎓 BITSOL Institute"*
- 🧭 **Department router** — infers the business from the message, sticks to it,
  detects switches, and asks the clarifying question when it genuinely can't tell
- 🌐 **English · Urdu · Roman Urdu · Punjabi**, with RTL rendering and tolerance
  for spelling mistakes, abbreviations and mixed-language input
- 🎨 The whole UI re-themes to the routed brand (blue for Marketing, emerald for Institute)
- 📋 Per-business menu panel, suggestions and quick replies
- 📝 In-chat workflow forms — quote request, consultation booking, admission
  inquiry, support ticket, career guidance — each issuing a real reference number
- 🎙️ Voice input & voice responses, image/PDF attachment, human handoff with ticketing

**Business logic**
- 🏢 11 marketing services, each with overview · benefits · features · process ·
  pricing placeholder · portfolio · FAQ · book meeting · request quote
- 🎓 16 institute courses, each with overview · curriculum · duration · fees ·
  instalments · trainer · careers · projects · certification · enroll
- 🗂️ Two physically separate knowledge bases (`knowledge_base_marketing`,
  `knowledge_base_institute`)

**Admin console** (`/admin`)
- Dashboard with today's chats, both lead pipelines, revenue, popular
  services/courses, open tickets, upcoming meetings & batches, conversion rate,
  satisfaction and a live activity feed
- CRM with **separate pipelines** — marketing leads and admission inquiries —
  plus customers, students, notes, follow-ups and reminders
- Catalogue: services, projects, portfolio, courses, batches, faculty
- Knowledge Base CMS with publish states, versioning and AI indexing
- Support tickets, meetings, quotations, events, media & documents
- WhatsApp templates, broadcasts, notification queue
- Reports & analytics, users, roles & permissions, settings, integrations, logs, AI training

**Platform**
- 🔐 JWT auth, RBAC (roles + permissions), **department-scoped access** enforced
  in the data layer, edge middleware, rate limiting, audit logging
- 🧠 Provider-agnostic AI — Claude (default), any OpenAI-compatible API, local
  Ollama, or Gemini — switched by one env var
- 🐳 Docker, docker-compose, health probe, deployment docs

---

## 🧱 Tech stack

| Layer         | Technology                                                        |
| ------------- | ----------------------------------------------------------------- |
| Framework     | **Next.js 15** (App Router) · **React 19** · **TypeScript**        |
| UI            | **Tailwind CSS** · shadcn/ui-style primitives · **Framer Motion** · **Lucide** |
| Backend       | Next.js **Route Handlers** (Node runtime)                          |
| Database      | **PostgreSQL** via **Prisma ORM**                                  |
| Cache / limit | **Redis** (optional; fails open in dev)                            |
| Auth          | **JWT** (`jose`) + **bcrypt**, RBAC, department scoping            |
| AI            | **Claude** (default) · OpenAI-compatible · Ollama · Gemini         |
| Deployment    | **Docker** · **PM2/Nginx** ready · GitHub Actions friendly         |

---

## 🚀 Quick start

### Prerequisites
- Node.js 20+ (22 recommended)
- PostgreSQL 14+ and (optionally) Redis — or use the provided Docker services

```bash
# 1. Install
npm install

# 2. Configure
cp .env.example .env
#    set at minimum: DATABASE_URL, JWT_SECRET, AI_PROVIDER + matching API key

# 3. Optional: start Postgres + Redis
docker compose up -d db redis

# 4. Create the schema and load content
npx prisma migrate dev --name init
npm run db:seed

# 5. Run
npm run dev
```

Open **http://localhost:3000** → **Start a conversation** (or go to `/chat`).
The admin console is at **/admin**.

Seeded accounts (change these before any real deploy):

| Account | Email | Scope |
| --- | --- | --- |
| Super Admin | `admin@bitsol.local` | Both businesses |
| Sales Agent | `sales@bitsol.local` | BITSOL Marketing only |
| Admissions Officer | `admissions@bitsol.local` | BITSOL Institute only |

Passwords come from `SEED_ADMIN_PASSWORD` / `SEED_STAFF_PASSWORD`
(default `ChangeMe#2024`).

---

## 🤖 Choosing an AI provider

Set `AI_PROVIDER` in `.env`:

| `AI_PROVIDER` | Uses                              | Required env                          |
| ------------- | --------------------------------- | ------------------------------------- |
| `claude`      | Anthropic Claude (default)        | `ANTHROPIC_API_KEY`, `AI_MODEL`       |
| `openai`      | OpenAI / Azure / Together / etc.  | `OPENAI_API_KEY`, `OPENAI_BASE_URL`   |
| `ollama`      | Local Ollama (OpenAI-compatible)  | `OPENAI_BASE_URL=http://localhost:11434/v1` |
| `gemini`      | Google Gemini                     | `GEMINI_API_KEY`, `AI_MODEL`          |

`AI_MODEL` defaults to `claude-opus-4-8`. Set `AI_THINKING=true` for Claude
adaptive thinking (deeper, slower).

Without a key the UI still runs — sending a message shows a graceful error.

---

## 🧭 How department routing works

```
User message
   │
   ├─ Explicit pick from the welcome menu / switcher?      → use it
   ├─ Names a business ("BITSOL Institute", 🎓)?           → use it
   ├─ Strong keyword signal in this message?               → use it
   │     (and if it contradicts the current department by a
   │      wide margin, treat it as a department switch)
   ├─ Department already pinned to the conversation?       → keep it
   ├─ Signal anywhere in recent history?                   → use it
   └─ Otherwise                                            → ask:
        "Would you like help with BITSOL Marketing services
         or BITSOL Institute admissions and courses?"
```

The decision is made in [`src/lib/ai/router.ts`](src/lib/ai/router.ts) before any
tokens are generated, streamed to the browser as a `meta` SSE event (so the UI
re-themes immediately), and persisted on the conversation.

Separation is enforced at three layers:

1. **Data** — `retrieveKnowledge(department, …)` has no unscoped mode, and the two
   knowledge bases are different tables.
2. **Prompt** — the department system prompt forbids discussing the other
   business beyond offering to switch.
3. **Access** — staff scoped to one business cannot read the other's records,
   checked in `src/lib/admin/queries.ts` and every admin API route.

---

## 📁 Project structure

```
.
├── prisma/
│   ├── schema.prisma              # dual-department domain model
│   └── seed.ts                    # RBAC, users, catalogues, KBs, settings
├── src/
│   ├── app/
│   │   ├── (auth)/login/          # staff sign-in / register
│   │   ├── (chat)/chat/           # the assistant
│   │   ├── (admin)/admin/         # admin console (26 modules)
│   │   ├── about/  page.tsx  layout.tsx  globals.css
│   │   └── api/
│   │       ├── chat/              # streaming chat (SSE) + routing
│   │       ├── leads/ admissions/ meetings/ tickets/
│   │       ├── catalog/ search/ health/ auth/
│   │       └── admin/             # record updates, CRM activities
│   ├── components/
│   │   ├── chat/                  # ChatWindow, DepartmentPicker, MenuPanel, WorkflowForm
│   │   ├── admin/                 # AdminShell, nav, tables, status controls
│   │   ├── branding/ splash/ ui/
│   ├── data/
│   │   ├── marketing/             # services · knowledge base · menu
│   │   ├── institute/             # courses  · knowledge base · menu
│   │   └── index.ts               # department content registry
│   ├── lib/
│   │   ├── brands.ts              # the two business profiles
│   │   ├── i18n.ts                # EN / UR / Roman UR / PA
│   │   ├── ai/                    # router · retrieval · prompts · intents · providers
│   │   ├── admin/queries.ts       # scoped, failure-tolerant data access
│   │   └── auth.ts db.ts redis.ts config.ts notify.ts api.ts session.ts
│   ├── middleware.ts              # admin console guard
│   └── types/
├── Dockerfile · docker-compose.yml · .env.example
└── docs/  (ARCHITECTURE.md · DEPLOYMENT.md · API.md)
```

---

## 🐳 Run with Docker

```bash
cp .env.example .env            # set secrets
docker compose up -d --build
docker compose exec web npx prisma migrate deploy
docker compose exec web npm run db:seed
```
App on **http://localhost:3000**, Postgres on `5432`, Redis on `6379`.

---

## ⚠️ Before going live

Pricing and fees ship as **clearly-labelled placeholders**, and contact details
as representative defaults. The assistant always presents them as indicative and
offers a written quotation or an admissions call for the real figure — but they
must still be reviewed:

1. `src/data/marketing/services.ts` — service pricing
2. `src/data/institute/courses.ts` — course fees and instalment plans
3. `src/lib/brands.ts` — phone, WhatsApp, email, address and hours for both businesses
4. Re-run `npm run db:seed` to push the changes into the database

---

## 📜 Scripts

| Command                 | Description                               |
| ----------------------- | ----------------------------------------- |
| `npm run dev`           | Start the dev server                      |
| `npm run build`         | Production build (runs `prisma generate`) |
| `npm start`             | Start the production server               |
| `npm run typecheck`     | TypeScript check                          |
| `npm run prisma:migrate`| Create/apply a dev migration              |
| `npm run db:seed`       | Seed RBAC, catalogues and knowledge bases |
| `npm run prisma:studio` | Open Prisma Studio                        |

---

<div align="center">

**Designed & Developed by [BITSOL MARKETING](https://bitsolmarketing.com)**
_Empowering Businesses & Learners with Artificial Intelligence._

</div>
