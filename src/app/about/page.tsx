import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowLeft,
  Bot,
  Building2,
  GraduationCap,
  Globe,
  Languages,
  Lock,
  Sparkles,
  Workflow,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/branding/Footer";
import { BitsolBranding } from "@/components/branding/BitsolBranding";
import { BRANDING, brandName, brandUrl, brandTagline } from "@/lib/branding";
import { BRANDS } from "@/lib/brands";

export const metadata: Metadata = {
  title: "About",
  description:
    "About the BITSOL AI Assistant — one assistant serving BITSOL Marketing and BITSOL Institute of Digital Media & Artificial Intelligence.",
};

const FEATURES = [
  {
    icon: Workflow,
    title: "Intelligent routing",
    desc: "Works out whether you need BITSOL Marketing or BITSOL Institute, remembers the choice, and lets you switch whenever you like.",
  },
  {
    icon: Languages,
    title: "Four languages",
    desc: "English, Urdu, Roman Urdu and Punjabi — with tolerance for spelling mistakes, abbreviations and mixed-language messages.",
  },
  {
    icon: Sparkles,
    title: "Grounded answers",
    desc: "Replies come from an approved knowledge base per business, so service and course information is never mixed.",
  },
  {
    icon: Globe,
    title: "24/7 availability",
    desc: "Leads, admission inquiries, bookings and support tickets are captured at 2am just as reliably as at 2pm.",
  },
  {
    icon: Bot,
    title: "Actions, not just answers",
    desc: "Quotes, consultations, admission inquiries and support tickets are created with real reference numbers and routed to the right team.",
  },
  {
    icon: Lock,
    title: "Secure by design",
    desc: "Rate limiting, JWT sessions, role-based access, input validation and full audit logging across every module.",
  },
];

export default function AboutPage() {
  return (
    <main className="flex min-h-dvh flex-col">
      <header className="glass sticky top-0 z-40">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Bot className="size-5" />
            </span>
            <span className="text-sm font-bold">{BRANDING.product.name}</span>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-1.5">
              <ArrowLeft className="size-4" /> Home
            </Button>
          </Link>
        </div>
      </header>

      <section className="container max-w-3xl py-16">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          About the {BRANDING.product.name}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {BRANDING.product.description} One conversation, two businesses — with a strict
          wall between them so a customer asking about a website never gets course fees,
          and a student asking about admissions never gets a project quotation.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {[BRANDS.MARKETING, BRANDS.INSTITUTE].map((brand) => (
            <Card key={brand.id} data-department={brand.id} className="p-5">
              <span className="mb-3 inline-grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                {brand.id === "MARKETING" ? (
                  <Building2 className="size-5" />
                ) : (
                  <GraduationCap className="size-5" />
                )}
              </span>
              <h3 className="font-semibold">
                {brand.emoji} {brand.shortName}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">{brand.description}</p>
              <p className="mt-3 text-xs font-medium text-primary">
                {brand.purpose.join(" · ")}
              </p>
            </Card>
          ))}
        </div>

        <h2 className="mt-14 text-xl font-bold tracking-tight">What it does</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {FEATURES.map((feature) => (
            <Card key={feature.title} className="p-5">
              <span className="mb-3 inline-grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                <feature.icon className="size-5" />
              </span>
              <h3 className="font-semibold">{feature.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{feature.desc}</p>
            </Card>
          ))}
        </div>

        <Card className="brand-gradient mt-12 border-0 p-8 text-white">
          <h2 className="text-xl font-bold">{BRANDING.product.poweredBy}</h2>
          <p className="mt-2 text-white/80">{brandTagline}</p>
          <div className="mt-5">
            <p className="text-sm text-white/70">Designed &amp; Developed by</p>
            <Link
              href={brandUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-bold text-white hover:underline"
            >
              {brandName}
            </Link>
          </div>
          <div className="mt-6">
            <Link href="/chat">
              <Button className="gap-2 bg-white text-primary hover:bg-white/90">
                <Sparkles className="size-4" /> Try the assistant
              </Button>
            </Link>
          </div>
        </Card>

        <div className="mt-10 flex justify-center">
          <BitsolBranding />
        </div>
      </section>

      <Footer />
    </main>
  );
}
