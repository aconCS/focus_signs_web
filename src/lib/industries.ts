import type { ServiceSlug } from "./content";

export type IndustrySlug = "retail" | "hospitality" | "restaurants" | "corporate" | "healthcare";

export const industrySlugs: IndustrySlug[] = [
  "retail",
  "hospitality",
  "restaurants",
  "corporate",
  "healthcare",
];

export const industryServices: Record<IndustrySlug, ServiceSlug[]> = {
  retail: ["signage", "print-vinyl", "building-cladding"],
  hospitality: ["signage", "building-cladding", "promotional-events"],
  restaurants: ["signage", "print-vinyl", "vehicle-graphics"],
  corporate: ["signage", "engraving-cutting", "promotional-events"],
  healthcare: ["signage", "engraving-cutting", "print-vinyl"],
};

/* Industry cover images are derived from published work — see
   `getIndustryCovers()` in lib/portfolio.ts. */
