import Link from "next/link";
import type { LogLevel } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { safeQuery, scope } from "@/lib/admin/queries";
import {
  DataTable,
  DbNotice,
  DepartmentTag,
  PageHeader,
  StatusBadge,
} from "@/components/admin/ui";
import { formatDateTime, humanise, truncate } from "@/lib/utils";

export const metadata = { title: "System Logs" };

const LEVELS: LogLevel[] = ["DEBUG", "INFO", "WARN", "ERROR"];

export default async function LogsPage({
  searchParams,
}: {
  searchParams: Promise<{ level?: string }>;
}) {
  const session = await requireAdmin("/admin/logs");
  const { level } = await searchParams;
  const active = LEVELS.includes(level as LogLevel) ? (level as LogLevel) : undefined;

  const { data, error } = await safeQuery(
    async () => {
      const where = { ...scope(session), ...(active ? { level: active } : {}) };
      const [logs, counts] = await Promise.all([
        prisma.systemLog.findMany({
          where,
          orderBy: { createdAt: "desc" },
          take: 150,
          include: { user: { select: { name: true } } },
        }),
        prisma.systemLog.groupBy({
          by: ["level"],
          _count: { _all: true },
          where: scope(session),
        }),
      ]);
      return { logs, counts };
    },
    { logs: [], counts: [] as Array<{ level: LogLevel; _count: { _all: number } }> }
  );

  const countFor = (value: LogLevel) =>
    data.counts.find((c) => c.level === value)?._count._all ?? 0;
  const total = data.counts.reduce((sum, c) => sum + c._count._all, 0);

  return (
    <>
      <PageHeader
        title="System Logs"
        description="Audit trail of every lead, admission, ticket, meeting and record change — who did what, when, and from where."
      />

      {error && <DbNotice error={error} />}

      <div className="mb-4 flex gap-2">
        <FilterChip href="/admin/logs" label="All" count={total} active={!active} />
        {LEVELS.map((value) => (
          <FilterChip
            key={value}
            href={`/admin/logs?level=${value}`}
            label={humanise(value)}
            count={countFor(value)}
            active={active === value}
          />
        ))}
      </div>

      <DataTable
        rows={data.logs}
        rowKey={(row) => row.id}
        empty="No log entries yet."
        columns={[
          {
            header: "When",
            cell: (row) => (
              <span className="whitespace-nowrap text-xs text-muted-foreground">
                {formatDateTime(row.createdAt)}
              </span>
            ),
          },
          { header: "Level", cell: (row) => <StatusBadge value={row.level} /> },
          {
            header: "Action",
            cell: (row) => <span className="font-mono text-xs">{row.action}</span>,
          },
          {
            header: "Business",
            cell: (row) =>
              row.department ? (
                <DepartmentTag department={row.department} />
              ) : (
                <span className="text-xs text-muted-foreground">System</span>
              ),
          },
          {
            header: "Detail",
            cell: (row) => (
              <div className="min-w-0 max-w-md">
                <p className="text-xs">{row.message ?? "—"}</p>
                {row.entity && (
                  <p className="font-mono text-[10px] text-muted-foreground">
                    {row.entity}
                    {row.entityId ? ` · ${truncate(row.entityId, 24)}` : ""}
                  </p>
                )}
              </div>
            ),
          },
          {
            header: "Actor",
            cell: (row) => (
              <div className="text-xs text-muted-foreground">
                <p>{row.user?.name ?? "System"}</p>
                <p className="font-mono text-[10px]">{row.ipAddress ?? ""}</p>
              </div>
            ),
          },
        ]}
      />
    </>
  );
}

function FilterChip({
  href,
  label,
  count,
  active,
}: {
  href: string;
  label: string;
  count: number;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "bg-card hover:bg-secondary"
      }`}
    >
      {label}
      <span className={active ? "ml-1.5 opacity-80" : "ml-1.5 text-muted-foreground"}>
        {count}
      </span>
    </Link>
  );
}
