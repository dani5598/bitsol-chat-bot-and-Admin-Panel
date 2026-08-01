# Architecture — BITSOL AI Assistant

_Designed & Developed by BITSOL MARKETING_

One application, two businesses, one strict wall between them.

| | |
| --- | --- |
| 🏢 **BITSOL Marketing** | Business services, digital solutions, AI automation, software development |
| 🎓 **BITSOL Institute of Digital Media & AI** | Admissions, learning, student services, career guidance |

---

## 1. System overview

```
                        ┌──────────────────────────────┐
  Visitor ──────────────▶  /chat  (ChatWindow, client) │
                        └───────────────┬──────────────┘
                                        │ POST /api/chat  { messages, department }
                                        ▼
                        ┌──────────────────────────────┐
                        │  planAssistantTurn()         │
                        │   1. routeDepartment()       │  ← which business?
                        │   2. detectLanguage()        │  ← EN / UR / Roman UR / PA
                        │   3. retrieveKnowledge(dept) │  ← scoped, never unscoped
                        │   4. buildSystemPrompt()     │  ← routing OR department prompt
                        └───────────────┬──────────────┘
                                        │
      SSE  meta → chunk… → done         ▼
   ◀────────────────────────  AI provider (Claude / OpenAI / Ollama / Gemini)
                                        │
                                        ▼
                        ┌──────────────────────────────┐
                        │  Persistence (best effort)   │
                        │  conversations · messages    │
                        │  tickets · notifications     │
                        │  system_logs                 │
                        └──────────────────────────────┘

  Staff ────▶ /admin  ──▶ middleware ──▶ requireAdmin() ──▶ scoped Prisma queries
```

**Stack.** Next.js 15 App Router (React 19, TypeScript) serving both UI and API
route handlers on the Node runtime. PostgreSQL via Prisma is the system of
record; Redis provides rate limiting and caching.

---

## 2. The department model

`Department = "MARKETING" | "INSTITUTE"` is the most important value in the
system. Everything derives from it: theme, menu, suggestions, knowledge base,
workflows, reference-number prefix, notification recipient and staff access.

### Routing precedence

Implemented in [`src/lib/ai/router.ts`](../src/lib/ai/router.ts):

1. **Explicit UI pick** — welcome screen or the switcher in the chat header.
2. **Explicit naming** — "BITSOL Institute", "the institute", 🎓, etc.
3. **Keyword scoring of the newest message** — weighted signals (3 = decisive,
   2 = strong, 1 = supporting), including Urdu and Roman Urdu terms. A strong
   signal for the *other* business, beating the current one by a wide margin, is
   treated as a department switch.
4. **Sticky memory** — a neutral follow-up ("and the price?") stays where it was.
5. **Recent history** — for the first turns only.
6. **Undetermined** — returns `null`, and the assistant asks:
   _"Would you like help with BITSOL Marketing services or BITSOL Institute
   admissions and courses?"_

Scoring is deliberately conservative: a winner needs both a confidence share
above `0.55` **and** a margin of at least 2 points, so "I want a course for my
company" falls through to the question rather than guessing.

### Three enforcement layers

Business separation is structural, not a convention:

| Layer | Mechanism |
| --- | --- |
| **Data** | `retrieveKnowledge(department, query)` has no unscoped overload. The two knowledge bases are different tables (`knowledge_base_marketing`, `knowledge_base_institute`). |
| **Prompt** | The department system prompt names the current business, forbids blending the other's content, and instructs the model to offer a switch instead. |
| **Access** | `sessionDepartment()` / `scope()` add a `department` filter to admin queries; `canAccessDepartment()` gates every admin write. Scoped staff get a 404/403, not a filtered view. |

---

## 3. Layers

### Presentation
- `src/app/(chat)/chat` — the assistant, wrapped in `data-department` so the CSS
  variable palette in `globals.css` re-themes everything inside it.
- `src/app/(admin)/admin` — server-component modules; all data fetching is
  server-side, with small client islands (`StatusSelect`, `ActivityComposer`)
  for inline mutations.
- `src/app/(auth)/login`, `/`, `/about` — public surfaces.

### Domain content
`src/data` is the content registry. `departmentContent(department)` is the only
way to reach a business's knowledge base, menu, suggestions and quick replies —
you cannot hold a `MARKETING` value and read Institute content.

- `marketing/services.ts` — 11 services × (overview, benefits, features,
  process, pricing placeholder, portfolio, FAQs, keywords)
- `institute/courses.ts` — 16 courses × (overview, curriculum, duration, fee,
  instalments, trainer, careers, projects, certification, eligibility)
- `*/knowledge-base.ts` — hand-written company entries **plus** one auto-derived
  entry per service/course, so a catalogue edit updates the assistant's answers
  in exactly one place.

### AI
`src/lib/ai/` isolates every model detail behind one interface:

```ts
interface AIProvider {
  name: string;
  streamChat(opts): AsyncGenerator<string>;  // yields text chunks
}
```

- `router.ts` — the department decision described above.
- `knowledge.ts` — keyword-overlap retrieval, scoped by department.
  Dependency-free by design so the system runs anywhere; swapping in vector
  search touches only this file because every call site already passes a
  department.
- `system-prompt.ts` — three prompts: routing (no department yet), Marketing,
  Institute.
- `intents.ts` — deterministic detection of escalation and workflow forms, plus
  context-aware quick replies. The model writes prose; this module decides what
  the product *does*, so behaviour stays predictable and testable.
- `providers/` — Claude (default, `claude-opus-4-8`), OpenAI-compatible, Ollama
  and Gemini. Selection is by `AI_PROVIDER`; nothing else knows which model runs.

### Persistence
Prisma over PostgreSQL. Table names map to the collection names in the brief:
`marketing_leads`, `marketing_services`, `customers`, `projects`, `quotes`,
`students`, `admissions`, `courses`, `faculty`, `batches`, `attendance`,
`certificates`, `knowledge_base_marketing`, `knowledge_base_institute`,
`tickets`, `conversations`, `notifications`, `users`, `roles`, `permissions`,
`settings`, `system_logs` — plus `enrollments`, `assignments`, `submissions`,
`meetings`, `crm_activities`, `media_assets`, `events`, `broadcasts`,
`whatsapp_templates`, `portfolio_items`, `reviews` and `analytics_daily`.

Chat persistence is **best effort**: a database outage degrades history and
analytics but never breaks a conversation.

---

## 4. Streaming protocol

`POST /api/chat` returns Server-Sent Events:

| Event | Payload | Purpose |
| --- | --- | --- |
| `meta` | `{ department, language }` | Sent **before** generation so the UI re-themes and switches menus while the model is still thinking |
| `chunk` | `{ text }` | Incremental response text |
| `done` | `{ ticketId?, department, suggestions?, action? }` | Final state: escalation reference, follow-up chips, and any workflow form to open |
| `error` | `{ message }` | Friendly failure |

`action` is what turns "I want a quote" into a form instead of nine
conversational turns. The client opens the matching `WorkflowForm`, which POSTs
to `/api/leads`, `/api/admissions`, `/api/meetings` or `/api/tickets`.

---

## 5. Reference numbers

Every customer-facing record gets a readable, department-prefixed reference:

```
BM-LEAD-7F3K2Q9A     BITSOL Marketing lead
BI-ADM-4X8T2M6C      BITSOL Institute admission inquiry
BM-MTG-…  BI-MTG-…   Meeting
BM-TKT-…  BI-TKT-…   Support ticket
BX-CONV-…            Conversation (before a department is known)
```

The alphabet excludes look-alike characters (`0/O`, `1/I/L`) so references can be
read aloud over the phone or WhatsApp without ambiguity.

---

## 6. Multilingual support

`src/lib/i18n.ts` classifies each message as `en`, `ur`, `ur_roman` or `pa`:

- Arabic script present → Urdu, unless ≥2 Punjabi Shahmukhi markers → Punjabi
- Otherwise Roman-script keyword scoring, requiring either two distinct markers
  or one in a very short message — so an English sentence containing "hai" or
  "ap" isn't misclassified

The result drives the prompt's language directive, RTL rendering, the
speech-synthesis/recognition BCP-47 tag, and the small UI dictionary. Full page
copy stays in English; conversational content is generated in the user's
language by the model.

---

## 7. Security

| Concern | Control |
| --- | --- |
| Authentication | JWT (`jose`, HS256, Edge-safe) in an httpOnly, SameSite=Lax cookie; bcrypt password hashing |
| Authorisation | Coarse `UserRole` tier + fine-grained `Role`/`Permission` RBAC + department scoping |
| Admin access | Edge middleware → `requireAdmin()` in the layout → per-route checks (defence in depth) |
| Input validation | Zod on every route handler; admin updates use a per-entity allow-list so no arbitrary field can be written |
| Rate limiting | Redis fixed-window — 30 chat messages/min per IP, 5–6 submissions per 10 min; fails open when Redis is absent |
| SQL injection | Prisma parameterised queries only |
| XSS | React escaping; no `dangerouslySetInnerHTML`; the message renderer is a safe text formatter |
| Secrets | Environment variables only; the Integrations page reports configured/not and never returns a value |
| Audit | `system_logs` records action, entity, actor, IP and metadata for every mutation |
| PII | The assistant is instructed never to request passwords, OTPs, card or CNIC numbers in chat |

---

## 8. Accessibility & performance

Keyboard-navigable controls, ARIA labels on icon buttons, screen-reader text on
the typing indicator, RTL rendering for Urdu and Punjabi, high-contrast palettes
in light and dark, streaming responses for perceived speed, server components
throughout the admin console, standalone Docker output, and SEO metadata in
`layout.tsx`.

---

## 9. Extension points

- **Vector search** — replace the body of `retrieveKnowledge`; call sites unchanged.
- **A third business** — add a profile to `BRANDS`, a folder under `src/data`, an
  entry in the content registry, signal lists in the router, and a
  `[data-department="…"]` palette. No component changes.
- **Notification delivery** — a worker reads `notifications` (status `QUEUED`)
  and delivers via SMTP/SMS/WhatsApp. Queueing is already wired; transport is
  deliberately out-of-band so a slow provider can't block a request.
- **Student portal / LMS** — `enrollments`, `attendance`, `assignments`,
  `submissions` and `certificates` are modelled and seeded; add the
  student-facing routes on top.
