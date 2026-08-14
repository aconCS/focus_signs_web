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

export const industryPhotos: Record<IndustrySlug, string> = {
  retail: "/photos/papantoniou-led.jpg",
  hospitality: "/photos/cafeme-led.jpg",
  restaurants: "/photos/pouttogiros.jpg",
  corporate: "/photos/andria.jpg",
  healthcare: "/photos/fiesta.jpg",
};
