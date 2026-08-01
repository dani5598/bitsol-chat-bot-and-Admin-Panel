import {
  Bell,
  BookOpen,
  Boxes,
  Briefcase,
  Building2,
  CalendarClock,
  CalendarDays,
  ClipboardList,
  Contact,
  FileText,
  FolderKanban,
  GaugeCircle,
  GraduationCap,
  Images,
  LayoutDashboard,
  LifeBuoy,
  MessagesSquare,
  Megaphone,
  Plug,
  ReceiptText,
  ScrollText,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  Users,
  UsersRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Department } from "@/lib/brands";

/**
 * Admin console navigation.
 *
 * `department` on an item scopes it to one business: staff assigned to BITSOL
 * Marketing never see the admissions pipeline, and Institute staff never see
 * the sales pipeline. Items without a department are shared infrastructure.
 *
 * `permission` names the RBAC capability required. Admin and Super Admin pass
 * everything; other roles are filtered against their granted permissions.
 */
export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  department?: Department;
  permission?: string;
  /** Shown as a small pill, e.g. live counts injected by the shell. */
  badgeKey?: "openTickets" | "newLeads" | "newAdmissions";
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const ADMIN_NAV: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard, permission: "dashboard.view" },
      {
        label: "Live Conversations",
        href: "/admin/conversations",
        icon: MessagesSquare,
        permission: "conversations.view",
      },
    ],
  },
  {
    label: "CRM",
    items: [
      {
        label: "Marketing Leads",
        href: "/admin/crm/leads",
        icon: Briefcase,
        department: "MARKETING",
        permission: "crm.leads.view",
        badgeKey: "newLeads",
      },
      {
        label: "Admission Inquiries",
        href: "/admin/crm/admissions",
        icon: ClipboardList,
        department: "INSTITUTE",
        permission: "crm.admissions.view",
        badgeKey: "newAdmissions",
      },
      {
        label: "Customers",
        href: "/admin/crm/customers",
        icon: Contact,
        department: "MARKETING",
        permission: "customers.manage",
      },
      {
        label: "Students",
        href: "/admin/crm/students",
        icon: UsersRound,
        department: "INSTITUTE",
        permission: "students.manage",
      },
      {
        label: "Follow-ups",
        href: "/admin/crm/follow-ups",
        icon: CalendarClock,
        permission: "dashboard.view",
      },
    ],
  },
  {
    label: "Catalogue",
    items: [
      {
        label: "Services",
        href: "/admin/catalogue/services",
        icon: Boxes,
        department: "MARKETING",
        permission: "services.manage",
      },
      {
        label: "Projects",
        href: "/admin/catalogue/projects",
        icon: FolderKanban,
        department: "MARKETING",
        permission: "customers.manage",
      },
      {
        label: "Portfolio",
        href: "/admin/catalogue/portfolio",
        icon: Images,
        department: "MARKETING",
        permission: "portfolio.manage",
      },
      {
        label: "Courses",
        href: "/admin/catalogue/courses",
        icon: GraduationCap,
        department: "INSTITUTE",
        permission: "courses.manage",
      },
      {
        label: "Batches",
        href: "/admin/catalogue/batches",
        icon: CalendarDays,
        department: "INSTITUTE",
        permission: "courses.manage",
      },
      {
        label: "Faculty",
        href: "/admin/catalogue/faculty",
        icon: Users,
        department: "INSTITUTE",
        permission: "courses.manage",
      },
    ],
  },
  {
    label: "Content",
    items: [
      {
        label: "Knowledge Base",
        href: "/admin/knowledge",
        icon: BookOpen,
        permission: "knowledge.view",
      },
      { label: "Media & Documents", href: "/admin/media", icon: FileText, permission: "knowledge.manage" },
      { label: "Events", href: "/admin/events", icon: CalendarDays, permission: "knowledge.manage" },
      { label: "AI Training", href: "/admin/ai-training", icon: Sparkles, permission: "knowledge.publish" },
    ],
  },
  {
    label: "Operations",
    items: [
      {
        label: "Support Tickets",
        href: "/admin/support/tickets",
        icon: LifeBuoy,
        permission: "tickets.view",
        badgeKey: "openTickets",
      },
      { label: "Meetings", href: "/admin/meetings", icon: CalendarClock, permission: "meetings.manage" },
      {
        label: "Quotations",
        href: "/admin/quotes",
        icon: ReceiptText,
        department: "MARKETING",
        permission: "quotes.manage",
      },
    ],
  },
  {
    label: "Messaging",
    items: [
      {
        label: "WhatsApp Templates",
        href: "/admin/messaging/templates",
        icon: Send,
        permission: "broadcasts.send",
      },
      {
        label: "Broadcasts",
        href: "/admin/messaging/broadcasts",
        icon: Megaphone,
        permission: "broadcasts.send",
      },
      { label: "Notifications", href: "/admin/notifications", icon: Bell, permission: "dashboard.view" },
    ],
  },
  {
    label: "Insights",
    items: [
      { label: "Reports & Analytics", href: "/admin/reports", icon: GaugeCircle, permission: "reports.view" },
    ],
  },
  {
    label: "Administration",
    items: [
      { label: "Users", href: "/admin/users", icon: Users, permission: "users.manage" },
      { label: "Roles & Permissions", href: "/admin/roles", icon: ShieldCheck, permission: "users.manage" },
      { label: "Settings", href: "/admin/settings", icon: Settings, permission: "settings.manage" },
      { label: "Integrations", href: "/admin/integrations", icon: Plug, permission: "settings.manage" },
      { label: "System Logs", href: "/admin/logs", icon: ScrollText, permission: "logs.view" },
    ],
  },
];

/** Department icons reused across the console. */
export const DEPARTMENT_ICON: Record<Department, LucideIcon> = {
  MARKETING: Building2,
  INSTITUTE: GraduationCap,
};

/**
 * Filter navigation for a session: department-scoped staff only see their own
 * business's modules, and items are hidden when the role lacks the permission.
 */
export function visibleNav(
  department: Department | null | undefined,
  permissions: Set<string> | null
): NavGroup[] {
  return ADMIN_NAV.map((group) => ({
    label: group.label,
    items: group.items.filter((item) => {
      if (department && item.department && item.department !== department) return false;
      if (permissions && item.permission && !permissions.has(item.permission)) return false;
      return true;
    }),
  })).filter((group) => group.items.length > 0);
}
