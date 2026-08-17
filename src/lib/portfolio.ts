import type { ServiceSlug } from "./content";

/**
 * Shared portfolio types and constants. Deliberately free of Node APIs so
 * client components can import it — the filesystem loader lives in
 * `portfolio.server.ts`.
 */

export const portfolioIndustries = [
  "retail",
  "hospitality",
  "restaurants",
  "corporate",
  "healthcare",
  "automotive",
  "property",
  "education",
  "leisure",
] as const;

export type PortfolioIndustry = (typeof portfolioIndustries)[number];

export type PortfolioProject = {
  /** Filename without extension — also the photo folder name. */
  slug: string;
  title: string;
  client: string;
  service: ServiceSlug;
  industry: PortfolioIndustry;
  /** ISO date — drives ordering and the freshness signal for SEO. */
  date: string;
  /** Controls the masonry rhythm — tall/wide/square proportions. */
  ratio: "portrait" | "square" | "landscape";
  summary?: string;
  /** Cover image shown in grids. */
  photo: string;
  /** Full set for the project, cover first — powers the lightbox. */
  photos: string[];
};

export const ratioClass: Record<PortfolioProject["ratio"], string> = {
  portrait: "aspect-[3/4]",
  square: "aspect-square",
  landscape: "aspect-[4/3]",
};
