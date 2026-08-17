import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // Next's public-folder serving is exact-path only — it won't resolve
      // /admin to /admin/index.html the way a static host normally would.
      { source: "/admin", destination: "/admin/index.html" },
      // Decap is told the config location explicitly (see the <link
      // rel="cms-config-url"> tag in admin/index.html) rather than left to
      // resolve "config.yml" as a relative URL — with no trailing slash on
      // /admin, that resolves to /config.yml, not /admin/config.yml. This
      // rewrite is what that explicit link actually points at, sending the
      // request to the route that fills in base_url from the real request
      // origin instead of a static file with a hardcoded domain.
      { source: "/admin/config.yml", destination: "/api/admin-config" },
    ];
  },
};

export default withNextIntl(nextConfig);
