import { SESSION_COOKIE } from "@/lib/auth";
import { config } from "@/lib/config";

export const runtime = "nodejs";

/** Clear the session cookie. Safe to call when already signed out. */
export async function POST() {
  const res = Response.json({ ok: true });
  const parts = [
    `${SESSION_COOKIE}=`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    "Max-Age=0",
  ];
  if (config.isProd) parts.push("Secure");
  res.headers.append("Set-Cookie", parts.join("; "));
  return res;
}
