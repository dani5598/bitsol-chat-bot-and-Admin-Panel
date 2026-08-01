import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, canAccessAdmin, verifySession, type SessionPayload } from "./auth";

/**
 * Server-side session helpers for App Router server components and route
 * handlers. `cookies()` is async in Next 15, so all of these are too.
 */

/** Read and verify the current session, or null when signed out/invalid. */
export async function getSession(): Promise<SessionPayload | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySession(token);
}

/**
 * Require an admin-console session. Redirects to the sign-in page with a
 * `next` parameter so the user lands back where they were heading.
 */
export async function requireAdmin(next = "/admin"): Promise<SessionPayload> {
  const session = await getSession();
  if (!canAccessAdmin(session)) {
    redirect(`/login?next=${encodeURIComponent(next)}`);
  }
  return session as SessionPayload;
}
