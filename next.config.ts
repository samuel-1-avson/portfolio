import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{
      source: "/(.*)",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "X-Frame-Options", value: "SAMEORIGIN" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
        { key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self'; frame-src 'self'; frame-ancestors 'self'; base-uri 'self'; form-action 'self' mailto:" },
      ],
    }];
  },
  // Keep production builds on the stable React transform until Next's
  // build worker and the compiler plugin are verified together.
  reactCompiler: false,
  // Type safety remains enforced by `npm run typecheck` and CI. This bypasses
  // a Next 16.2.10 build-worker crash after a successful standalone tsc run.
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
