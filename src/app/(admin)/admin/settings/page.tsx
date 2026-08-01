import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { safeQuery } from "@/lib/admin/queries";
import {
  Callout,
  DbNotice,
  DepartmentTag,
  EmptyState,
  PageHeader,
} from "@/components/admin/ui";
import { Card } from "@/components/ui/card";
import { BRANDS, DEPARTMENTS } from "@/lib/brands";
import { formatDateTime, humanise } from "@/lib/utils";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  await requireAdmin("/admin/settings");

  const { data, error } = await safeQuery(
    () => prisma.setting.findMany({ orderBy: [{ group: "asc" }, { key: "asc" }] }),
    []
  );

  const groups = Array.from(new Set(data.map((setting) => setting.group)));

  return (
    <>
      <PageHeader
        title="Settings"
        description="Branding, company details and behaviour for both businesses. Secrets live in environment variables, not here."
      />

      {error && <DbNotice error={error} />}

      {/* Brand identity summary — what the assistant currently tells people. */}
      <h2 className="mb-3 text-sm font-semibold">Brand identity</h2>
      <div className="mb-8 grid gap-3 lg:grid-cols-2">
        {DEPARTMENTS.map((department) => {
          const brand = BRANDS[department];
          return (
            <Card key={department} data-department={department} className="p-5">
              <div className="mb-3 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold">
                    {brand.emoji} {brand.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">{brand.tagline}</p>
                </div>
                <DepartmentTag department={department} />
              </div>

              <dl className="space-y-1.5 text-xs">
                <Row label="Reference prefix" value={brand.referencePrefix} />
                <Row label="Phone" value={brand.contact.phone} />
                <Row label="WhatsApp" value={brand.contact.whatsapp} />
                <Row label="Email" value={brand.contact.email} />
                <Row label="Address" value={brand.contact.address} />
                <Row label="Hours" value={brand.contact.hours} />
                <Row label="Website" value={brand.contact.website} />
                <Row label="Accent" value={brand.theme.accentName} />
              </dl>
            </Card>
          );
        })}
      </div>

      <Callout title="Where these values come from">
        Contact details ship as defaults in <code>src/lib/brands.ts</code> and are overridable per
        business through the <code>company.*</code> settings below. The assistant is instructed
        never to give contact information beyond these values.
      </Callout>

      <h2 className="mb-3 mt-8 text-sm font-semibold">Stored settings</h2>
      {data.length ? (
        <div className="space-y-6">
          {groups.map((group) => (
            <section key={group}>
              <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {humanise(group)}
              </h3>
              <div className="grid gap-3 md:grid-cols-2">
                {data
                  .filter((setting) => setting.group === group)
                  .map((setting) => (
                    <Card key={setting.id} className="p-4">
                      <div className="mb-1.5 flex items-start justify-between gap-2">
                        <p className="font-mono text-xs font-medium">{setting.key}</p>
                        {setting.department && (
                          <DepartmentTag department={setting.department} />
                        )}
                      </div>
                      {setting.description && (
                        <p className="mb-2 text-xs text-muted-foreground">
                          {setting.description}
                        </p>
                      )}
                      <pre className="scroll-slim overflow-x-auto rounded-lg bg-secondary/60 p-2.5 text-[11px] leading-relaxed">
                        {setting.isSecret
                          ? "•••••••• (write-only)"
                          : JSON.stringify(setting.value, null, 2)}
                      </pre>
                      <p className="mt-2 text-[10px] text-muted-foreground">
                        Updated {formatDateTime(setting.updatedAt)}
                      </p>
                    </Card>
                  ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <EmptyState
          message="No stored settings."
          hint="Run `npm run db:seed` to create the default branding, company and behaviour settings."
        />
      )}
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="shrink-0 text-muted-foreground">{label}</dt>
      <dd className="break-all text-right font-medium">{value}</dd>
    </div>
  );
}
