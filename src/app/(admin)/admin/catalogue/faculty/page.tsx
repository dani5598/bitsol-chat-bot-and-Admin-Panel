import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { safeQuery, sessionDepartment } from "@/lib/admin/queries";
import { DbNotice, EmptyState, PageHeader, StatusBadge } from "@/components/admin/ui";
import { Card } from "@/components/ui/card";

export const metadata = { title: "Faculty" };

export default async function FacultyPage() {
  const session = await requireAdmin("/admin/catalogue/faculty");
  if (sessionDepartment(session) === "MARKETING") notFound();

  const { data, error } = await safeQuery(
    () =>
      prisma.faculty.findMany({
        orderBy: { name: "asc" },
        include: {
          _count: { select: { courses: true, batches: true } },
        },
      }),
    []
  );

  return (
    <>
      <PageHeader
        title="Faculty"
        department="INSTITUTE"
        description="Trainers, their specialisms, and the courses and batches they lead."
      />

      {error && <DbNotice error={error} />}

      {data.length ? (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {data.map((member) => (
            <Card key={member.id} data-department="INSTITUTE" className="p-5">
              <div className="mb-2 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold">{member.name}</h3>
                  <p className="text-xs text-muted-foreground">{member.title}</p>
                </div>
                <StatusBadge value={member.isActive ? "ACTIVE" : "INACTIVE"} />
              </div>

              {member.bio && (
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{member.bio}</p>
              )}

              {member.expertise.length > 0 && (
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {member.expertise.map((skill) => (
                    <li
                      key={skill}
                      className="rounded-full bg-secondary px-2 py-0.5 text-[11px] text-secondary-foreground"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-4 flex items-center justify-between border-t pt-3 text-[11px] text-muted-foreground">
                <span>
                  {member._count.courses} courses · {member._count.batches} batches
                </span>
                <span className="font-mono">{member.reference}</span>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          message="No faculty records yet."
          hint="Run `npm run db:seed` to load the starting faculty roster, then assign trainers to courses and batches."
        />
      )}
    </>
  );
}
