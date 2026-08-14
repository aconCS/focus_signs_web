export const navLinks = [
  { href: "/about", key: "about" },
  { href: "/services", key: "services" },
  { href: "/portfolio", key: "portfolio" },
  { href: "/industries", key: "industries" },
] as const;

export const serviceSlugs = [
  "signs-and-installation",
  "digital-printing",
  "vehicle-graphics",
  "engraving-and-cutting",
  "building-cladding",
  "advertising-and-events",
] as const;

export type ServiceSlug = (typeof serviceSlugs)[number];

export const serviceIndex: Record<ServiceSlug, string> = {
  "signs-and-installation": "01",
  "digital-printing": "02",
  "vehicle-graphics": "03",
  "engraving-and-cutting": "04",
  "building-cladding": "05",
  "advertising-and-events": "06",
};

export const companyInfo = {
  name: "Focus Signs",
  city: "Paphos, Cyprus",
  address: "Akropoleos 31, Emba, Paphos, Cyprus",
  email: "focus.signs.cs@gmail.com",
};
