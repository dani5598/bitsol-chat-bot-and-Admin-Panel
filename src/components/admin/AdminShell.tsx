"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bot, LogOut, Menu, X } from "lucide-react";
import { visibleNav, type NavGroup } from "./nav";
import { BRANDING } from "@/lib/branding";
import { BRANDS, type Department } from "@/lib/brands";
import { cn } from "@/lib/utils";

export interface AdminUser {
  name: string;
  role: string;
  department: Department | null;
}

export interface NavBadges {
  openTickets?: number;
  newLeads?: number;
  newAdmissions?: number;
}

/**
 * Admin console shell — sidebar, mobile drawer and top bar.
 *
 * Navigation is filtered server-side by department and permissions and passed
 * in as `groups`, so this component never has to decide who may see what.
 */
export function AdminShell({
  user,
  groups,
  badges,
  children,
}: {
  user: AdminUser;
  groups: NavGroup[];
  badges: NavBadges;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const scope = user.department ? BRANDS[user.department].shortName : "All businesses";

  async function signOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  const sidebar = (
    <div className="flex h-full flex-col">
      <Link
        href="/admin"
        className="flex items-center gap-2.5 border-b px-4 py-4"
        onClick={() => setOpen(false)}
      >
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
          <Bot className="size-5" />
        </span>
        <span className="flex min-w-0 flex-col leading-tight">
          <span className="truncate text-sm font-bold">{BRANDING.product.shortName}</span>
          <span className="truncate text-[11px] text-muted-foreground">Admin console</span>
        </span>
      </Link>

      <nav className="scroll-slim flex-1 overflow-y-auto px-2 py-3">
        {groups.map((group) => (
          <div key={group.label} className="mb-4">
            <p className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);
                const badge = item.badgeKey ? badges[item.badgeKey] : undefined;

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      data-department={item.department}
                      className={cn(
                        "flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-colors",
                        active
                          ? "bg-primary text-primary-foreground shadow-soft"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      )}
                    >
                      <item.icon className="size-4 shrink-0" />
                      <span className="flex-1 truncate">{item.label}</span>
                      {badge ? (
                        <span
                          className={cn(
                            "rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                            active
                              ? "bg-primary-foreground/20"
                              : "bg-accent/15 text-accent"
                          )}
                        >
                          {badge}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t px-3 py-3">
        <p className="truncate text-sm font-medium">{user.name}</p>
        <p className="truncate text-[11px] text-muted-foreground">
          {user.role.replace(/_/g, " ").toLowerCase()} · {scope}
        </p>
        <button
          type="button"
          onClick={signOut}
          className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive"
        >
          <LogOut className="size-3.5" /> Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-dvh bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r bg-card lg:block">
        <div className="sticky top-0 h-dvh">{sidebar}</div>
      </aside>

      {/* Mobile drawer */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-foreground/40 lg:hidden"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-64 border-r bg-card shadow-glow lg:hidden">
            {sidebar}
          </aside>
        </>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="glass sticky top-0 z-30 flex h-14 items-center gap-3 border-b px-4 lg:hidden">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close navigation" : "Open navigation"}
            className="grid size-9 place-items-center rounded-xl hover:bg-secondary"
          >
            {open ? <Menu className="size-5" /> : <Menu className="size-5" />}
          </button>
          <span className="text-sm font-semibold">{BRANDING.product.shortName}</span>
          {open && (
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close navigation"
              className="ml-auto grid size-9 place-items-center rounded-xl hover:bg-secondary"
            >
              <X className="size-5" />
            </button>
          )}
        </header>

        <main className="min-w-0 flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
