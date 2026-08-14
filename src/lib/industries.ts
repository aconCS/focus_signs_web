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
  retail: ["signs-and-installation", "digital-printing", "building-cladding"],
  hospitality: ["signs-and-installation", "building-cladding", "advertising-and-events"],
  restaurants: ["signs-and-installation", "digital-printing", "vehicle-graphics"],
  corporate: ["signs-and-installation", "engraving-and-cutting", "advertising-and-events"],
  healthcare: ["signs-and-installation", "engraving-and-cutting", "digital-printing"],
};

export const industryPhotos: Record<IndustrySlug, string> = {
  retail: "/photos/papantoniou-led.jpg",
  hospitality: "/photos/cafeme-led.jpg",
  restaurants: "/photos/pouttogiros.jpg",
  corporate: "/photos/andria.jpg",
  healthcare: "/photos/fiesta.jpg",
};
