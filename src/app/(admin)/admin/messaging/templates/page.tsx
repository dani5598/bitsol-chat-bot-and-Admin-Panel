import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { safeQuery, scope } from "@/lib/admin/queries";
import {
  Callout,
  DbNotice,
  DepartmentTag,
  EmptyState,
  PageHeader,
  StatusBadge,
} from "@/components/admin/ui";
import { Card } from "@/components/ui/card";
import { config } from "@/lib/config";

export const metadata = { title: "WhatsApp Templates" };

export default async function TemplatesPage() {
  const session = await requireAdmin("/admin/messaging/templates");

  const { data, error } = await safeQuery(
    () =>
      prisma.whatsappTemplate.findMany({
        where: scope(session),
        orderBy: [{ department: "asc" }, { name: "asc" }],
      }),
    []
  );

  return (
    <>
      <PageHeader
        title="WhatsApp Templates"
        description="Pre-approved message templates used for acknowledgements, reminders and broadcasts."
      />

      {error && <DbNotice error={error} />}

      {!config.whatsapp.enabled && (
        <Callout title="WhatsApp Business API not configured">
          Set <code>WHATSAPP_PHONE_ID</code> and <code>WHATSAPP_TOKEN</code> to send messages.
          Templates can still be drafted here and submitted for Meta approval later.
        </Callout>
      )}

      <div className="mt-6">
        {data.length ? (
          <div className="grid gap-3 md:grid-cols-2">
            {data.map((template) => (
              <Card key={template.id} data-department={template.department} className="p-4">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold">{template.name}</h3>
                    <p className="font-mono text-[11px] text-muted-foreground">{template.key}</p>
                  </div>
                  <StatusBadge value={template.isApproved ? "PUBLISHED" : "PENDING"} />
                </div>

                <p className="rounded-xl bg-secondary/60 p-3 text-xs leading-relaxed">
                  {template.body}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t pt-2">
                  <DepartmentTag department={template.department} />
                  <span className="rounded-full border px-2 py-0.5 text-[11px] text-muted-foreground">
                    {template.language}
                  </span>
                  {template.variables.map((variable, index) => (
                    <span
                      key={variable}
                      className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] text-primary"
                    >
                      {`{{${index + 1}}}`} {variable}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            message="No templates yet."
            hint="Run `npm run db:seed` to load the starting set of acknowledgement and reminder templates."
          />
        )}
      </div>
    </>
  );
}
