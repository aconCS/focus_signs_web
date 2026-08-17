import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import type { ServiceSlug } from "./content";
import type { PortfolioIndustry, PortfolioProject } from "./portfolio";

/**
 * Reads the portfolio out of `content/projects/*.json`, which TinaCMS writes.
 *
 * Server-only — importing this from a client component pulls `node:fs` into the
 * browser bundle and fails the build. Client components take the data as props
 * and import types from `./portfolio` instead.
 */

const contentDir = path.join(process.cwd(), "content", "projects");

function isRatio(value: unknown): value is PortfolioProject["ratio"] {
  return value === "portrait" || value === "square" || value === "landscape";
}

/**
 * Entries without photos are skipped rather than rendered as a broken card: a
 * project created in the CMS is saved before its images finish uploading, and
 * that half-saved state should not reach the site.
 *
 * `cache` keeps this to one read per request even though several sections ask
 * for the data independently.
 */
export const getPortfolioProjects = cache((): PortfolioProject[] => {
  if (!fs.existsSync(contentDir)) return [];

  const projects: PortfolioProject[] = [];

  for (const file of fs.readdirSync(contentDir)) {
    if (!file.endsWith(".json")) continue;

    const slug = file.replace(/\.json$/, "");
    const raw = JSON.parse(
      fs.readFileSync(path.join(contentDir, file), "utf8")
    ) as Partial<PortfolioProject>;

    const photos = (raw.photos ?? []).filter(Boolean);
    if (photos.length === 0 || !raw.service) continue;

    projects.push({
      slug,
      title: raw.title ?? slug,
      client: raw.client ?? raw.title ?? slug,
      service: raw.service,
      industry: raw.industry ?? "corporate",
      date: raw.date ?? "",
      ratio: isRatio(raw.ratio) ? raw.ratio : "square",
      summary: raw.summary,
      photo: photos[0],
      photos,
    });
  }

  return projects.sort((a, b) => (a.date < b.date ? 1 : -1));
});

/** Cover shot per service, taken from the newest project in that service. */
export const getServiceCovers = cache((): Partial<Record<ServiceSlug, string>> => {
  const covers: Partial<Record<ServiceSlug, string>> = {};
  for (const project of getPortfolioProjects()) {
    covers[project.service] ??= project.photo;
  }
  return covers;
});

/** Cover shot per industry, taken from the newest project in that industry. */
export const getIndustryCovers = cache(
  (): Partial<Record<PortfolioIndustry, string>> => {
    const covers: Partial<Record<PortfolioIndustry, string>> = {};
    for (const project of getPortfolioProjects()) {
      covers[project.industry] ??= project.photo;
    }
    return covers;
  }
);
