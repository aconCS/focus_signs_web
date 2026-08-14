import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { siteUrl } from "@/lib/site";
import { industrySlugs } from "@/lib/industries";

/** Indexable pages only. */
const routes = [
  { path: "", priority: 1, changeFrequency: "weekly" as const },
  { path: "/services", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/portfolio", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/about", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/contact", priority: 0.7, changeFrequency: "yearly" as const },
  { path: "/industries", priority: 0.7, changeFrequency: "monthly" as const },
  ...industrySlugs.map((slug) => ({
    path: `/industries/${slug}`,
    priority: 0.6,
    changeFrequency: "monthly" as const,
  })),
];

function urlFor(locale: string, path: string) {
  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
  return `${siteUrl}${prefix}${path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map(({ path, priority, changeFrequency }) => ({
    url: urlFor(routing.defaultLocale, path),
    lastModified: new Date(),
    changeFrequency,
    priority,
    alternates: {
      languages: Object.fromEntries([
        ...routing.locales.map((locale) => [locale, urlFor(locale, path)]),
        ["x-default", urlFor(routing.defaultLocale, path)],
      ]),
    },
  }));
}
