import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { generateReference } from "@/lib/utils";
import { logEvent, notifyTeam } from "@/lib/notify";
import { clientIp, conversationIdFor, created, failed, invalid, throttle } from "@/lib/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Support ticket creation — used by both businesses.
 *
 * Categories follow the brief: Technical Support, Billing, Sales, Complaint and
 * General Inquiry. Complaints are raised at HIGH priority automatically so they
 * surface at the top of the support queue.
 */
const bodySchema = z.object({
  department: z.enum(["MARKETING", "INSTITUTE"]),
  category: z.enum(["TECHNICAL", "BILLING", "SALES", "COMPLAINT", "GENERAL"]),
  name: z.string().min(2).max(120),
  phone: z.string().max(32).optional(),
  email: z.string().email().max(160).optional().or(z.literal("")),
  subject: z.string().min(3).max(160),
  description: z.string().min(5).max(4000),
  conversationRef: z.string().max(64).optional(),
});

export async function POST(req: NextRequest) {
  const limited = await throttle(req, "tickets", 6, 600);
  if (limited) return limited;

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return invalid();

  const data = parsed.data;
  const reference = generateReference("TKT", data.department);

  try {
    const ticket = await prisma.ticket.create({
      data: {
        reference,
        department: data.department,
        category: data.category,
        status: "OPEN",
        priority: data.category === "COMPLAINT" ? "HIGH" : "NORMAL",
        subject: data.subject,
        description: data.description,
        contactName: data.name,
        contactPhone: data.phone || null,
        contactEmail: data.email || null,
        conversationId: await conversationIdFor(data.conversationRef),
      },
      select: { id: true },
    });

    await notifyTeam({
      department: data.department,
      subject: `New ${data.category.toLowerCase()} ticket ${reference} — ${data.subject}`,
      body: [
        `Reference: ${reference}`,
        `Category: ${data.category}`,
        `From: ${data.name}`,
        data.phone ? `Phone: ${data.phone}` : null,
        data.email ? `Email: ${data.email}` : null,
        "",
        data.description,
      ]
        .filter(Boolean)
        .join("\n"),
      link: `/admin/support/tickets/${ticket.id}`,
    });

    await logEvent({
      action: "ticket.created",
      department: data.department,
      entity: "Ticket",
      entityId: ticket.id,
      message: `Ticket ${reference} raised from the assistant.`,
      ipAddress: clientIp(req),
      metadata: { reference, category: data.category },
    });

    return created(
      reference,
      `Your ticket **${reference}** has been created and sent to the right team. We'll get back to you${data.phone ? ` on ${data.phone}` : ""} as soon as possible.`
    );
  } catch (error) {
    console.error("[tickets] create failed:", error);
    return failed();
  }
}
