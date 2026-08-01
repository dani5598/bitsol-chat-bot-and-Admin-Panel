import { NextRequest } from "next/server";
import { asDepartment } from "@/lib/brands";
import { departmentCatalogue, findCourse, findService } from "@/data";

export const runtime = "nodejs";

/**
 * Public catalogue endpoint.
 *
 *   GET /api/catalog?department=MARKETING              → all services
 *   GET /api/catalog?department=INSTITUTE              → all courses
 *   GET /api/catalog?department=INSTITUTE&slug=seo     → one course
 *
 * `department` is mandatory: there is no unscoped catalogue, so a Marketing
 * client can never enumerate Institute courses through this route.
 */
export async function GET(req: NextRequest) {
  const department = asDepartment(req.nextUrl.searchParams.get("department"));
  if (!department) {
    return Response.json(
      { error: "A valid `department` (MARKETING or INSTITUTE) is required." },
      { status: 400 }
    );
  }

  const slug = req.nextUrl.searchParams.get("slug");

  if (slug) {
    const item =
      department === "MARKETING" ? findService(slug) : findCourse(slug);
    if (!item) {
      return Response.json({ error: "Not found." }, { status: 404 });
    }
    return Response.json({ department, item });
  }

  const items = departmentCatalogue(department);
  return Response.json({ department, count: items.length, items });
}
