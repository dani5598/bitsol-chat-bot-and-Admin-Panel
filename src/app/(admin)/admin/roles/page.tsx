import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { safeQuery } from "@/lib/admin/queries";
import {
  DbNotice,
  DepartmentTag,
  EmptyState,
  PageHeader,
  StatusBadge,
} from "@/components/admin/ui";
import { Card } from "@/components/ui/card";

export const metadata = { title: "Roles & Permissions" };

export default async function RolesPage() {
  await requireAdmin("/admin/roles");

  const { data, error } = await safeQuery(
    async () => {
      const [roles, permissions] = await Promise.all([
        prisma.role.findMany({
          orderBy: { name: "asc" },
          include: {
            _count: { select: { users: true } },
            permissions: { include: { permission: true } },
          },
        }),
        prisma.permission.findMany({ orderBy: [{ group: "asc" }, { key: "asc" }] }),
      ]);
      return { roles, permissions };
    },
    { roles: [], permissions: [] }
  );

  const groups = Array.from(new Set(data.permissions.map((p) => p.group)));

  return (
    <>
      <PageHeader
        title="Roles & Permissions"
        description="Which capabilities each role grants, and which business it applies to."
      />

      {error && <DbNotice error={error} />}

      {data.roles.length ? (
        <div className="grid gap-3 lg:grid-cols-2">
          {data.roles.map((role) => {
            const granted = new Set(role.permissions.map((p) => p.permission.key));
            return (
              <Card key={role.id} data-department={role.department ?? undefined} className="p-5">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold">{role.name}</h3>
                    <p className="font-mono text-[11px] text-muted-foreground">{role.key}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    {role.department ? (
                      <DepartmentTag department={role.department} />
                    ) : (
                      <span className="text-[11px] text-muted-foreground">Both businesses</span>
                    )}
                    {role.isSystem && <StatusBadge value="SYSTEM" />}
                  </div>
                </div>

                {role.description && (
                  <p className="text-xs text-muted-foreground">{role.description}</p>
                )}

                <p className="mt-3 text-[11px] text-muted-foreground">
                  {role._count.users} user{role._count.users === 1 ? "" : "s"} ·{" "}
                  {granted.size} of {data.permissions.length} permissions
                </p>

                <div className="mt-3 space-y-2 border-t pt-3">
                  {groups.map((group) => {
                    const groupPermissions = data.permissions.filter((p) => p.group === group);
                    const groupGranted = groupPermissions.filter((p) => granted.has(p.key));
                    if (!groupGranted.length) return null;
                    return (
                      <div key={group}>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                          {group}
                        </p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {groupGranted.map((permission) => (
                            <span
                              key={permission.key}
                              title={permission.description ?? permission.key}
                              className="rounded-full bg-primary/10 px-2 py-0.5 font-mono text-[10px] text-primary"
                            >
                              {permission.key}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState
          message="No roles configured."
          hint="Run `npm run db:seed` to create the standard role matrix (Super Admin, Marketing Admin, Sales Agent, Institute Admin, Admissions Officer, Instructor)."
        />
      )}
    </>
  );
}
