/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Standalone output produces a lean, self-contained server for Docker.
  output: "standalone",
  poweredByHeader: false,
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
