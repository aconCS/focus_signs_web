import type { ServiceSlug } from "./content";

export type PortfolioProject = {
  slug: string;
  service: ServiceSlug;
  /** ISO date — drives both display and freshness signal for SEO. */
  date: string;
  /** Controls the masonry rhythm — tall/wide/square placeholder proportions. */
  ratio: "portrait" | "square" | "landscape";
  photo: string;
};

export const portfolioProjects: PortfolioProject[] = [
  { slug: "project-01", service: "signs-and-installation", date: "2026-06-12", ratio: "portrait", photo: "/photos/papantoniou-led.jpg" },
  { slug: "project-02", service: "vehicle-graphics", date: "2026-05-28", ratio: "landscape", photo: "/photos/van.jpg" },
  { slug: "project-03", service: "building-cladding", date: "2026-05-02", ratio: "square", photo: "/photos/anemi.jpg" },
  { slug: "project-04", service: "digital-printing", date: "2026-04-19", ratio: "portrait", photo: "/photos/pouttogiros.jpg" },
  { slug: "project-05", service: "advertising-and-events", date: "2026-03-30", ratio: "landscape", photo: "/photos/bus.jpg" },
  { slug: "project-06", service: "engraving-and-cutting", date: "2026-03-11", ratio: "square", photo: "/photos/work.jpg" },
];

export const ratioClass: Record<PortfolioProject["ratio"], string> = {
  portrait: "aspect-[3/4]",
  square: "aspect-square",
  landscape: "aspect-[4/3]",
};
