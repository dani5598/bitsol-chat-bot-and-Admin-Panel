import { Bot, Building2, GraduationCap, User2, Volume2 } from "lucide-react";
import { cn, isUrduScript } from "@/lib/utils";
import type { ChatMessage } from "@/types";

/**
 * Renders a single chat message. Detects Urdu/Punjabi script to switch to RTL,
 * shows a department-specific assistant avatar, and applies a small, safe text
 * formatter (bold + bullets + headings) so responses read well without pulling
 * in a full markdown renderer.
 */
export function MessageBubble({
  message,
  onSpeak,
}: {
  message: ChatMessage;
  onSpeak?: (text: string) => void;
}) {
  const isUser = message.role === "user";
  const rtl = isUrduScript(message.content);

  const AssistantIcon =
    message.department === "MARKETING"
      ? Building2
      : message.department === "INSTITUTE"
        ? GraduationCap
        : Bot;

  return (
    <div className={cn("flex w-full gap-3", isUser ? "flex-row-reverse" : "flex-row")}>
      <span
        className={cn(
          "mt-1 grid size-8 shrink-0 place-items-center rounded-lg shadow-sm",
          isUser ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"
        )}
        aria-hidden
      >
        {isUser ? <User2 className="size-4" /> : <AssistantIcon className="size-4" />}
      </span>

      <div
        className={cn(
          "group relative max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm md:max-w-[75%]",
          isUser
            ? "rounded-br-md bg-primary text-primary-foreground"
            : "rounded-bl-md bg-secondary text-secondary-foreground"
        )}
      >
        <div className={cn(rtl && "urdu")}>{renderContent(message.content)}</div>

        {!isUser && message.content && onSpeak && (
          <button
            type="button"
            onClick={() => onSpeak(message.content)}
            aria-label="Read this answer aloud"
            className="absolute -bottom-3 right-2 hidden rounded-full bg-background p-1.5 text-muted-foreground shadow ring-1 ring-border transition group-hover:block hover:text-primary"
          >
            <Volume2 className="size-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

/** Tiny formatter: headings, bullets, numbered steps and **bold** — no HTML injection. */
function renderContent(text: string) {
  return text.split("\n").map((line, i) => {
    const trimmed = line.trimStart();

    if (!trimmed) return <span key={i} className="block h-2" />;

    // A line that is entirely bold reads as a section heading.
    const heading = /^\*\*(.+)\*\*:?$/.exec(trimmed);
    if (heading) {
      return (
        <p key={i} className={cn("font-semibold", i > 0 && "mt-2.5")}>
          {heading[1]}
        </p>
      );
    }

    const bullet = /^([-*•])\s+/.exec(trimmed);
    const numbered = /^(\d+)\.\s+/.exec(trimmed);
    const clean = trimmed.replace(/^([-*•]|\d+\.)\s+/, "");

    if (bullet || numbered) {
      return (
        <p key={i} className={cn("flex gap-2", i > 0 && "mt-1")}>
          <span className="select-none text-accent">{numbered ? `${numbered[1]}.` : "•"}</span>
          <span>{formatInline(clean)}</span>
        </p>
      );
    }

    return (
      <p key={i} className={cn(i > 0 && "mt-1.5")}>
        {formatInline(line)}
      </p>
    );
  });
}

function formatInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|_[^_]+_)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.length > 2 && part.startsWith("_") && part.endsWith("_")) {
      return (
        <em key={i} className="opacity-80">
          {part.slice(1, -1)}
        </em>
      );
    }
    return <span key={i}>{part}</span>;
  });
}
