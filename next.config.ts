import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // Next's public-folder serving is exact-path only — it won't resolve
      // /admin to /admin/index.html the way a static host normally would.
      { source: "/admin", destination: "/admin/index.html" },
      // Decap fetches config.yml next to index.html; this makes that request
      // hit the route that fills in base_url from the real request origin
      // instead of a static file with a hardcoded domain.
      { source: "/admin/config.yml", destination: "/api/admin-config" },
    ];
  },
};

export default withNextIntl(nextConfig);
