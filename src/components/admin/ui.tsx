import * as React from "react";
import Link from "next/link";
import { AlertTriangle, Database, Inbox } from "lucide-react";
import { Card } from "@/components/ui/card";
import { BRANDS, type Department } from "@/lib/brands";
import { cn, humanise } from "@/lib/utils";

/**
 * Shared presentation pieces for the admin console. Server-component friendly
 * (no hooks) so every module page can be a server component that queries
 * Prisma directly and renders without a client bundle.
 */

// ------------------------------------------------------------ PageHeader ----

export function PageHeader({
  title,
  description,
  department,
  actions,
}: {
  title: string;
  description?: string;
  department?: Department;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {department && <DepartmentTag department={department} />}
        </div>
        {description && (
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}

// --------------------------------------------------------- DepartmentTag ----

export function DepartmentTag({ department }: { department: Department }) {
  const brand = BRANDS[department];
  return (
    <span
      data-department={department}
      className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary"
    >
      <span aria-hidden>{brand.emoji}</span>
      {brand.shortName}
    </span>
  );
}

// --------------------------------------------------------------- StatCard ---

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  department,
  href,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon?: React.ComponentType<{ className?: string }>;
  department?: Department;
  href?: string;
}) {
  const body = (
    <Card
      data-department={department}
      className={cn(
        "flex h-full items-start gap-3 p-4",
        href && "transition-all hover:-translate-y-0.5 hover:shadow-glow"
      )}
    >
      {Icon && (
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
          <Icon className="size-5" />
        </span>
      )}
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-0.5 text-2xl font-bold leading-none">{value}</p>
        {hint && <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p>}
      </div>
    </Card>
  );

  return href ? <Link href={href}>{body}</Link> : body;
}

// ------------------------------------------------------------- StatusBadge --

const STATUS_TONES: Record<string, string> = {
  // Positive / terminal-good
  WON: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-400",
  ENROLLED: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-400",
  RESOLVED: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-400",
  ACCEPTED: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-400",
  COMPLETED: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-400",
  CONFIRMED: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-400",
  PAID: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-400",
  PUBLISHED: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-400",
  SENT: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-400",
  PRESENT: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-400",
  // Negative / terminal-bad
  LOST: "bg-rose-500/12 text-rose-700 dark:text-rose-400",
  DROPPED: "bg-rose-500/12 text-rose-700 dark:text-rose-400",
  REJECTED: "bg-rose-500/12 text-rose-700 dark:text-rose-400",
  CANCELLED: "bg-rose-500/12 text-rose-700 dark:text-rose-400",
  FAILED: "bg-rose-500/12 text-rose-700 dark:text-rose-400",
  OVERDUE: "bg-rose-500/12 text-rose-700 dark:text-rose-400",
  ABSENT: "bg-rose-500/12 text-rose-700 dark:text-rose-400",
  NO_SHOW: "bg-rose-500/12 text-rose-700 dark:text-rose-400",
  URGENT: "bg-rose-500/12 text-rose-700 dark:text-rose-400",
  // Attention
  FEE_PENDING: "bg-amber-500/14 text-amber-700 dark:text-amber-400",
  PENDING: "bg-amber-500/14 text-amber-700 dark:text-amber-400",
  WAITING_CUSTOMER: "bg-amber-500/14 text-amber-700 dark:text-amber-400",
  ON_HOLD: "bg-amber-500/14 text-amber-700 dark:text-amber-400",
  HIGH: "bg-amber-500/14 text-amber-700 dark:text-amber-400",
  LATE: "bg-amber-500/14 text-amber-700 dark:text-amber-400",
  // In flight
  NEW: "bg-sky-500/12 text-sky-700 dark:text-sky-400",
  INQUIRY: "bg-sky-500/12 text-sky-700 dark:text-sky-400",
  OPEN: "bg-sky-500/12 text-sky-700 dark:text-sky-400",
  REQUESTED: "bg-sky-500/12 text-sky-700 dark:text-sky-400",
  ENROLLING: "bg-sky-500/12 text-sky-700 dark:text-sky-400",
};

export function StatusBadge({ value }: { value: string }) {
  return (
    <span
      className={cn(
        "inline-flex whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-medium",
        STATUS_TONES[value] ?? "bg-secondary text-secondary-foreground"
      )}
    >
      {humanise(value)}
    </span>
  );
}

// -------------------------------------------------------------- DataTable ---

export interface Column<T> {
  header: string;
  /** Cell renderer. Keep it presentational — no data fetching here. */
  cell: (row: T) => React.ReactNode;
  className?: string;
}

export function DataTable<T>({
  rows,
  columns,
  empty = "Nothing here yet.",
  rowKey,
}: {
  rows: T[];
  columns: Column<T>[];
  empty?: string;
  rowKey: (row: T, index: number) => string;
}) {
  if (!rows.length) return <EmptyState message={empty} />;

  return (
    <Card className="overflow-hidden p-0">
      <div className="scroll-slim overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b bg-secondary/50 text-left">
              {columns.map((column) => (
                <th
                  key={column.header}
                  className={cn(
                    "whitespace-nowrap px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground",
                    column.className
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr
                key={rowKey(row, index)}
                className="border-b last:border-0 hover:bg-secondary/40"
              >
                {columns.map((column) => (
                  <td
                    key={column.header}
                    className={cn("px-4 py-3 align-top", column.className)}
                  >
                    {column.cell(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

// ------------------------------------------------------------- EmptyState ---

export function EmptyState({ message, hint }: { message: string; hint?: string }) {
  return (
    <Card className="flex flex-col items-center gap-2 p-10 text-center">
      <span className="grid size-11 place-items-center rounded-xl bg-secondary text-muted-foreground">
        <Inbox className="size-5" />
      </span>
      <p className="text-sm font-medium">{message}</p>
      {hint && <p className="max-w-sm text-xs text-muted-foreground">{hint}</p>}
    </Card>
  );
}

// ------------------------------------------------------------- DbNotice -----

/**
 * Shown when a module's query failed — almost always a missing or unreachable
 * DATABASE_URL in local development. Keeps the console usable instead of
 * throwing a 500 on every page.
 */
export function DbNotice({ error }: { error?: string }) {
  return (
    <Card className="mb-6 flex items-start gap-3 border-amber-500/30 bg-amber-500/5 p-4">
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-amber-500/15 text-amber-600">
        <Database className="size-4" />
      </span>
      <div className="text-sm">
        <p className="font-medium">Database unavailable</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          This module is showing empty results. Check <code>DATABASE_URL</code>, then run{" "}
          <code>npx prisma migrate deploy</code> and <code>npm run db:seed</code>.
          {error ? ` (${error})` : ""}
        </p>
      </div>
    </Card>
  );
}

// --------------------------------------------------------------- Callout ----

export function Callout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="flex items-start gap-3 border-primary/25 bg-primary/5 p-4">
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
        <AlertTriangle className="size-4" />
      </span>
      <div className="text-sm">
        <p className="font-medium">{title}</p>
        <div className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{children}</div>
      </div>
    </Card>
  );
}
