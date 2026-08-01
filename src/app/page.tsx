import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Building2,
  GraduationCap,
  Languages,
  MessagesSquare,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import { SplashScreen } from "@/components/splash/SplashScreen";
import { Footer } from "@/components/branding/Footer";
import { BitsolBranding } from "@/components/branding/BitsolBranding";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BRANDING } from "@/lib/branding";
import { BRANDS } from "@/lib/brands";
import { MARKETING_SERVICES } from "@/data/marketing/services";
import { INSTITUTE_COURSES } from "@/data/institute/courses";

const CAPABILITIES = [
  {
    icon: Workflow,
    title: "Knows which door you need",
    body: "The assistant works out whether you're here for BITSOL Marketing services or BITSOL Institute admissions — and remembers it for the rest of the conversation.",
  },
  {
    icon: Languages,
    title: "Four languages, one conversation",
    body: "English, Urdu, Roman Urdu and Punjabi — it replies in whichever you write in, and switches with you mid-chat.",
  },
  {
    icon: MessagesSquare,
    title: "Does more than answer",
    body: "Capture a lead, request a quote, book a consultation, start an admission inquiry or raise a support ticket — each with its own reference number.",
  },
  {
    icon: ShieldCheck,
    title: "Answers from BITSOL's own content",
    body: "Every reply is grounded in an approved knowledge base per business, so information is never mixed between the two.",
  },
];

export default function HomePage() {
  return (
    <>
      <SplashScreen />

      <main className="flex min-h-dvh flex-col">
        {/* Header */}
        <header className="glass sticky top-0 z-40">
          <div className="container flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-soft">
                <Bot className="size-5" />
              </span>
              <span className="flex flex-col leading-none">
                <span className="text-sm font-bold">{BRANDING.product.name}</span>
                <span className="text-[11px] text-muted-foreground">
                  {BRANDS.MARKETING.shortName} · {BRANDS.INSTITUTE.shortName}
                </span>
              </span>
            </Link>
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </Link>
              <Link href="/chat">
                <Button size="sm" className="gap-1.5">
                  Open Assistant <ArrowRight className="size-4" />
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Hero */}
        <section className="brand-gradient relative overflow-hidden text-white">
          <div className="container grid gap-10 py-20 md:grid-cols-2 md:py-28">
            <div className="flex flex-col justify-center gap-6">
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium ring-1 ring-white/20">
                <span className="size-2 animate-pulse rounded-full bg-white/80" />
                24/7 · {BRANDING.product.poweredBy}
              </span>
              <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-5xl">
                Two businesses.
                <br />
                <span className="text-white/70">One AI assistant.</span>
              </h1>
              <p className="max-w-md text-white/80">
                Ask about services, pricing, quotes and consultations for{" "}
                <strong className="font-semibold text-white">BITSOL Marketing</strong> — or
                courses, admissions, fees and career guidance for{" "}
                <strong className="font-semibold text-white">BITSOL Institute</strong>. In
                English, Urdu, Roman Urdu or Punjabi.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Link href="/chat">
                  <Button
                    size="lg"
                    className="gap-2 bg-white text-primary hover:bg-white/90"
                  >
                    <MessagesSquare className="size-5" /> Start a conversation
                  </Button>
                </Link>
                <Link href="/about">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white/30 bg-white/5 text-white hover:bg-white/15 hover:text-white"
                  >
                    Learn more
                  </Button>
                </Link>
              </div>
            </div>

            {/* Preview card */}
            <div className="flex items-center justify-center">
              <Card className="glass w-full max-w-sm border-white/20 p-5 text-foreground">
                <div className="flex items-center gap-2 border-b pb-3">
                  <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
                    <Bot className="size-4" />
                  </span>
                  <span className="text-sm font-semibold">
                    {BRANDING.product.shortName}
                  </span>
                  <span className="ml-auto inline-flex items-center gap-1 text-[11px] text-accent">
                    <span className="size-2 rounded-full bg-accent" /> online
                  </span>
                </div>
                <div className="space-y-3 py-4 text-sm">
                  <p className="w-fit max-w-[92%] rounded-2xl rounded-bl-md bg-secondary px-3 py-2">
                    👋 Welcome to BITSOL. Please choose how I can assist you today.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full border bg-background px-3 py-1 text-xs">
                      🏢 BITSOL Marketing
                    </span>
                    <span className="rounded-full border bg-background px-3 py-1 text-xs">
                      🎓 BITSOL Institute
                    </span>
                  </div>
                  <p className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-primary px-3 py-2 text-primary-foreground">
                    Mujhe SEO course ki fees chahiye
                  </p>
                  <p className="w-fit max-w-[92%] rounded-2xl rounded-bl-md bg-secondary px-3 py-2">
                    SEO course 2 mahine ka hai, fees PKR 30,000 se shuru…
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* The two businesses */}
        <section className="container py-16 md:py-24">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">Pick your side of BITSOL</h2>
            <p className="mt-3 text-muted-foreground">
              The assistant routes you automatically — but here's what sits behind each door.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <BusinessCard
              department="MARKETING"
              icon={Building2}
              items={MARKETING_SERVICES.slice(0, 8).map((s) => s.name)}
              footer={`${MARKETING_SERVICES.length} services`}
            />
            <BusinessCard
              department="INSTITUTE"
              icon={GraduationCap}
              items={INSTITUTE_COURSES.slice(0, 8).map((c) => c.name)}
              footer={`${INSTITUTE_COURSES.length} courses`}
            />
          </div>
        </section>

        {/* Capabilities */}
        <section className="border-y bg-secondary/40 py-16 md:py-20">
          <div className="container">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight">
                Built to do the work, not just chat
              </h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {CAPABILITIES.map((capability) => (
                <Card key={capability.title} className="animate-fade-in-up p-5">
                  <span className="mb-4 inline-grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                    <capability.icon className="size-5" />
                  </span>
                  <h3 className="text-sm font-semibold">{capability.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    {capability.body}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container py-16 md:py-20">
          <div className="flex flex-col items-center gap-4 text-center">
            <h2 className="text-2xl font-bold tracking-tight">
              Ready when you are — day or night.
            </h2>
            <Link href="/chat">
              <Button size="lg" className="gap-2">
                Open the assistant <ArrowRight className="size-5" />
              </Button>
            </Link>
            <BitsolBranding />
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}

function BusinessCard({
  department,
  icon: Icon,
  items,
  footer,
}: {
  department: "MARKETING" | "INSTITUTE";
  icon: typeof Building2;
  items: string[];
  footer: string;
}) {
  const brand = BRANDS[department];

  return (
    <Card
      data-department={department}
      className="flex flex-col overflow-hidden p-0 transition-shadow hover:shadow-glow"
    >
      <div className="brand-gradient p-6 text-white">
        <span className="mb-3 inline-grid size-12 place-items-center rounded-xl bg-white/15 ring-1 ring-white/25">
          <Icon className="size-6" />
        </span>
        <h3 className="text-xl font-bold">
          {brand.emoji} {brand.shortName}
        </h3>
        <p className="mt-1 text-sm text-white/80">{brand.tagline}</p>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="text-sm leading-relaxed text-muted-foreground">{brand.description}</p>

        <ul className="mt-5 flex flex-wrap gap-1.5">
          {items.map((item) => (
            <li
              key={item}
              className="rounded-full border bg-secondary px-2.5 py-1 text-[11px] text-secondary-foreground"
            >
              {item}
            </li>
          ))}
          <li className="rounded-full border border-dashed px-2.5 py-1 text-[11px] text-muted-foreground">
            {footer}
          </li>
        </ul>

        <div className="mt-6 flex items-center justify-between gap-3 border-t pt-5">
          <div className="text-[11px] text-muted-foreground">
            <p>{brand.contact.phone}</p>
            <p className="break-all">{brand.contact.email}</p>
          </div>
          <Link href="/chat">
            <Button size="sm" className="gap-1.5">
              Chat <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
