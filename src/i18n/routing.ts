import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "el", "ru"],
  defaultLocale: "en",
  localePrefix: "as-needed",
});

export const localeLabels: Record<(typeof routing.locales)[number], string> = {
  en: "EN",
  el: "EL",
  ru: "RU",
};
