import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, GraduationCap, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PageHeader, StatusBadge } from "@/components/admin/ui";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { ActivityComposer } from "@/components/admin/ActivityComposer";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { safeQuery, sessionDepartment } from "@/lib/admin/queries";
import { findCourse } from "@/data/institute/courses";
import { formatDateTime, humanise } from "@/lib/utils";

export const metadata = { title: "Admission Inquiry" };

const STAGES = [
  "INQUIRY", "CONTACTED", "COUNSELLED", "APPLIED",
  "FEE_PENDING", "ENROLLED", "DROPPED", "LOST",
] as const;
const PRIORITIES = ["LOW", "NORMAL", "HIGH", "URGENT"] as const;

export default async function AdmissionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireAdmin();
  if (sessionDepartment(session) === "MARKETING") notFound();

  const { id } = await params;

  const { data } = await safeQuery(
    async () => {
      const [admission, activities] = await Promise.all([
        prisma.admission.findUnique({
          where: { id },
          include: {
            owner: { select: { name: true } },
            course: { select: { name: true, slug: true, duration: true, feeFrom: true } },
            batch: { select: { code: true, schedule: true, startDate: true } },
            conversation: { select: { reference: true } },
            student: { select: { rollNumber: true } },
          },
        }),
        prisma.crmActivity.findMany({
          where: { entityType: "Admission", entityId: id },
          orderBy: { createdAt: "desc" },
          include: { owner: { select: { name: true } } },
        }),
      ]);
      return { admission, activities };
    },
    { admission: null, activities: [] as never[] }
  );

  const admission = data.admission;
  if (!admission) notFound();

  const catalogue = admission.course?.slug ? findCourse(admission.course.slug) : undefined;

  return (
    <>
      <Link
        href="/admin/crm/admissions"
        className="mb-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="size-3.5" /> All admission inquiries
      </Link>

      <PageHeader
        title={admission.studentName}
        department="INSTITUTE"
        description={`Inquiry ${admission.reference} · received ${formatDateTime(admission.createdAt)} from ${humanise(admission.source)}`}
        actions={
          <div className="flex items-center gap-2">
            <StatusSelect
              entity="admissions"
              id={admission.id}
              field="stage"
              value={admission.stage}
              options={STAGES}
            />
            <StatusSelect
              entity="admissions"
              id={admission.id}
              field="priority"
              value={admission.priority}
              options={PRIORITIES}
            />
          </div>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card className="p-5">
            <h2 className="mb-3 text-sm font-semibold">Course interest</h2>
            <div className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                <GraduationCap className="size-5" />
              </span>
              <div className="min-w-0">
                <p className="font-medium">
                  {admission.course?.name ?? admission.courseName ?? "Not specified"}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {admission.course?.duration ?? catalogue?.duration ?? "—"} ·{" "}
                  {admission.course?.feeFrom ?? catalogue?.fee.startingAt ?? "Fee on request"}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Preferred batch: {admission.preferredBatch ?? "No preference given"}
                </p>
                {admission.batch && (
                  <p className="mt-1 text-xs">
                    Assigned batch:{" "}
                    <span className="font-medium">{admission.batch.code}</span> ·{" "}
                    {admission.batch.schedule}
                  </p>
                )}
              </div>
            </div>

            {admission.notes && (
              <>
                <h3 className="mb-1.5 mt-5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Notes from the inquiry
                </h3>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{admission.notes}</p>
              </>
            )}
          </Card>

          <Card className="p-5">
            <h2 className="mb-3 text-sm font-semibold">Counselling log & follow-ups</h2>
            <ActivityComposer
              entityType="Admission"
              entityId={admission.id}
              department="INSTITUTE"
            />

            {data.activities.length ? (
              <ul className="mt-4 space-y-3">
                {data.activities.map((activity) => (
                  <li key={activity.id} className="flex gap-3 border-l-2 border-secondary pl-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge value={activity.type} />
                        <span className="text-[11px] text-muted-foreground">
                          {activity.owner?.name ?? "System"} ·{" "}
                          {formatDateTime(activity.createdAt)}
                        </span>
                        {activity.dueAt && (
                          <span className="text-[11px] font-medium text-accent">
                            Due {formatDateTime(activity.dueAt)}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 whitespace-pre-wrap text-sm">{activity.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-xs text-muted-foreground">
                No counselling notes yet. Log the first call here.
              </p>
            )}
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-5">
            <h2 className="mb-3 text-sm font-semibold">Contact</h2>
            <dl className="space-y-2.5 text-sm">
              <Row icon={Phone} label="Phone" value={admission.phone} />
              <Row icon={MessageCircle} label="WhatsApp" value={admission.whatsapp ?? "—"} />
              <Row icon={Mail} label="Email" value={admission.email ?? "—"} />
              <Row icon={MapPin} label="City" value={admission.city ?? "—"} />
            </dl>
          </Card>

          <Card className="p-5">
            <h2 className="mb-3 text-sm font-semibold">Student details</h2>
            <dl className="space-y-2 text-sm">
              <Detail label="Father's name" value={admission.fatherName ?? "—"} />
              <Detail label="Qualification" value={admission.qualification ?? "—"} />
              <Detail label="Officer" value={admission.owner?.name ?? "Unassigned"} />
              <Detail label="Roll number" value={admission.student?.rollNumber ?? "Not enrolled"} />
              {admission.lostReason && (
                <Detail label="Lost reason" value={admission.lostReason} />
              )}
            </dl>
          </Card>

          <Card className="p-5">
            <h2 className="mb-3 text-sm font-semibold">Source</h2>
            <p className="text-xs text-muted-foreground">
              Conversation:{" "}
              <span className="font-mono text-foreground">
                {admission.conversation?.reference ?? "—"}
              </span>
            </p>
          </Card>
        </div>
      </div>
    </>
  );
}

function Row({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0">
        <dt className="text-[11px] text-muted-foreground">{label}</dt>
        <dd className="break-words font-medium">{value}</dd>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-[11px] text-muted-foreground">{label}</dt>
      <dd className="text-right text-sm font-medium">{value}</dd>
    </div>
  );
}
