import type { NextConfig } from "next";

const contentSecurityPolicy = [
  "default-src 'self'",
  // Inline scripts: the pre-paint theme script and JSON-LD. Next.js also inlines its bootstrap.
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self' mailto:",
].join("; ");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: contentSecurityPolicy },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
        ],
      },
      {
        source: "/resume.pdf",
        headers: [{ key: "Cache-Control", value: "public, max-age=3600, must-revalidate" }],
      },
    ];
  },
  // Keep production builds on the stable React transform until Next's
  // build worker and the compiler plugin are verified together.
  reactCompiler: false,
  // Type safety is enforced by `npm run typecheck` in CI. This bypasses a
  // Next 16.2 build-worker crash observed after a successful standalone tsc run.
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
