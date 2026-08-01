import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { safeQuery, scope } from "@/lib/admin/queries";
import {
  DataTable,
  DbNotice,
  DepartmentTag,
  PageHeader,
  StatCard,
} from "@/components/admin/ui";
import { MessagesSquare, PhoneForwarded, Star } from "lucide-react";
import { formatDateTime, truncate } from "@/lib/utils";

export const metadata = { title: "Live Conversations" };

export default async function ConversationsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const session = await requireAdmin("/admin/conversations");
  const { filter } = await searchParams;
  const where = { ...scope(session), ...(filter === "handoff" ? { handedOff: true } : {}) };

  const { data, error } = await safeQuery(
    async () => {
      const [conversations, total, handoffs, rated] = await Promise.all([
        prisma.conversation.findMany({
          where,
          orderBy: { updatedAt: "desc" },
          take: 60,
          include: {
            _count: { select: { messages: true } },
            messages: {
              orderBy: { createdAt: "desc" },
              take: 1,
              select: { content: true, role: true },
            },
          },
        }),
        prisma.conversation.count({ where: scope(session) }),
        prisma.conversation.count({ where: { ...scope(session), handedOff: true } }),
        prisma.conversation.aggregate({
          where: { ...scope(session), rating: { not: null } },
          _avg: { rating: true },
        }),
      ]);
      return { conversations, total, handoffs, rating: rated._avg.rating ?? 0 };
    },
    { conversations: [], total: 0, handoffs: 0, rating: 0 }
  );

  return (
    <>
      <PageHeader
        title="Live Conversations"
        description="Every conversation the assistant has handled, newest first. Handed-off chats are the ones waiting on a human."
      />

      {error && <DbNotice error={error} />}

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <StatCard label="Conversations" value={data.total} icon={MessagesSquare} />
        <StatCard
          label="Handed off"
          value={data.handoffs}
          hint="Escalated to a human"
          icon={PhoneForwarded}
          href="/admin/conversations?filter=handoff"
        />
        <StatCard
          label="Average rating"
          value={data.rating ? `${Number(data.rating).toFixed(1)} / 5` : "—"}
          icon={Star}
        />
      </div>

      <div className="mb-4 flex gap-2">
        <Link
          href="/admin/conversations"
          className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
            filter !== "handoff" ? "border-primary bg-primary text-primary-foreground" : "bg-card"
          }`}
        >
          All
        </Link>
        <Link
          href="/admin/conversations?filter=handoff"
          className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
            filter === "handoff" ? "border-primary bg-primary text-primary-foreground" : "bg-card"
          }`}
        >
          Needs a human
        </Link>
      </div>

      <DataTable
        rows={data.conversations}
        rowKey={(row) => row.id}
        empty="No conversations yet."
        columns={[
          {
            header: "Reference",
            cell: (row) => (
              <Link
                href={`/admin/conversations/${row.id}`}
                className="font-mono text-xs font-medium text-primary hover:underline"
              >
                {row.reference}
              </Link>
            ),
          },
          {
            header: "Business",
            cell: (row) =>
              row.department ? (
                <DepartmentTag department={row.department} />
              ) : (
                <span className="text-xs text-muted-foreground">Not routed</span>
              ),
          },
          {
            header: "Last message",
            cell: (row) => (
              <div className="max-w-md">
                <p className="text-xs text-muted-foreground">
                  {row.messages[0]
                    ? `${row.messages[0].role === "USER" ? "Visitor" : "Assistant"}: ${truncate(
                        row.messages[0].content,
                        110
                      )}`
                    : "—"}
                </p>
              </div>
            ),
          },
          {
            header: "Messages",
            cell: (row) => <span className="text-xs">{row._count.messages}</span>,
          },
          {
            header: "Status",
            cell: (row) =>
              row.handedOff ? (
                <span className="rounded-full bg-amber-500/14 px-2 py-0.5 text-[11px] font-medium text-amber-700 dark:text-amber-400">
                  Handed off
                </span>
              ) : (
                <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px]">
                  Assistant
                </span>
              ),
          },
          {
            header: "Updated",
            cell: (row) => (
              <span className="whitespace-nowrap text-xs text-muted-foreground">
                {formatDateTime(row.updatedAt)}
              </span>
            ),
          },
        ]}
      />
    </>
  );
}
