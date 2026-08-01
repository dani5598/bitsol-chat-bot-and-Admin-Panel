"use client";

import { motion } from "framer-motion";
import { ArrowRight, Building2, GraduationCap } from "lucide-react";
import { BRANDS, type Department } from "@/lib/brands";
import { t, type Language } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * The welcome screen from the brief:
 *
 *   👋 Welcome to BITSOL.
 *   Please choose how I can assist you today.
 *   🏢 BITSOL Marketing   🎓 BITSOL Institute
 *
 * Choosing pins the department for the rest of the conversation (the user can
 * still switch at any time from the chat header). Each card previews its own
 * brand colours so the choice feels like walking through the right door.
 */
export function DepartmentPicker({
  onPick,
  language = "en",
  compact = false,
}: {
  onPick: (department: Department) => void;
  language?: Language;
  compact?: boolean;
}) {
  const options: Array<{
    department: Department;
    icon: typeof Building2;
    label: string;
    hint: string;
  }> = [
    {
      department: "MARKETING",
      icon: Building2,
      label: t("welcome.marketing", language),
      hint: t("welcome.marketingHint", language),
    },
    {
      department: "INSTITUTE",
      icon: GraduationCap,
      label: t("welcome.institute", language),
      hint: t("welcome.instituteHint", language),
    },
  ];

  return (
    <div className={cn("mx-auto w-full max-w-2xl", compact ? "py-2" : "py-6")}>
      {!compact && (
        <div className="mb-8 text-center">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl"
            aria-hidden
          >
            👋
          </motion.p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight">
            {t("welcome.title", language)}
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {t("welcome.subtitle", language)}
          </p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {options.map((option, index) => {
          const brand = BRANDS[option.department];
          return (
            <motion.button
              key={option.department}
              type="button"
              data-department={option.department}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * index, type: "spring", stiffness: 160, damping: 18 }}
              onClick={() => onPick(option.department)}
              className="group relative overflow-hidden rounded-2xl border bg-card p-5 text-left shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span
                className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-primary"
                aria-hidden
              />
              <span className="mb-3 inline-grid size-12 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <option.icon className="size-6" />
              </span>

              <span className="flex items-center gap-2">
                <span aria-hidden>{brand.emoji}</span>
                <span className="text-base font-semibold">{option.label}</span>
              </span>
              <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                {option.hint}
              </span>

              <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-primary">
                Continue
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </motion.button>
          );
        })}
      </div>

      {!compact && (
        <p className="mt-6 text-center text-[11px] text-muted-foreground">
          You can switch between them at any time during the conversation.
        </p>
      )}
    </div>
  );
}
