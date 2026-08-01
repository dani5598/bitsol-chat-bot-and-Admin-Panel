/**
 * Server-side runtime configuration. Reads and validates environment variables
 * once, and exposes a typed `config` object to the rest of the app.
 *
 * Import this only from server code (route handlers, server components, lib).
 * Anything the browser needs must go through `NEXT_PUBLIC_*` or a prop.
 */
import { z } from "zod";

const bool = (def: boolean) =>
  z
    .string()
    .optional()
    .transform((v) => (v == null ? def : /^(1|true|yes|on)$/i.test(v)));

const optional = z.string().optional();

/**
 * Normalise NODE_ENV instead of rejecting it.
 *
 * Managed hosts do not always set a value Next.js considers standard — some
 * shared platforms use "prod", "staging" or leave it blank. Throwing on those
 * takes the whole site down for a label mismatch, so anything unrecognised is
 * treated as production: the safe assumption for a deployed app, since it is
 * the stricter of the two modes (secure cookies, no dev affordances).
 */
const nodeEnv = z.preprocess((value) => {
  const raw = String(value ?? "").trim().toLowerCase();
  if (!raw) return "development";
  if (raw === "development" || raw === "dev") return "development";
  if (raw === "test") return "test";
  return "production";
}, z.enum(["development", "test", "production"]));

const schema = z.object({
  NODE_ENV: nodeEnv.default("development"),
  APP_NAME: z.string().default("BITSOL AI Assistant"),
  APP_URL: z.string().default("http://localhost:3000"),

  DATABASE_URL: optional,
  REDIS_URL: optional,

  JWT_SECRET: z.string().default("dev-insecure-secret-change-me"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  BCRYPT_ROUNDS: z.coerce.number().int().min(8).max(15).default(12),

  AI_PROVIDER: z.enum(["claude", "openai", "ollama", "gemini"]).default("claude"),
  AI_MODEL: z.string().default("claude-opus-4-8"),
  AI_MAX_TOKENS: z.coerce.number().int().positive().default(1400),
  AI_THINKING: bool(false),

  ANTHROPIC_API_KEY: optional,
  OPENAI_API_KEY: optional,
  OPENAI_BASE_URL: z.string().default("https://api.openai.com/v1"),
  GEMINI_API_KEY: optional,

  // --- Notification & integration channels ---------------------------------
  SMTP_HOST: optional,
  SMTP_PORT: z.coerce.number().int().positive().default(587),
  SMTP_USER: optional,
  SMTP_PASSWORD: optional,
  SMTP_FROM: z.string().default("BITSOL <no-reply@bitsolmarketing.com>"),

  SMS_API_KEY: optional,
  SMS_SENDER_ID: z.string().default("BITSOL"),

  // --- WhatsApp Business Cloud API (Meta) ----------------------------------
  /** Phone number ID of the business number (Meta → WhatsApp → API Setup). */
  WHATSAPP_PHONE_ID: optional,
  /** Permanent system-user access token with `whatsapp_business_messaging`. */
  WHATSAPP_TOKEN: optional,
  /** Shared secret typed into Meta's webhook form; echoed back on GET verify. */
  WHATSAPP_VERIFY_TOKEN: optional,
  /** Meta app secret, used to verify the `X-Hub-Signature-256` on every POST. */
  WHATSAPP_APP_SECRET: optional,
  WHATSAPP_API_VERSION: z.string().default("v21.0"),
  /** Set false to keep the number connected but stop the bot from replying. */
  WHATSAPP_AUTO_REPLY: bool(true),

  GOOGLE_MAPS_API_KEY: optional,

  // --- Team routing --------------------------------------------------------
  /** Inbox that receives new BITSOL Marketing leads, quotes and meetings. */
  SALES_NOTIFY_EMAIL: optional,
  /** Inbox that receives new BITSOL Institute admission inquiries. */
  ADMISSIONS_NOTIFY_EMAIL: optional,
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  // Surface a clear message rather than a cryptic runtime failure later.
  console.error(
    "Invalid environment configuration:",
    parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`)
  );
  throw new Error("Invalid environment configuration. See logs above.");
}

const env = parsed.data;

export const config = {
  env: env.NODE_ENV,
  isProd: env.NODE_ENV === "production",
  appName: env.APP_NAME,
  appUrl: env.APP_URL,

  databaseUrl: env.DATABASE_URL,
  redisUrl: env.REDIS_URL,

  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRES_IN,
  },
  bcryptRounds: env.BCRYPT_ROUNDS,

  ai: {
    provider: env.AI_PROVIDER,
    model: env.AI_MODEL,
    maxTokens: env.AI_MAX_TOKENS,
    thinking: env.AI_THINKING,
    anthropicApiKey: env.ANTHROPIC_API_KEY,
    openaiApiKey: env.OPENAI_API_KEY,
    openaiBaseUrl: env.OPENAI_BASE_URL,
    geminiApiKey: env.GEMINI_API_KEY,
  },

  mail: {
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    user: env.SMTP_USER,
    password: env.SMTP_PASSWORD,
    from: env.SMTP_FROM,
    enabled: Boolean(env.SMTP_HOST && env.SMTP_USER),
  },

  sms: {
    apiKey: env.SMS_API_KEY,
    senderId: env.SMS_SENDER_ID,
    enabled: Boolean(env.SMS_API_KEY),
  },

  whatsapp: {
    phoneId: env.WHATSAPP_PHONE_ID,
    token: env.WHATSAPP_TOKEN,
    verifyToken: env.WHATSAPP_VERIFY_TOKEN,
    appSecret: env.WHATSAPP_APP_SECRET,
    apiVersion: env.WHATSAPP_API_VERSION,
    autoReply: env.WHATSAPP_AUTO_REPLY,
    /** Outbound sending is possible (templates, broadcasts, bot replies). */
    enabled: Boolean(env.WHATSAPP_PHONE_ID && env.WHATSAPP_TOKEN),
    /** Meta can reach the webhook: verification and signature checks are set. */
    webhookReady: Boolean(env.WHATSAPP_VERIFY_TOKEN && env.WHATSAPP_APP_SECRET),
    /**
     * The callback URL registered with Meta. `/webhook` is rewritten to
     * `/api/whatsapp/webhook` in next.config.mjs — this is the short public
     * form, and the single value the admin console tells you to paste.
     */
    webhookUrl: `${env.APP_URL.replace(/\/$/, "")}/webhook`,
  },

  maps: {
    apiKey: env.GOOGLE_MAPS_API_KEY,
  },

  routing: {
    salesEmail: env.SALES_NOTIFY_EMAIL,
    admissionsEmail: env.ADMISSIONS_NOTIFY_EMAIL,
  },
} as const;

export type AppConfig = typeof config;
