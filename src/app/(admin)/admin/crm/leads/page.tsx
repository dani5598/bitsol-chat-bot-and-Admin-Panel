import Link from "next/link";
import type { LeadStage } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { safeQuery, sessionDepartment } from "@/lib/admin/queries";
import { DataTable, DbNotice, PageHeader, StatusBadge } from "@/components/admin/ui";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { findService } from "@/data/marketing/services";
import { formatDate, humanise, truncate } from "@/lib/utils";
import { notFound } from "next/navigation";

export const metadata = { title: "Marketing Leads" };

const STAGES: LeadStage[] = [
  "NEW", "CONTACTED", "QUALIFIED", "PROPOSAL_SENT", "NEGOTIATION", "WON", "LOST",
];

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ stage?: string }>;
}) {
  const session = await requireAdmin("/admin/crm/leads");
  // Institute-scoped staff have no business in the sales pipeline.
  if (sessionDepartment(session) === "INSTITUTE") notFound();

  const { stage } = await searchParams;
  const active = STAGES.includes(stage as LeadStage) ? (stage as LeadStage) : undefined;

  const { data, error } = await safeQuery(
    async () => {
      const [leads, counts] = await Promise.all([
        prisma.marketingLead.findMany({
          where: active ? { stage: active } : undefined,
          orderBy: { createdAt: "desc" },
          take: 100,
          include: { owner: { select: { name: true } } },
        }),
        prisma.marketingLead.groupBy({ by: ["stage"], _count: { _all: true } }),
      ]);
      return { leads, counts };
    },
    { leads: [], counts: [] as Array<{ stage: LeadStage; _count: { _all: number } }> }
  );

  const countFor = (value: LeadStage) =>
    data.counts.find((c) => c.stage === value)?._count._all ?? 0;
  const total = data.counts.reduce((sum, c) => sum + c._count._all, 0);

  return (
    <>
      <PageHeader
        title="Marketing Leads"
        department="MARKETING"
        description="Every enquiry captured by the assistant, the website and your team — moved through the BITSOL Marketing sales pipeline."
      />

      {error && <DbNotice error={error} />}

      {/* Pipeline filter */}
      <div className="scroll-slim mb-4 flex gap-2 overflow-x-auto pb-1">
        <FilterChip href="/admin/crm/leads" label="All" count={total} active={!active} />
        {STAGES.map((value) => (
          <FilterChip
            key={value}
            href={`/admin/crm/leads?stage=${value}`}
            label={humanise(value)}
            count={countFor(value)}
            active={active === value}
          />
        ))}
      </div>

      <DataTable
        rows={data.leads}
        rowKey={(row) => row.id}
        empty="No leads in this stage yet."
        columns={[
          {
            header: "Reference",
            cell: (row) => (
              <Link
                href={`/admin/crm/leads/${row.id}`}
                className="font-mono text-xs font-medium text-primary hover:underline"
              >
                {row.reference}
              </Link>
            ),
          },
          {
            header: "Contact",
            cell: (row) => (
              <div className="min-w-0">
                <p className="font-medium">{row.name}</p>
                {row.company && (
                  <p className="text-xs text-muted-foreground">{row.company}</p>
                )}
                <p className="text-xs text-muted-foreground">{row.phone}</p>
              </div>
            ),
          },
          {
            header: "Requirement",
            cell: (row) => (
              <div className="min-w-0 max-w-xs">
                <p className="text-xs font-medium">
                  {row.serviceSlug
                    ? findService(row.serviceSlug)?.name ?? humanise(row.serviceSlug)
                    : "Unspecified"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {truncate(row.requirements, 90)}
                </p>
              </div>
            ),
          },
          {
            header: "Budget",
            cell: (row) => (
              <div className="text-xs">
                <p>{row.budget ?? "—"}</p>
                <p className="text-muted-foreground">{row.timeline ?? "—"}</p>
              </div>
            ),
          },
          {
            header: "Stage",
            cell: (row) => (
              <StatusSelect entity="leads" id={row.id} field="stage" value={row.stage} options={STAGES} />
            ),
          },
          {
            header: "Priority",
            cell: (row) => <StatusBadge value={row.priority} />,
          },
          {
            header: "Owner",
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
