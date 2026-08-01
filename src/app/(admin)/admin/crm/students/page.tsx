import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { safeQuery, sessionDepartment } from "@/lib/admin/queries";
import { DataTable, DbNotice, PageHeader, StatCard, StatusBadge } from "@/components/admin/ui";
import { Award, GraduationCap, UsersRound } from "lucide-react";
import { formatDate, formatPkr } from "@/lib/utils";

export const metadata = { title: "Students" };

export default async function StudentsPage() {
  const session = await requireAdmin("/admin/crm/students");
  if (sessionDepartment(session) === "MARKETING") notFound();

  const { data, error } = await safeQuery(
    async () => {
      const [students, total, active, certificates] = await Promise.all([
        prisma.student.findMany({
          orderBy: { createdAt: "desc" },
          take: 100,
          include: {
            enrollments: {
              orderBy: { enrolledAt: "desc" },
              take: 1,
              include: { batch: { include: { course: { select: { name: true } } } } },
            },
            _count: { select: { certificates: true, attendance: true } },
          },
        }),
        prisma.student.count(),
        prisma.enrollment.count({ where: { status: "ACTIVE" } }),
        prisma.certificate.count(),
      ]);
      return { students, total, active, certificates };
    },
    { students: [], total: 0, active: 0, certificates: 0 }
  );

  return (
    <>
      <PageHeader
        title="Students"
        department="INSTITUTE"
        description="Enrolled students, their current batch, fee status and certificates."
      />

      {error && <DbNotice error={error} />}

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <StatCard label="Students" value={data.total} icon={UsersRound} department="INSTITUTE" />
        <StatCard
          label="Active enrollments"
          value={data.active}
          icon={GraduationCap}
          department="INSTITUTE"
        />
        <StatCard
          label="Certificates issued"
          value={data.certificates}
          icon={Award}
          department="INSTITUTE"
        />
      </div>

      <DataTable
        rows={data.students}
        rowKey={(row) => row.id}
        empty="No students enrolled yet."
        columns={[
          {
            header: "Roll number",
            cell: (row) => <span className="font-mono text-xs">{row.rollNumber}</span>,
          },
          {
            header: "Student",
            cell: (row) => (
              <div className="min-w-0">
                <p className="font-medium">{row.name}</p>
                {row.fatherName && (
                  <p className="text-xs text-muted-foreground">s/o {row.fatherName}</p>
                )}
              </div>
            ),
          },
          {
            header: "Contact",
            cell: (row) => (
              <div className="text-xs text-muted-foreground">
                <p>{row.phone}</p>
                <p className="break-all">{row.email ?? "—"}</p>
              </div>
            ),
          },
          {
            header: "Current batch",
            cell: (row) => {
              const enrollment = row.enrollments[0];
              return enrollment ? (
                <div className="text-xs">
                  <p className="font-medium">{enrollment.batch.course.name}</p>
                  <p className="text-muted-foreground">{enrollment.batch.code}</p>
                </div>
              ) : (
                <span className="text-xs text-muted-foreground">Not enrolled</span>
              );
            },
          },
          {
            header: "Fee status",
            cell: (row) => {
              const enrollment = row.enrollments[0];
              if (!enrollment) return <span className="text-xs text-muted-foreground">—</span>;
              return (
                <div className="space-y-1">
                  <StatusBadge value={enrollment.feeStatus} />
                  <p className="text-[11px] text-muted-foreground">
                    {formatPkr(Number(enrollment.feePaid))} of{" "}
                    {formatPkr(Number(enrollment.feeTotal ?? 0))}
                  </p>
                </div>
              );
            },
          },
          {
            header: "Records",
            cell: (row) => (
              <div className="text-xs text-muted-foreground">
                <p>{row._count.attendance} attendance marks</p>
                <p>{row._count.certificates} certificates</p>
              </div>
            ),
          },
          {
            header: "Joined",
            cell: (row) => (
              <span className="whitespace-nowrap text-xs text-muted-foreground">
                {formatDate(row.createdAt)}
              </span>
            ),
          },
        ]}
      />
    </>
  );
}
