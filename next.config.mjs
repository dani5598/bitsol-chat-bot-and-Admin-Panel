/**
 * Shared hosting gives the build very little memory. Next parallelises page
 * generation across one worker per CPU, and each worker holds its own copy of
 * the compiler — which is what gets a build OOM-killed on a Hostinger Business
 * plan. A killed worker is not reported as "out of memory": Next falls back to
 * the pages-router error document and fails with "<Html> should not be imported
 * outside of pages/_document" while prerendering /404, which sends you looking
 * for an import that does not exist.
 *
 * Set LOW_MEMORY_BUILD=1 on such a host to serialise the build instead. It is
 * slower and it is not the default, because CI and VPS builds should stay fast.
 */
const lowMemory = /^(1|true|yes)$/i.test(process.env.LOW_MEMORY_BUILD ?? "");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Standalone output produces a lean, self-contained server for Docker.
  output: "standalone",
  poweredByHeader: false,
  ...(lowMemory
    ? {
        experimental: {
          // One page-generation worker, in-process, instead of one per core.
          cpus: 1,
          workerThreads: false,
        },
      }
    : {}),
  // Keep server-only packages out of the client/edge bundle (Next 15 top-level key).
  serverExternalPackages: ["@prisma/client", "@anthropic-ai/sdk", "ioredis"],
  async rewrites() {
    return [
      // The WhatsApp callback URL registered with Meta is the short, public
      // `/webhook` — but the handler lives with the other route handlers under
      // `/api/whatsapp/webhook`. A rewrite serves both without duplicating it,
      // and without a redirect: Meta does not follow 3xx on webhook delivery,
      // so the callback path has to answer 200 itself.
      { source: "/webhook", destination: "/api/whatsapp/webhook" },
    ];
  },
  async headers() {
    // Baseline security headers. Nginx may add/override in production.
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(self), geolocation=(self)" },
        ],
      },
    ];
  },
};

export default nextConfig;
