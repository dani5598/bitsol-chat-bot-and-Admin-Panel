import { NextRequest } from "next/server";
import { asDepartment } from "@/lib/brands";
import { searchKnowledge } from "@/lib/ai";

export const runtime = "nodejs";

/**
 * Natural-language knowledge search, scoped to one department.
 *
 *   GET /api/search?department=INSTITUTE&q=fees kitni hain
 *
 * Powers the "Knowledge Search" feature and the admin console's content lookup.
 * Results are always drawn from a single department's knowledge base.
 */
export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const department = asDepartment(params.get("department"));
  const query = params.get("q")?.trim() ?? "";

  if (!department) {
    return Response.json(
      { error: "A valid `department` (MARKETING or INSTITUTE) is required." },
      { status: 400 }
    );
  }
  if (query.length < 2) {
    return Response.json({ department, query, count: 0, results: [] });
  }

  const limit = Math.min(Number(params.get("limit") ?? 10) || 10, 25);
  const results = searchKnowledge(department, query, limit).map((entry) => ({
    id: entry.id,
    category: entry.category,
    kind: entry.kind,
    question: entry.question,
    answer: entry.answer,
  }));

  return Response.json({ department, query, count: results.length, results });
}
