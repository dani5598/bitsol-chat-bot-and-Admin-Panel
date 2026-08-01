import crypto from "node:crypto";
import { config } from "@/lib/config";
import type { ListRow, ReplyButton } from "./types";

/**
 * =============================================================================
 *  WhatsApp Cloud API client
 * =============================================================================
 *
 *  Thin wrapper over the Graph API `/messages` endpoint plus the webhook
 *  signature check. Deliberately dependency-free (`fetch` + `node:crypto`) so
 *  the WhatsApp channel adds nothing to the deployment footprint.
 *
 *  Every send is best-effort and returns a result object instead of throwing:
 *  a failed reply must never take down the webhook, because Meta reads a
 *  non-200 as "redeliver this message" and the customer would be answered
 *  twice once the outage clears.
 * =============================================================================
 */

const GRAPH_HOST = "https://graph.facebook.com";

/** WhatsApp hard-caps a text body at 4096 characters. */
const MAX_BODY = 4096;

export interface SendResult {
  ok: boolean;
  /** `wamid.…` of the message Meta accepted. */
  messageId?: string;
  error?: string;
}

function endpoint(path: string): string {
  return `${GRAPH_HOST}/${config.whatsapp.apiVersion}/${config.whatsapp.phoneId}/${path}`;
}

async function post(payload: Record<string, unknown>): Promise<SendResult> {
  if (!config.whatsapp.enabled) {
    return { ok: false, error: "WhatsApp is not configured (WHATSAPP_PHONE_ID / WHATSAPP_TOKEN)." };
  }

  try {
    const response = await fetch(endpoint("messages"), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.whatsapp.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messaging_product: "whatsapp", ...payload }),
      // A hung Graph call must not hold the webhook open past Meta's timeout.
      signal: AbortSignal.timeout(10_000),
    });

    const body = (await response.json().catch(() => null)) as
      | { messages?: Array<{ id?: string }>; error?: { message?: string } }
      | null;

    if (!response.ok) {
      const message = body?.error?.message ?? `HTTP ${response.status}`;
      console.error("[whatsapp] send failed:", message);
      return { ok: false, error: message };
    }

    return { ok: true, messageId: body?.messages?.[0]?.id };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[whatsapp] send error:", message);
    return { ok: false, error: message };
  }
}

/**
 * Split a reply that exceeds WhatsApp's 4096-character limit.
 *
 * Prefers paragraph breaks, then sentence ends, then a hard cut — a chopped
 * word looks broken in a chat thread in a way it never does in a web bubble.
 */
export function splitForWhatsApp(text: string, limit = MAX_BODY): string[] {
  const clean = text.trim();
  if (clean.length <= limit) return clean ? [clean] : [];

  const parts: string[] = [];
  let rest = clean;

  while (rest.length > limit) {
    const window = rest.slice(0, limit);
    const breakAt =
      lastIndexBefore(window, "\n\n") ??
      lastIndexBefore(window, "\n") ??
      lastIndexBefore(window, ". ") ??
      lastIndexBefore(window, " ") ??
      limit;
    parts.push(rest.slice(0, breakAt).trim());
    rest = rest.slice(breakAt).trim();
  }

  if (rest) parts.push(rest);
  return parts;
}

function lastIndexBefore(window: string, needle: string): number | null {
  const index = window.lastIndexOf(needle);
  // Only accept a break in the last third, or long replies fragment into
  // needlessly short bubbles.
  return index > window.length * 0.6 ? index + needle.length : null;
}

/**
 * Convert the assistant's markdown to WhatsApp's formatting.
 *
 * WhatsApp understands `*bold*`, `_italic_` and ```` ```code``` ```` only.
 * Left alone, `**text**` and `### Heading` render as literal asterisks and
 * hashes in the customer's thread.
 */
export function toWhatsAppMarkdown(text: string): string {
  return text
    .replace(/^#{1,6}\s*(.+)$/gm, "*$1*") // headings → bold line
    .replace(/\*\*(.+?)\*\*/gs, "*$1*") // bold
    .replace(/(^|[\s(])__(.+?)__(?=[\s).,!?]|$)/gs, "$1_$2_") // underscore bold
    .replace(/^\s*[-*]\s+/gm, "• ") // bullets
    .replace(/\[(.+?)\]\((https?:\/\/[^\s)]+)\)/g, "$1: $2") // links
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Send a plain text reply, splitting it across bubbles when it is too long. */
export async function sendText(to: string, text: string): Promise<SendResult> {
  const chunks = splitForWhatsApp(toWhatsAppMarkdown(text));
  if (!chunks.length) return { ok: true };

  let last: SendResult = { ok: true };
  for (const chunk of chunks) {
    last = await post({
      to,
      type: "text",
      // Meta renders URLs in the body as previews; we don't want a preview card
      // on top of every answer that happens to mention the website.
      text: { preview_url: false, body: chunk },
    });
    if (!last.ok) break;
  }
  return last;
}

/**
 * Send up to three tappable reply buttons.
 *
 * Buttons are how a WhatsApp thread gets the equivalent of the web widget's
 * department picker and quick replies — typing "1" is error-prone in four
 * languages, tapping is not.
 */
export async function sendButtons(
  to: string,
  body: string,
  buttons: ReplyButton[],
  footer?: string
): Promise<SendResult> {
  const usable = buttons.slice(0, 3);
  if (!usable.length) return sendText(to, body);

  return post({
    to,
    type: "interactive",
    interactive: {
      type: "button",
      body: { text: clamp(toWhatsAppMarkdown(body), 1024) },
      ...(footer ? { footer: { text: clamp(footer, 60) } } : {}),
      action: {
        buttons: usable.map((button) => ({
          type: "reply",
          reply: { id: clamp(button.id, 256), title: clamp(button.title, 20) },
        })),
      },
    },
  });
}

/** Send a tappable list — used where there are more options than three. */
export async function sendList(
  to: string,
  body: string,
  buttonLabel: string,
  rows: ListRow[],
  header?: string
): Promise<SendResult> {
  const usable = rows.slice(0, 10);
  if (!usable.length) return sendText(to, body);

  return post({
    to,
    type: "interactive",
    interactive: {
      type: "list",
      ...(header ? { header: { type: "text", text: clamp(header, 60) } } : {}),
      body: { text: clamp(toWhatsAppMarkdown(body), 1024) },
      action: {
        button: clamp(buttonLabel, 20),
        sections: [
          {
            title: "Options",
            rows: usable.map((row) => ({
              id: clamp(row.id, 200),
              title: clamp(row.title, 24),
              ...(row.description ? { description: clamp(row.description, 72) } : {}),
            })),
          },
        ],
      },
    },
  });
}

/**
 * Send a pre-approved template.
 *
 * Required to open a conversation outside the 24-hour customer service window
 * — the broadcast and follow-up features send through this.
 */
export async function sendTemplate(
  to: string,
  templateName: string,
  languageCode = "en",
  variables: string[] = []
): Promise<SendResult> {
  return post({
    to,
    type: "template",
    template: {
      name: templateName,
      language: { code: languageCode },
      ...(variables.length
        ? {
            components: [
              {
                type: "body",
                parameters: variables.map((text) => ({ type: "text", text })),
              },
            ],
          }
        : {}),
    },
  });
}

/**
 * Mark an inbound message as read (blue ticks).
 *
 * Purely a courtesy signal, but a business number that never shows read
 * receipts reads as unattended.
 */
export async function markAsRead(messageId: string): Promise<void> {
  await post({ status: "read", message_id: messageId });
}

// ------------------------------------------------------------- Signature ----

/**
 * Verify Meta's `X-Hub-Signature-256` header against the raw request body.
 *
 * The webhook URL is public, so without this anyone could POST a fabricated
 * "customer message" and drive the assistant — or fill the CRM with junk leads.
 * The comparison is timing-safe.
 */
export function verifySignature(rawBody: string, header: string | null): boolean {
  const secret = config.whatsapp.appSecret;
  if (!secret) return false;
  if (!header?.startsWith("sha256=")) return false;

  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody, "utf8")
    .digest("hex");
  const received = header.slice("sha256=".length);

  // `timingSafeEqual` throws on a length mismatch, so check that first.
  if (received.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(received, "hex"), Buffer.from(expected, "hex"));
}

// ------------------------------------------------------------------ utils ---

function clamp(text: string, max: number): string {
  const clean = text.trim();
  return clean.length <= max ? clean : `${clean.slice(0, max - 1)}…`;
}

/** `923001234567` → `+923001234567`, the form the CRM stores. */
export function toDisplayPhone(waId: string): string {
  const digits = waId.replace(/\D/g, "");
  return digits ? `+${digits}` : waId;
}
