export function TypingIndicator() {
  return (
    <div className="flex w-fit items-center gap-1.5 rounded-2xl rounded-bl-md bg-secondary px-4 py-3">
      <span className="sr-only">Assistant is typing…</span>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="size-2 animate-typing-dot rounded-full bg-muted-foreground"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}
