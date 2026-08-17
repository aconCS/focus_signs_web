import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // Next's public-folder serving is exact-path only — it won't resolve
      // /admin to /admin/index.html the way a static host normally would.
      { source: "/admin", destination: "/admin/index.html" },
    ];
  },
};

export default withNextIntl(nextConfig);
