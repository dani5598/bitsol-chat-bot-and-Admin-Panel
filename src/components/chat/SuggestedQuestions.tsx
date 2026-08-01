"use client";

import { Card } from "@/components/ui/card";
import { departmentContent } from "@/data";
import { t, type Language } from "@/lib/i18n";
import type { Department } from "@/lib/brands";

/**
 * Empty-state suggestion grid for the active department. Cards come from that
 * business's menu file, so Marketing visitors never see course prompts and
 * Institute visitors never see project-quote prompts.
 */
export function SuggestedQuestions({
  department,
  language = "en",
  onPick,
}: {
  department: Department;
  language?: Language;
  onPick: (prompt: string) => void;
}) {
  const { suggestions } = departmentContent(department);

  return (
    <div className="mx-auto w-full max-w-2xl">
      <p className="mb-3 text-center text-sm font-medium text-muted-foreground">
        {t("chat.tryAsking", language)}
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {suggestions.map((topic) => (
          <button
            key={topic.title}
            type="button"
            onClick={() => onPick(topic.prompt)}
            className="text-left"
          >
            <Card className="animate-fade-in-up flex h-full items-start gap-3 p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-glow">
              <span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
              <span className="flex flex-col">
                <span className="text-sm font-semibold">{topic.title}</span>
                <span className="urdu text-xs text-muted-foreground">{topic.titleUr}</span>
              </span>
            </Card>
          </button>
        ))}
      </div>
    </div>
  );
}
