#!/usr/bin/env node
/**
 * Production build wrapper.
 *
 * `next build` on its own is fine on a developer machine and unreliable on
 * shared hosting, for two reasons this script removes:
 *
 *  1. **A stale `.next`.** Hostinger and similar hosts redeploy into the same
 *     directory, so a previous half-finished build leaves chunks behind. Next
 *     reuses them, and a mismatched chunk surfaces during page generation as
 *     "<Html> should not be imported outside of pages/_document" — an error
 *     about an import this project does not contain, which sends you looking
 *     in entirely the wrong place. A clean build costs a minute and removes
 *     the whole class of failure.
 *
 *  2. **A non-standard `NODE_ENV`.** Panels commonly set `prod`, `PRODUCTION`
 *     or leave it empty. Next warns that this "creates inconsistencies" and
 *     then behaves differently in ways that are hard to attribute. A release
 *     build is by definition a production build, so this pins it.
 *
 * Kept dependency-free (no `cross-env`, no `rimraf`) so it cannot itself fail
 * to install on a constrained host — the one place it needs to work.
 */
import { spawnSync } from "node:child_process";
import { rmSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");

const previous = process.env.NODE_ENV;
if (previous !== "production") {
  console.log(
    `[build] NODE_ENV was ${previous ? `"${previous}"` : "unset"} — pinning it to "production".`
  );
}
process.env.NODE_ENV = "production";

for (const dir of [".next/cache", ".next"]) {
  try {
    rmSync(resolve(root, dir), { recursive: true, force: true });
  } catch (error) {
    // Non-fatal: a read-only or already-absent directory should not stop a
    // build. If a stale chunk really is the problem, next build reports it.
    console.warn(`[build] could not remove ${dir}:`, error?.message ?? error);
  }
}
console.log("[build] cleaned .next — starting a fresh production build.");

const result = spawnSync("next", ["build"], {
  cwd: root,
  stdio: "inherit",
  env: process.env,
  // Resolves `next` from node_modules/.bin on both Windows (.cmd) and Linux.
  shell: true,
});

if (result.error) {
  console.error("[build] failed to start next:", result.error.message);
  process.exit(1);
}
process.exit(result.status ?? 1);
