import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { newsletterActionHeaders } from "./src/config/newsletterHttp";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'self'; object-src 'none'; base-uri 'self'" },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store" },
          { key: "Referrer-Policy", value: "no-referrer" },
        ],
      },
      ...["/api/newsletter/confirm", "/api/newsletter/unsubscribe"].map(source => ({
        source,
        headers: Object.entries(newsletterActionHeaders).map(([key, value]) => ({ key, value })),
      })),
    ];
  },
};

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

export default withNextIntl(nextConfig);
