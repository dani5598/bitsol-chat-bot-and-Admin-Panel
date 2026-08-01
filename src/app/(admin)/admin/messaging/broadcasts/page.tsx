import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { safeQuery, scope } from "@/lib/admin/queries";
import {
  DataTable,
  DbNotice,
  DepartmentTag,
  PageHeader,
  StatCard,
  StatusBadge,
} from "@/components/admin/ui";
import { Megaphone, Send, Users } from "lucide-react";
import { formatDateTime, truncate } from "@/lib/utils";

export const metadata = { title: "Broadcasts" };

export default async function BroadcastsPage() {
  const session = await requireAdmin("/admin/messaging/broadcasts");

  const { data, error } = await safeQuery(
    async () => {
      const [broadcasts, sent, reach] = await Promise.all([
        prisma.broadcast.findMany({
          where: scope(session),
          orderBy: { createdAt: "desc" },
          take: 100,
          include: { template: { select: { name: true } } },
        }),
        prisma.broadcast.count({ where: { ...scope(session), status: "SENT" } }),
        prisma.broadcast.aggregate({
          where: { ...scope(session), status: "SENT" },
          _sum: { delivered: true },
        }),
      ]);
      return { broadcasts, sent, reach: reach._sum.delivered ?? 0 };
    },
    { broadcasts: [], sent: 0, reach: 0 }
  );

  return (
    <>
      <PageHeader
        title="Broadcasts"
        description="Segmented WhatsApp, SMS and email campaigns to leads, customers and students — always to opted-in audiences."
      />

      {error && <DbNotice error={error} />}

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <StatCard label="Campaigns" value={data.broadcasts.length} icon={Megaphone} />
        <StatCard label="Sent" value={data.sent} icon={Send} />
        <StatCard label="Messages delivered" value={data.reach} icon={Users} />
      </div>

      <DataTable
        rows={data.broadcasts}
        rowKey={(row) => row.id}
        empty="No broadcasts yet. Create one from a template and an audience filter."
        columns={[
          {
            header: "Reference",
            cell: (row) => <span className="font-mono text-xs">{row.reference}</span>,
          },
          { header: "Business", cell: (row) => <DepartmentTag department={row.department} /> },
          {
            header: "Campaign",
            cell: (row) => (
              <div className="min-w-0 max-w-sm">
                <p className="text-sm font-medium">{row.title}</p>
                <p className="text-xs text-muted-foreground">{truncate(row.body, 100)}</p>
              </div>
            ),
          },
          {
            header: "Channel",
            cell: (row) => <StatusBadge value={row.channel} />,
          },
          {
            header: "Template",
            cell: (row) => (
              <span className="text-xs text-muted-foreground">
                {row.template?.name ?? "Free text"}
              </span>
            ),
          },
          { header: "Status", cell: (row) => <StatusBadge value={row.status} /> },
          {
            header: "Reach",
            cell: (row) => (
              <span className="text-xs">
                {row.delivered} / {row.recipients}
              </span>
            ),
          },
          {
            header: "Scheduled",
            cell: (row) => (
              <span className="whitespace-nowrap text-xs text-muted-foreground">
                {formatDateTime(row.scheduledAt ?? row.sentAt)}
              </span>
            ),
          },
        ]}
      />
    </>
  );
}
