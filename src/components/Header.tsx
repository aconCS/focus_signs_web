"use client";

import { useState, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { navLinks } from "@/lib/content";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { LogoLockup } from "./LogoLockup";

/* Subscribing to scroll rather than reading it in an effect keeps the very
   first client render correct — including on a reload part-way down a page. */
function subscribeScroll(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}
const hasScrolled = () => window.scrollY > 8;

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations("Nav");

  const scrolled = useSyncExternalStore(subscribeScroll, hasScrolled, () => false);

  /* Only the home page has a dark full-bleed hero for the nav to sit on.
     Everywhere else the background is white, so white nav text needs the
     solid bar from the start. */
  const overHero = pathname === "/" && !scrolled && !open;

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        overHero
          ? "border-b border-transparent bg-transparent"
          : "border-b border-white/10 bg-indigo/95 backdrop-blur"
      }`}
    >
      <div className="shell flex h-[4.5rem] items-center justify-between py-3">
        <Link href="/" className="flex items-center" onClick={() => setOpen(false)}>
          <span className="sr-only">Focus Signs</span>
          <LogoLockup className="h-6 sm:h-7" />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {navLinks.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium tracking-wide uppercase transition-colors ${
                  active ? "text-white" : "text-white/60 hover:text-white"
                }`}
              >
                {t(item.key)}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher theme="dark" className="hidden sm:flex" />
          <Link
            href="/contact"
            className="hidden rounded-full bg-acid px-5 py-2.5 text-sm font-semibold text-ink transition-transform hover:scale-[1.03] sm:inline-block"
          >
            {t("requestQuote")}
          </Link>
          <button
            type="button"
            className="flex size-10 items-center justify-center lg:hidden"
            aria-label={open ? t("closeMenu") : t("openMenu")}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <span className="relative block size-5">
              <span
                className={`absolute left-0 top-1.5 block h-0.5 w-5 bg-white transition-transform ${open ? "translate-y-1.5 rotate-45" : ""}`}
              />
              <span
                className={`absolute left-0 top-3.5 block h-0.5 w-5 bg-white transition-opacity ${open ? "opacity-0" : ""}`}
              />
              <span
                className={`absolute left-0 top-[1.375rem] block h-0.5 w-5 bg-white transition-transform ${open ? "-translate-y-1.5 -rotate-45" : ""}`}
              />
            </span>
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-indigo px-6 pb-6 lg:hidden">
          <nav className="flex flex-col gap-1 pt-4" aria-label="Mobile">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-base font-medium text-white hover:bg-white/10"
              >
                {t(item.key)}
              </Link>
            ))}
          </nav>
          <LanguageSwitcher
            variant="inline"
            inlineTheme="dark"
            className="mt-4 border-t border-white/10 pt-4"
          />
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="mt-3 block rounded-full bg-acid px-5 py-3 text-center text-sm font-semibold text-ink"
          >
            {t("requestQuote")}
          </Link>
        </div>
      )}
    </header>
  );
}
