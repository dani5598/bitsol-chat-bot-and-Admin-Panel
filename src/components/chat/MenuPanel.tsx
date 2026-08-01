"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, ChevronLeft, X } from "lucide-react";
import { BRANDS, type Department } from "@/lib/brands";
import { departmentContent } from "@/data";
import type { ChatAction, MenuEntry } from "@/types";
import { cn } from "@/lib/utils";

/**
 * Slide-over menu for the active department.
 *
 * Renders that business's menu tree (from its `menu.ts` under `src/data`) one
 * level at a time. A leaf either sends a prompt to the assistant or opens a structured
 * workflow form — the menu itself never knows which; it just forwards the entry.
 */
export function MenuPanel({
  department,
  open,
  onClose,
  onPrompt,
  onAction,
}: {
  department: Department;
  open: boolean;
  onClose: () => void;
  onPrompt: (prompt: string) => void;
  onAction: (action: ChatAction) => void;
}) {
  const [stack, setStack] = useState<MenuEntry[]>([]);
  const brand = BRANDS[department];
  const { menu } = departmentContent(department);

  const current = stack.length ? stack[stack.length - 1].children ?? [] : menu;
  const title = stack.length ? stack[stack.length - 1].label : `${brand.shortName} menu`;

  function select(entry: MenuEntry) {
    if (entry.children?.length) {
      setStack((s) => [...s, entry]);
      return;
    }
    if (entry.action) {
      onAction(entry.action);
    } else {
      onPrompt(entry.prompt);
    }
    close();
  }

  function close() {
    setStack([]);
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="absolute inset-0 z-30 bg-foreground/30 backdrop-blur-[2px]"
            aria-hidden
          />

          <motion.aside
            role="dialog"
            aria-label={`${brand.shortName} menu`}
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="absolute inset-y-0 left-0 z-40 flex w-[min(20rem,88%)] flex-col border-r bg-card shadow-glow"
          >
            <header className="flex items-center gap-2 border-b px-3 py-3">
              {stack.length > 0 ? (
                <button
                  type="button"
                  onClick={() => setStack((s) => s.slice(0, -1))}
                  aria-label="Back"
                  className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground"
                >
                  <ChevronLeft className="size-4" />
                </button>
              ) : (
                <span className="grid size-8 place-items-center text-lg" aria-hidden>
                  {brand.emoji}
                </span>
              )}
              <p className="flex-1 truncate text-sm font-semibold">{title}</p>
              <button
                type="button"
                onClick={close}
                aria-label="Close menu"
                className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </header>

            <nav className="scroll-slim flex-1 overflow-y-auto p-2">
              <ul className="space-y-0.5">
                {current.map((entry) => (
                  <li key={entry.id}>
                    <button
                      type="button"
                      onClick={() => select(entry)}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left transition-colors",
                        "hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      )}
                    >
                      <span className="flex-1">
                        <span className="block text-sm font-medium">{entry.label}</span>
                        {entry.labelUr !== entry.label && (
                          <span className="urdu block text-[11px] text-muted-foreground">
                            {entry.labelUr}
                          </span>
                        )}
                      </span>
                      {entry.children?.length ? (
                        <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                      ) : null}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            <footer className="border-t px-4 py-3 text-[11px] text-muted-foreground">
              {brand.contact.phone} · {brand.contact.email}
            </footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
