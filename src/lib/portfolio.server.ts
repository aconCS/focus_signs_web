import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import type { ServiceSlug } from "./content";
import type { PortfolioIndustry, PortfolioProject } from "./portfolio";

/**
 * Reads the portfolio out of `content/projects/*.json`, which Decap CMS
 * writes (see public/admin/config.yml).
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
 * Decap's image-list widget stores each entry as `{ image: "path" }`, while
 * the sync script and hand-written entries use plain strings. Both are valid
 * on disk, so normalize here rather than picking one and breaking the other.
 */
function normalizePhotos(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((entry) =>
      typeof entry === "string"
        ? entry
        : typeof entry === "object" && entry && "image" in entry
          ? String((entry as { image?: unknown }).image ?? "")
          : ""
    )
    .filter(Boolean);
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

    const photos = normalizePhotos(raw.photos);
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

/**
 * Every cover photo for a service, newest first. There is no per-subcategory
 * tag in the content model, so the services page cycles through these to give
 * each subcategory card a distinct-looking photo rather than repeating one
 * cover across the whole row.
 */
export const getServicePhotos = cache((): Record<ServiceSlug, string[]> => {
  const photos: Record<ServiceSlug, string[]> = {
    signage: [],
    "vehicle-graphics": [],
    "print-vinyl": [],
    "engraving-cutting": [],
    "building-cladding": [],
    "promotional-events": [],
    "maintenance-repair": [],
  };
  for (const project of getPortfolioProjects()) {
    photos[project.service].push(project.photo);
  }
  return photos;
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
