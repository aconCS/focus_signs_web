import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LogoLockup } from "./LogoLockup";
import { navLinks, companyInfo } from "@/lib/content";
import { industrySlugs } from "@/lib/industries";

export function Footer() {
  const t = useTranslations("Footer");
  const tNav = useTranslations("Nav");
  const tHours = useTranslations("Hours");
  const tIndustries = useTranslations("Industries");

  const hours = [
    { days: tHours("weekdays"), time: tHours("weekdaysTime") },
    { days: tHours("saturday"), time: tHours("saturdayTime") },
    { days: tHours("sunday"), time: tHours("sundayTime") },
  ];

  return (
    <footer className="border-t border-white/10 bg-indigo text-white">
      <div className="shell grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1fr_1fr] lg:py-20">
        <div>
          <LogoLockup className="h-8 w-auto" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
            {t("tagline")}
          </p>
        </div>

        <div>
          <h3 className="text-xs font-semibold tracking-[0.15em] text-acid uppercase">
            {t("site")}
          </h3>
          <ul className="mt-4 space-y-2.5">
            {navLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-sm text-white/70 hover:text-white">
                  {tNav(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold tracking-[0.15em] text-acid uppercase">
            {tIndustries("hubKicker")}
          </h3>
          <ul className="mt-4 space-y-2.5">
            {industrySlugs.map((slug) => (
              <li key={slug}>
                <Link
                  href={`/industries/${slug}`}
                  className="text-sm text-white/70 hover:text-white"
                >
                  {tIndustries(`items.${slug}.title`)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold tracking-[0.15em] text-acid uppercase">
            {t("hoursTitle")}
          </h3>
          <ul className="mt-4 space-y-2.5">
            {hours.map((h) => (
              <li key={h.days} className="text-sm text-white/70">
                <span className="text-white/90">{h.days}</span> — {h.time}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold tracking-[0.15em] text-acid uppercase">
            {t("contactTitle")}
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm text-white/70">
            <li>{companyInfo.address}</li>
            <li>
              <a href={`mailto:${companyInfo.email}`} className="hover:text-white">
                {companyInfo.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-6">
        <p className="shell text-xs text-white/60">
          {t("rights", { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  );
}
