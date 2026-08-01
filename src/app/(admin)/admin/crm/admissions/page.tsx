import Link from "next/link";
import { notFound } from "next/navigation";
import type { AdmissionStage } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { safeQuery, sessionDepartment } from "@/lib/admin/queries";
import { DataTable, DbNotice, PageHeader, StatusBadge } from "@/components/admin/ui";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { formatDate, humanise } from "@/lib/utils";

export const metadata = { title: "Admission Inquiries" };

const STAGES: AdmissionStage[] = [
  "INQUIRY", "CONTACTED", "COUNSELLED", "APPLIED",
  "FEE_PENDING", "ENROLLED", "DROPPED", "LOST",
];

export default async function AdmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ stage?: string }>;
}) {
  const session = await requireAdmin("/admin/crm/admissions");
  // Marketing-scoped staff have no business in the admissions pipeline.
  if (sessionDepartment(session) === "MARKETING") notFound();

  const { stage } = await searchParams;
  const active = STAGES.includes(stage as AdmissionStage)
    ? (stage as AdmissionStage)
    : undefined;

  const { data, error } = await safeQuery(
    async () => {
      const [admissions, counts] = await Promise.all([
        prisma.admission.findMany({
          where: active ? { stage: active } : undefined,
          orderBy: { createdAt: "desc" },
          take: 100,
          include: {
            owner: { select: { name: true } },
            course: { select: { name: true } },
          },
        }),
        prisma.admission.groupBy({ by: ["stage"], _count: { _all: true } }),
      ]);
      return { admissions, counts };
    },
    {
      admissions: [],
      counts: [] as Array<{ stage: AdmissionStage; _count: { _all: number } }>,
    }
  );

  const countFor = (value: AdmissionStage) =>
    data.counts.find((c) => c.stage === value)?._count._all ?? 0;
  const total = data.counts.reduce((sum, c) => sum + c._count._all, 0);

  return (
    <>
      <PageHeader
        title="Admission Inquiries"
        department="INSTITUTE"
        description="Every prospective student captured by the assistant, walk-ins and referrals — moved through the BITSOL Institute admissions pipeline."
      />

      {error && <DbNotice error={error} />}

      <div className="scroll-slim mb-4 flex gap-2 overflow-x-auto pb-1">
        <FilterChip href="/admin/crm/admissions" label="All" count={total} active={!active} />
        {STAGES.map((value) => (
          <FilterChip
            key={value}
            href={`/admin/crm/admissions?stage=${value}`}
            label={humanise(value)}
            count={countFor(value)}
            active={active === value}
          />
        ))}
      </div>

      <DataTable
        rows={data.admissions}
        rowKey={(row) => row.id}
        empty="No admission inquiries in this stage yet."
        columns={[
          {
            header: "Reference",
            cell: (row) => (
              <Link
                href={`/admin/crm/admissions/${row.id}`}
                className="font-mono text-xs font-medium text-primary hover:underline"
              >
                {row.reference}
              </Link>
            ),
          },
          {
            header: "Student",
            cell: (row) => (
              <div className="min-w-0">
                <p className="font-medium">{row.studentName}</p>
                {row.fatherName && (
                  <p className="text-xs text-muted-foreground">s/o {row.fatherName}</p>
                )}
                <p className="text-xs text-muted-foreground">{row.phone}</p>
              </div>
            ),
          },
          {
            header: "Course",
            cell: (row) => (
              <div className="min-w-0 text-xs">
                <p className="font-medium">{row.course?.name ?? row.courseName ?? "—"}</p>
                <p className="text-muted-foreground">{row.preferredBatch ?? "No batch preference"}</p>
              </div>
            ),
          },
          {
            header: "Background",
            cell: (row) => (
              <div className="text-xs text-muted-foreground">
                <p>{row.qualification ?? "—"}</p>
                <p>{row.city ?? "—"}</p>
              </div>
            ),
          },
          {
            header: "Stage",
            cell: (row) => (
              <StatusSelect
                entity="admissions"
                id={row.id}
                field="stage"
                value={row.stage}
                options={STAGES}
              />
            ),
          },
          { header: "Priority", cell: (row) => <StatusBadge value={row.priority} /> },
          {
            header: "Officer",
            cell: (row) => (
              <span className="text-xs text-muted-foreground">
                {row.owner?.name ?? "Unassigned"}
              </span>
            ),
          },
          {
            header: "Created",
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
      className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
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
