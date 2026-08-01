import { requireAdmin } from "@/lib/session";
import { Callout, PageHeader } from "@/components/admin/ui";
import { Card } from "@/components/ui/card";
import { config } from "@/lib/config";
import {
  Bot,
  Database,
  Mail,
  MapPin,
  MessageSquare,
  Server,
  Smartphone,
} from "lucide-react";

export const metadata = { title: "Integrations" };

/**
 * Integration status board.
 *
 * Read-only by design: every credential is supplied through environment
 * variables, so nothing here can leak a secret to the browser — the page
 * reports only whether each integration is configured, never its value.
 */
export default async function IntegrationsPage() {
  await requireAdmin("/admin/integrations");

  const integrations = [
    {
      icon: Bot,
      name: "AI provider",
      configured: Boolean(
        config.ai.anthropicApiKey || config.ai.openaiApiKey || config.ai.geminiApiKey
      ),
      detail: `${config.ai.provider} · ${config.ai.model} · max ${config.ai.maxTokens} tokens`,
      env: "AI_PROVIDER, AI_MODEL, ANTHROPIC_API_KEY / OPENAI_API_KEY / GEMINI_API_KEY",
    },
    {
      icon: Database,
      name: "PostgreSQL",
      configured: Boolean(config.databaseUrl),
      detail: config.databaseUrl ? "Connection string set" : "Not configured",
      env: "DATABASE_URL",
    },
    {
      icon: Server,
      name: "Redis",
      configured: Boolean(config.redisUrl),
      detail: config.redisUrl
        ? "Rate limiting active"
        : "Not configured — rate limiting fails open",
      env: "REDIS_URL",
    },
    {
      icon: MessageSquare,
      name: "WhatsApp Business API",
      configured: config.whatsapp.enabled,
      detail: config.whatsapp.enabled
        ? "Phone ID and token set"
        : "Templates can be drafted; sending is disabled",
      env: "WHATSAPP_PHONE_ID, WHATSAPP_TOKEN",
    },
    {
      icon: Mail,
      name: "Email (SMTP)",
      configured: config.mail.enabled,
      detail: config.mail.enabled
        ? `Sending as ${config.mail.from}`
        : "Notifications queue but are not delivered",
      env: "SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM",
    },
    {
      icon: Smartphone,
      name: "SMS gateway",
      configured: config.sms.enabled,
      detail: config.sms.enabled ? `Sender ID ${config.sms.senderId}` : "Not configured",
      env: "SMS_API_KEY, SMS_SENDER_ID",
    },
    {
      icon: MapPin,
      name: "Google Maps",
      configured: Boolean(config.maps.apiKey),
      detail: config.maps.apiKey ? "Key set" : "Office location maps disabled",
      env: "GOOGLE_MAPS_API_KEY",
    },
  ];

  return (
    <>
      <PageHeader
        title="Integrations"
        description="What's wired up and what still needs credentials."
      />

      <Callout title="Credentials live in environment variables">
        Nothing on this page can reveal a secret — it reports configured or not, and names the
        variable to set. Update your <code>.env</code> (or your host's secret manager) and restart
        the app to change any of these.
      </Callout>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {integrations.map((integration) => (
          <Card key={integration.name} className="flex items-start gap-3 p-4">
            <span
              className={`grid size-10 shrink-0 place-items-center rounded-xl ${
                integration.configured
                  ? "bg-emerald-500/12 text-emerald-600 dark:text-emerald-400"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              <integration.icon className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold">{integration.name}</h3>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    integration.configured
                      ? "bg-emerald-500/12 text-emerald-700 dark:text-emerald-400"
                      : "bg-amber-500/14 text-amber-700 dark:text-amber-400"
                  }`}
                >
                  {integration.configured ? "Configured" : "Not configured"}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">{integration.detail}</p>
              <p className="mt-2 break-all font-mono text-[10px] text-muted-foreground">
                {integration.env}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
