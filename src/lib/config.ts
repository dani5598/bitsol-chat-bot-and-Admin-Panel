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

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
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

  WHATSAPP_PHONE_ID: optional,
  WHATSAPP_TOKEN: optional,

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
    enabled: Boolean(env.WHATSAPP_PHONE_ID && env.WHATSAPP_TOKEN),
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
