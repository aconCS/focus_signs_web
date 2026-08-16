export const navLinks = [
  { href: "/about", key: "about" },
  { href: "/services", key: "services" },
  { href: "/portfolio", key: "portfolio" },
  { href: "/industries", key: "industries" },
] as const;

/**
 * Seven categories, ordered as they appear on the services page.
 *
 * Each one names what the thing IS, so nothing belongs in two categories.
 * Interior/exterior, material and industry are cross-cutting and live as
 * filters and tags rather than as competing top-level categories.
 */
export const serviceSlugs = [
  "signage",
  "vehicle-graphics",
  "print-vinyl",
  "engraving-cutting",
  "building-cladding",
  "promotional-events",
  "maintenance-repair",
] as const;

export type ServiceSlug = (typeof serviceSlugs)[number];

export const serviceIndex: Record<ServiceSlug, string> = {
  signage: "01",
  "vehicle-graphics": "02",
  "print-vinyl": "03",
  "engraving-cutting": "04",
  "building-cladding": "05",
  "promotional-events": "06",
  "maintenance-repair": "07",
};

/**
 * Explicit rather than derived from the portfolio, so every category has an
 * image even when no project has been published under it yet.
 */
export const servicePhotos: Record<ServiceSlug, string> = {
  signage: "/photos/papantoniou-led.jpg",
  "vehicle-graphics": "/photos/van.jpg",
  "print-vinyl": "/photos/pouttogiros.jpg",
  "engraving-cutting": "/photos/work.jpg",
  "building-cladding": "/photos/anemi.jpg",
  "promotional-events": "/photos/bus.jpg",
  "maintenance-repair": "/photos/cafeme-led.jpg",
};

export const companyInfo = {
  name: "Focus Signs",
  city: "Paphos, Cyprus",
  address: "Akropoleos 31, Emba, Paphos, Cyprus",
  email: "focus.signs.cs@gmail.com",
  /**
   * Short link to the Google Business listing. Not rendered anywhere at the
   * moment — kept because it is the verified listing URL, and it is the right
   * href if the address is ever made clickable.
   */
  mapsUrl: "https://maps.app.goo.gl/h7rP8J2FXSa5VaZ49",
  /**
   * Name plus address for the embedded map, so the pin lands on the business
   * listing rather than wherever the street address alone geocodes to.
   */
  mapsQuery: "Focus Signs & Printing, Akropoleos 31, Emba, Paphos, Cyprus",
};
