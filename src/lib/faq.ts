export const faqKeys = [
  "leadTime",
  "areas",
  "permits",
  "design",
  "materials",
  "maintenance",
  "pricing",
  "languages",
] as const;

export type FaqKey = (typeof faqKeys)[number];
