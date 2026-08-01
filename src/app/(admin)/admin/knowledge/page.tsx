import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { safeQuery, sessionDepartment } from "@/lib/admin/queries";
import {
  DataTable,
  DbNotice,
  DepartmentTag,
  PageHeader,
  StatCard,
} from "@/components/admin/ui";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { BookOpen, FileQuestion, Layers } from "lucide-react";
import { asDepartment, BRANDS, type Department } from "@/lib/brands";
import { formatDate, truncate } from "@/lib/utils";

export const metadata = { title: "Knowledge Base" };

const STATES = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;

/** Shape shared by both knowledge tables, so the page renders one way. */
interface KnowledgeRow {
  id: string;
  question: string;
  answer: string;
  category: string;
  kind: string;
  keywords: string[];
  state: string;
  version: number;
  indexedAt: Date | null;
}

interface KnowledgeView {
  entries: KnowledgeRow[];
  counts: Array<{ state: string; count: number }>;
  categories: Array<{ category: string; count: number }>;
}

async function loadMarketing(category?: string): Promise<KnowledgeView> {
  const [entries, counts, categories] = await Promise.all([
    prisma.marketingKnowledge.findMany({
      where: category ? { category } : undefined,
      orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
      take: 200,
    }),
    prisma.marketingKnowledge.groupBy({ by: ["state"], _count: { _all: true } }),
    prisma.marketingKnowledge.groupBy({ by: ["category"], _count: { _all: true } }),
  ]);
  return {
    entries,
    counts: counts.map((c) => ({ state: c.state, count: c._count._all })),
    categories: categories.map((c) => ({ category: c.category, count: c._count._all })),
  };
}

async function loadInstitute(category?: string): Promise<KnowledgeView> {
  const [entries, counts, categories] = await Promise.all([
    prisma.instituteKnowledge.findMany({
      where: category ? { category } : undefined,
      orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
      take: 200,
    }),
    prisma.instituteKnowledge.groupBy({ by: ["state"], _count: { _all: true } }),
    prisma.instituteKnowledge.groupBy({ by: ["category"], _count: { _all: true } }),
  ]);
  return {
    entries,
    counts: counts.map((c) => ({ state: c.state, count: c._count._all })),
    categories: categories.map((c) => ({ category: c.category, count: c._count._all })),
  };
}

/**
 * Knowledge Base CMS.
 *
 * The two bases live in separate tables (`knowledge_base_marketing` and
 * `knowledge_base_institute`), so this page picks a delegate rather than
 * filtering one shared table — the same separation the assistant relies on.
 */
export default async function KnowledgePage({
  searchParams,
}: {
  searchParams: Promise<{ department?: string; category?: string }>;
}) {
  const session = await requireAdmin("/admin/knowledge");
  const scoped = sessionDepartment(session) as Department | null;

  const params = await searchParams;
  const requested = asDepartment(params.department);
  // Scoped staff are locked to their own base; unrestricted staff can switch.
  const department: Department = scoped ?? requested ?? "MARKETING";
  const category = params.category;

  const { data, error } = await safeQuery<KnowledgeView>(
    // The two bases are separate Prisma models, so this branches rather than
    // picking a delegate — a union of two model delegates isn't callable.
    () => (department === "MARKETING" ? loadMarketing(category) : loadInstitute(category)),
    { entries: [], counts: [], categories: [] }
  );

  const total = data.counts.reduce((sum, c) => sum + c.count, 0);
  const published = data.counts.find((c) => c.state === "PUBLISHED")?.count ?? 0;

  return (
    <>
      <PageHeader
        title="Knowledge Base"
        department={department}
        description={`Everything the assistant is allowed to say about ${BRANDS[department].shortName}. Answers are drawn from published entries only.`}
        actions={
          scoped ? undefined : (
            <div className="flex gap-2">
              {(["MARKETING", "INSTITUTE"] as Department[]).map((value) => (
                <Link
                  key={value}
                  href={`/admin/knowledge?department=${value}`}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                    department === value
                      ? "border-primary bg-primary text-primary-foreground"
                      : "bg-card hover:bg-secondary"
                  }`}
                >
                  {BRANDS[value].emoji} {BRANDS[value].shortName}
                </Link>
              ))}
            </div>
          )
        }
      />

      {error && <DbNotice error={error} />}

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <StatCard label="Entries" value={total} icon={BookOpen} department={department} />
        <StatCard label="Published" value={published} icon={FileQuestion} department={department} />
        <StatCard
          label="Categories"
          value={data.categories.length}
          icon={Layers}
          department={department}
        />
      </div>

      <div className="scroll-slim mb-4 flex gap-2 overflow-x-auto pb-1">
        <Link
          href={`/admin/knowledge?department=${department}`}
          className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium ${
            !category ? "border-primary bg-primary text-primary-foreground" : "bg-card"
          }`}
        >
          All {total}
        </Link>
        {data.categories.map((group) => (
          <Link
            key={group.category}
            href={`/admin/knowledge?department=${department}&category=${encodeURIComponent(
              group.category
            )}`}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium ${
              category === group.category
                ? "border-primary bg-primary text-primary-foreground"
                : "bg-card hover:bg-secondary"
            }`}
          >
            {group.category}
            <span className="ml-1.5 opacity-70">{group.count}</span>
          </Link>
        ))}
      </div>

      <DataTable
        rows={data.entries}
        rowKey={(row) => row.id}
        empty="No entries yet. Run `npm run db:seed` to load the starting knowledge base."
        columns={[
          {
            header: "Question",
            cell: (row) => (
              <div className="min-w-0 max-w-lg">
                <p className="text-sm font-medium">{row.question}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {truncate(row.answer.replace(/[*_#]/g, ""), 130)}
                </p>
              </div>
            ),
          },
          {
            header: "Category",
            cell: (row) => (
              <div className="space-y-1">
                <p className="text-xs font-medium">{row.category}</p>
                <p className="text-[11px] text-muted-foreground">{row.kind}</p>
              </div>
            ),
          },
          {
            header: "Keywords",
            cell: (row) => (
              <p className="max-w-[14rem] text-[11px] text-muted-foreground">
                {truncate(row.keywords.join(", "), 70)}
              </p>
            ),
          },
          {
            header: "State",
            cell: (row) => (
              <StatusSelect
                entity={
                  department === "MARKETING" ? "knowledge-marketing" : "knowledge-institute"
                }
                id={row.id}
                field="state"
                value={row.state}
                options={STATES}
              />
            ),
          },
          {
            header: "Version",
            cell: (row) => (
              <div className="text-[11px] text-muted-foreground">
                <p>v{row.version}</p>
                <p>{row.indexedAt ? `Indexed ${formatDate(row.indexedAt)}` : "Not indexed"}</p>
              </div>
            ),
          },
          {
            header: "Business",
            cell: () => <DepartmentTag department={department} />,
          },
        ]}
      />
    </>
  );
}
