import Link from "next/link";
import { Bot, Home, MessagesSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BRANDING } from "@/lib/branding";

/**
 * App Router 404.
 *
 * Defining this explicitly matters beyond aesthetics: without it, `next build`
 * can fall back to the pages-router error document while prerendering /404,
 * which fails the build with "<Html> should not be imported outside of
 * pages/_document" — notably when NODE_ENV is a non-standard value, as on some
 * shared hosts.
 */
export default function NotFound() {
  return (
    <main className="brand-gradient grid min-h-dvh place-items-center p-6 text-white">
      <div className="w-full max-w-md text-center">
        <span className="mx-auto mb-6 grid size-16 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/25 backdrop-blur">
          <Bot className="size-8" />
        </span>

        <p className="text-6xl font-bold tracking-tight">404</p>
        <h1 className="mt-3 text-xl font-semibold">This page doesn&apos;t exist</h1>
        <p className="mt-2 text-sm text-white/75">
          The link may be out of date. The assistant is still here and happy to help
          with either BITSOL Marketing or BITSOL Institute.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/chat">
            <Button className="gap-2 bg-white text-primary hover:bg-white/90">
              <MessagesSquare className="size-4" /> Open the assistant
            </Button>
          </Link>
          <Link href="/">
            <Button
              variant="outline"
              className="gap-2 border-white/30 bg-white/5 text-white hover:bg-white/15 hover:text-white"
            >
              <Home className="size-4" /> Home
            </Button>
          </Link>
        </div>

        <p className="mt-10 text-[11px] text-white/50">{BRANDING.product.name}</p>
      </div>
    </main>
  );
}
