"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

function GlobeIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.7-3.8-9S9.5 5.6 12 3Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

export function LanguageSwitcher({
  className = "",
  variant = "dropdown",
  theme = "light",
  inlineTheme = "light",
}: {
  className?: string;
  variant?: "dropdown" | "inline";
  /** Trigger-button theme for the "dropdown" variant, e.g. on a dark navbar. */
  theme?: "light" | "dark";
  /** Text/hover theme for the "inline" variant, e.g. inside a dark mobile menu. */
  inlineTheme?: "light" | "dark";
}) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const t = useTranslations("Nav");
  const tLocales = useTranslations("Locales");

  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const switchTo = (code: string) => {
    router.replace(
      // @ts-expect-error -- dynamic pathname from usePathname, not a typed route
      { pathname, params },
      { locale: code }
    );
    setOpen(false);
  };

  if (variant === "inline") {
    const dark = inlineTheme === "dark";
    return (
      <div className={className}>
        <p
          className={`px-1 text-xs font-semibold tracking-wide uppercase ${dark ? "text-white/50" : "text-ink/65"}`}
        >
          {t("language")}
        </p>
        <div className="mt-2 flex flex-col gap-0.5">
          {routing.locales.map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => switchTo(code)}
              aria-current={locale === code ? "true" : undefined}
              className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                locale === code
                  ? dark
                    ? "bg-acid text-ink"
                    : "bg-indigo text-white"
                  : dark
                    ? "text-white hover:bg-white/10"
                    : "text-ink hover:bg-ink/7"
              }`}
            >
              {tLocales(code)}
              {locale === code && <span aria-hidden="true">✓</span>}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const dark = theme === "dark";

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("changeLanguage")}
        className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold tracking-wide transition-colors ${
          dark
            ? "border-white/25 text-white hover:border-white/60"
            : "border-ink/10 text-ink hover:border-ink"
        }`}
      >
        <GlobeIcon className={`size-3.5 ${dark ? "text-white/60" : "text-ink/65"}`} />
        {locale.toUpperCase()}
        <svg
          viewBox="0 0 12 12"
          className={`size-2.5 transition-transform ${dark ? "text-white/60" : "text-ink/65"} ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          <path d="M2.5 4.5 6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={t("language")}
          className="absolute right-0 top-full z-50 mt-2 w-40 overflow-hidden rounded-xl border border-ink/10 bg-white py-1 shadow-lg"
        >
          {routing.locales.map((code) => (
            <button
              key={code}
              type="button"
              role="option"
              aria-selected={locale === code}
              onClick={() => switchTo(code)}
              className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors ${
                locale === code
                  ? "bg-ink/8 font-semibold text-ink"
                  : "text-ink hover:bg-ink/6"
              }`}
            >
              {tLocales(code)}
              {locale === code && <span aria-hidden="true">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
