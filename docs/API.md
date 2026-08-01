# API Reference — BITSOL AI Assistant

_Designed & Developed by BITSOL MARKETING_

Base URL: `${APP_URL}` (e.g. `http://localhost:3000`). All endpoints are
Next.js Route Handlers running on the Node.js runtime.

`department` is always one of `MARKETING` | `INSTITUTE`.

---

## POST `/api/chat`

Stream an assistant reply. The response is **Server-Sent Events**
(`text/event-stream`); each event is a `data:` line containing JSON.

### Request body
```json
{
  "conversationRef": "BX-CONV-AB12CD34EF",
  "department": "INSTITUTE",
  "requestedDepartment": null,
  "messages": [
    { "role": "user", "content": "SEO course ki fees kitni hai?" }
  ]
}
```

| Field | Required | Meaning |
| --- | --- | --- |
| `messages` | ✅ | 1–50 turns; each `content` 1–4000 chars |
| `conversationRef` | | Groups turns into one conversation; generated if absent |
| `department` | | The business already pinned to this conversation (sticky memory) |
| `requestedDepartment` | | An explicit pick from the welcome menu or switcher — overrides inference |

### Response stream

```
data: {"type":"meta","department":"INSTITUTE","language":"ur_roman"}
data: {"type":"chunk","text":"SEO course 2 mahine ka hai, "}
data: {"type":"chunk","text":"fees PKR 30,000 se shuru hoti hai…"}
data: {"type":"done","department":"INSTITUTE","suggestions":["Instalment plan","Next batch"],"action":{"kind":"ADMISSION_FORM","subject":"seo"}}
```

| `type` | Fields | Meaning |
| --- | --- | --- |
| `meta` | `department`, `language` | Routing outcome, sent **before** generation so the UI can re-theme |
| `chunk` | `text` | Incremental assistant text |
| `done` | `department`, `ticketId?`, `suggestions?`, `action?` | Stream complete |
| `error` | `message` | A recoverable error to show the user |

`action.kind` is one of `LEAD_FORM`, `QUOTE_FORM`, `MEETING_FORM`,
`SUPPORT_FORM`, `ADMISSION_FORM`, `CAREER_FORM`, `CHOOSE_DEPARTMENT`.
`action.subject` pre-selects a service or course slug when the user named one.

`department` is `null` while the assistant is still working out which business
the visitor needs.

### Status codes
`200` stream started · `400` invalid body · `429` rate limited (30 req / 60 s per IP)

```bash
curl -N http://localhost:3000/api/chat \
  -H 'Content-Type: application/json' \
  -d '{"messages":[{"role":"user","content":"I need a chatbot for my business"}]}'
```

---

## POST `/api/leads` — BITSOL Marketing lead capture

```json
{
  "name": "Ali Raza",
  "company": "Raza Traders",
  "phone": "03001234567",
  "email": "ali@example.com",
  "businessType": "Retail",
  "service": "ai-chatbots",
  "budget": "PKR 100,000 – 300,000",
  "timeline": "Within 1 month",
  "requirements": "WhatsApp bot that books orders and answers pricing.",
  "conversationRef": "BX-CONV-AB12CD34EF"
}
```

Required: `name`, `phone`, `requirements`. `service` is a slug from
`/api/catalog?department=MARKETING`.

`201` → `{ "ok": true, "reference": "BM-LEAD-7F3K2Q9A", "message": "…" }`

Creates the lead at stage `NEW`, links it to the conversation, queues a sales
notification and writes an audit entry.

---

## POST `/api/admissions` — BITSOL Institute admission inquiry

```json
{
  "studentName": "Ayesha Khan",
  "fatherName": "Khalid Khan",
  "phone": "03001234567",
  "whatsapp": "03001234567",
  "email": "ayesha@example.com",
  "qualification": "Intermediate / FSc / FA",
  "city": "Faisalabad",
  "course": "digital-marketing-with-ai",
  "preferredBatch": "Evening (6:00 – 8:00 PM)",
  "notes": "Interested in a scholarship.",
  "conversationRef": "BX-CONV-AB12CD34EF"
}
```

Required: `studentName`, `phone`, `course`. `course` accepts a catalogue slug or
free text — an unrecognised course name is still captured so no inquiry is lost.

`201` → `{ "ok": true, "reference": "BI-ADM-4X8T2M6C", "message": "…" }`

Creates the inquiry at stage `INQUIRY` and notifies the admissions team.

---

## POST `/api/meetings` — consultation / counselling booking

```json
{
  "department": "MARKETING",
  "name": "Ali Raza",
  "phone": "03001234567",
  "email": "ali@example.com",
  "businessName": "Raza Traders",
  "preferredDate": "2026-08-14",
  "preferredTime": "3:00 PM",
  "mode": "ZOOM",
  "topic": "AI automation for order handling",
  "conversationRef": "BX-CONV-AB12CD34EF"
}
```

`mode` ∈ `OFFICE` | `ZOOM` | `GOOGLE_MEET` | `WHATSAPP`. Dates in the past are
rejected with `400`.

`201` → `{ "ok": true, "reference": "BM-MTG-…", "message": "…" }`

---

## POST `/api/tickets` — support ticket

```json
{
  "department": "MARKETING",
  "category": "TECHNICAL",
  "name": "Ali Raza",
  "phone": "03001234567",
  "email": "ali@example.com",
  "subject": "Chatbot not replying on WhatsApp",
  "description": "Since this morning the bot stopped answering.",
  "conversationRef": "BX-CONV-AB12CD34EF"
}
```

`category` ∈ `TECHNICAL` | `BILLING` | `SALES` | `COMPLAINT` | `GENERAL`.
Complaints are raised at `HIGH` priority automatically.

`201` → `{ "ok": true, "reference": "BM-TKT-…", "message": "…" }`

---

## GET `/api/catalog`

```
GET /api/catalog?department=MARKETING            → all services
GET /api/catalog?department=INSTITUTE            → all courses
GET /api/catalog?department=INSTITUTE&slug=seo   → one course
```

`department` is mandatory — there is no unscoped catalogue, so a Marketing
client cannot enumerate Institute courses through this route.

`200` → `{ "department", "count", "items": [...] }` or `{ "department", "item" }`
· `400` missing/invalid department · `404` unknown slug

---

## GET `/api/search`

Natural-language knowledge search, scoped to one department.

```
GET /api/search?department=INSTITUTE&q=fees%20kitni%20hain&limit=10
```

`200` → `{ "department", "query", "count", "results": [{ id, category, kind, question, answer }] }`

---

## Auth

| Endpoint | Body | Result |
| --- | --- | --- |
| `POST /api/auth/register` | `{ name, email, password, phone? }` | `200` + `Set-Cookie: bitsol_session` · `409` email taken |
| `POST /api/auth/login` | `{ email, password }` | `200` + cookie · `401` invalid (generic message) |
| `POST /api/auth/logout` | — | `200`, clears the cookie |

The user object includes `role` and `department`, which the client uses to route
staff to `/admin` and everyone else to `/chat`.

---

## Admin (authenticated)

All admin endpoints require a session with role `AGENT`, `INSTRUCTOR`, `ADMIN`
or `SUPER_ADMIN`, and reject records belonging to another business with `403`.

### PATCH `/api/admin/{entity}/{id}`

`entity` ∈ `leads` | `admissions` | `tickets` | `meetings` |
`knowledge-marketing` | `knowledge-institute`

Each entity has its own allow-list schema — no arbitrary field can be written.

```bash
curl -X PATCH http://localhost:3000/api/admin/leads/clx123 \
  -H 'Content-Type: application/json' \
  -d '{"stage":"QUALIFIED"}'
```

| Entity | Writable fields |
| --- | --- |
| `leads` | `stage`, `priority`, `estimatedValue`, `lostReason`, `ownerId` |
| `admissions` | `stage`, `priority`, `lostReason`, `ownerId` |
| `tickets` | `status`, `priority`, `resolution`, `assigneeId` |
| `meetings` | `status`, `meetingLink`, `notes` |
| `knowledge-*` | `state` |

`200` → `{ "ok": true }` · `401` no session · `403` wrong business · `404` unknown entity/record

### POST `/api/admin/activities`

Adds a note, follow-up or reminder to a CRM record's timeline.

```json
{
  "entityType": "MarketingLead",
  "entityId": "clx123",
  "department": "MARKETING",
  "type": "FOLLOW_UP",
  "body": "Called — wants a revised quote for the WhatsApp module.",
  "dueAt": "2026-08-05T10:00:00+05:00"
}
```

`PATCH /api/admin/activities` with `{ id, completed }` marks one complete.

---

## `/webhook` — WhatsApp Cloud API

Called by Meta, not by your front end. Register it at
**Meta ▸ WhatsApp ▸ Configuration ▸ Webhook** and subscribe to `messages`.

`/webhook` is the public callback path; it is rewritten to
`/api/whatsapp/webhook` in `next.config.mjs`, and both answer identically. It is
a rewrite rather than a redirect because Meta does not follow 3xx responses when
delivering a webhook.

### GET — subscription handshake

Meta calls this once when you save the webhook.

| Query param        | Meaning                                        |
| ------------------ | ---------------------------------------------- |
| `hub.mode`         | Always `subscribe`                             |
| `hub.verify_token` | Must equal `WHATSAPP_VERIFY_TOKEN`             |
| `hub.challenge`    | Echoed back verbatim as `text/plain` on success |

`200` challenge echoed · `403` token mismatch · `500` `WHATSAPP_VERIFY_TOKEN` unset.

### POST — inbound messages and delivery receipts

Every request must carry a valid `X-Hub-Signature-256` header — an HMAC-SHA256
of the **raw** body keyed with `WHATSAPP_APP_SECRET`. Unsigned or mis-signed
requests are rejected with `401` and logged as `whatsapp.webhook.rejected`.

```jsonc
{
  "object": "whatsapp_business_account",
  "entry": [{
    "changes": [{
      "field": "messages",
      "value": {
        "metadata": { "phone_number_id": "…" },
        "contacts": [{ "wa_id": "923001234567", "profile": { "name": "Ali" } }],
        "messages": [{
          "id": "wamid.HBgM…",
          "from": "923001234567",
          "timestamp": "1785000000",
          "type": "text",
          "text": { "body": "mujhe SEO course ki fees chahiye" }
        }]
      }
    }]
  }]
}
```

Handled message types: `text`, `interactive` (button and list replies),
`button`, `image` / `document` / `video` / `audio` / `sticker` (acknowledged,
caption read), `location`. Anything else returns the menu.

**Always responds `200`** once the signature checks out, including when
processing fails — Meta redelivers on any other status, and a redelivery of an
answered message would message the customer twice. Idempotency comes from the
unique `messages.externalId` column instead: the second delivery of a `wamid`
stops before the assistant is invoked.

### What it produces

| Outcome                   | Record written                                          |
| ------------------------- | ------------------------------------------------------- |
| Any message               | `Conversation` (`channel = WHATSAPP`) + `Message` rows   |
| Completed quote capture   | `MarketingLead`, `source = WHATSAPP`, stage `NEW`        |
| Completed admission capture | `Admission`, `source = WHATSAPP`, stage `INQUIRY`      |
| "Talk to a human"         | `Ticket` (`OPEN`) + conversation marked `handedOff`      |
| Every one of the above    | `Notification` for the owning team + `SystemLog` entry   |

All of them appear in the admin console under CRM ▸ Leads / Admission Inquiries
(filterable by source), Live Conversations, and Messaging ▸ WhatsApp Inbox.

---

## GET `/api/health`

Liveness + dependency probe for Docker/Nginx/monitoring.

```json
{
  "status": "healthy",
  "provider": "claude",
  "model": "claude-opus-4-8",
  "checks": { "app": "ok", "database": "ok", "redis": "ok" },
  "timestamp": "2026-01-01T00:00:00.000Z"
}
```

`200` healthy · `503` degraded (a dependency is down).

---

## Notes

- Auth cookies are `HttpOnly; SameSite=Lax`, and `Secure` in production.
- Submission endpoints are rate limited to 5–6 per 10 minutes per IP; chat to 30
  per minute. Rate limiting fails open when Redis is absent.
- The chat endpoint persists conversations best-effort — it never fails a
  response because persistence failed.
- Provider selection is server-side via `AI_PROVIDER`; clients never send model
  names or keys.
- WhatsApp is rate limited to 20 inbound messages per minute per sender, and
  replies are suppressed entirely when `WHATSAPP_AUTO_REPLY=false` (messages are
  still recorded).
