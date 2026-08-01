import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { safeQuery, sessionDepartment } from "@/lib/admin/queries";
import { DataTable, DbNotice, PageHeader, StatCard, StatusBadge } from "@/components/admin/ui";
import { CalendarDays, Users, UserCheck } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Batches" };

export default async function BatchesPage() {
  const session = await requireAdmin("/admin/catalogue/batches");
  if (sessionDepartment(session) === "MARKETING") notFound();

  const now = new Date();

  const { data, error } = await safeQuery(
    async () => {
      const [batches, upcoming, running, seatsTaken] = await Promise.all([
        prisma.batch.findMany({
          orderBy: { startDate: "asc" },
          take: 100,
          include: {
            course: { select: { name: true } },
            faculty: { select: { name: true } },
            _count: { select: { enrollments: true } },
          },
        }),
        prisma.batch.count({
          where: { startDate: { gte: now }, status: { in: ["PLANNED", "ENROLLING"] } },
        }),
        prisma.batch.count({ where: { status: "RUNNING" } }),
        prisma.enrollment.count({ where: { status: "ACTIVE" } }),
      ]);
      return { batches, upcoming, running, seatsTaken };
    },
    { batches: [], upcoming: 0, running: 0, seatsTaken: 0 }
  );

  return (
    <>
      <PageHeader
        title="Batches"
        department="INSTITUTE"
        description="Scheduled and running batches — the timetable the assistant quotes to prospective students."
      />

      {error && <DbNotice error={error} />}

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <StatCard
          label="Upcoming batches"
          value={data.upcoming}
          icon={CalendarDays}
          department="INSTITUTE"
        />
        <StatCard label="Currently running" value={data.running} icon={UserCheck} department="INSTITUTE" />
        <StatCard label="Active enrollments" value={data.seatsTaken} icon={Users} department="INSTITUTE" />
      </div>

      <DataTable
        rows={data.batches}
        rowKey={(row) => row.id}
        empty="No batches scheduled yet."
        columns={[
          { header: "Code", cell: (row) => <span className="font-mono text-xs">{row.code}</span> },
          {
            header: "Course",
            cell: (row) => <span className="text-sm font-medium">{row.course.name}</span>,
          },
          {
            header: "Schedule",
            cell: (row) => (
              <div className="text-xs">
                <p>{row.schedule}</p>
                <p className="text-muted-foreground">{row.mode}</p>
              </div>
            ),
          },
          {
            header: "Starts",
            cell: (row) => (
              <span className="whitespace-nowrap text-xs">{formatDate(row.startDate)}</span>
            ),
          },
          {
            header: "Seats",
            cell: (row) => {
              const taken = Math.max(row.seatsTaken, row._count.enrollments);
              const pct = row.seats ? Math.round((taken / row.seats) * 100) : 0;
              return (
                <div className="w-28">
                  <p className="mb-1 text-[11px]">
                    {taken} / {row.seats}
                  </p>
                  <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>
                </div>
              );
            },
          },
          {
            header: "Trainer",
            cell: (row) => (
              <span className="text-xs text-muted-foreground">
                {row.faculty?.name ?? "Unassigned"}
              </span>
            ),
          },
          { header: "Status", cell: (row) => <StatusBadge value={row.status} /> },
        ]}
      />
    </>
  );
}
