"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Reveal, RevealGroup } from "@/components/Reveal";
import { Photo } from "@/components/Photo";
import { PortfolioLightbox } from "@/components/PortfolioLightbox";
import { serviceSlugs, serviceIndex, type ServiceSlug } from "@/lib/content";
import { portfolioProjects, ratioClass } from "@/lib/portfolio";

function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function PortfolioPage() {
  const t = useTranslations("Portfolio");
  const tServices = useTranslations("Services");
  const locale = useLocale();
  const [active, setActive] = useState<ServiceSlug | "All">("All");

  const dateFormatter = useMemo(
    () => new Intl.DateTimeFormat(locale, { year: "numeric", month: "long" }),
    [locale]
  );

  const filtered =
    active === "All"
      ? portfolioProjects
      : portfolioProjects.filter((p) => p.service === active);

  return (
    <>
      <section className="bg-indigo text-white">
        <div className="mx-auto max-w-[1400px] px-6 py-20 lg:px-10 lg:py-28">
          <p className="text-xs font-semibold tracking-[0.2em] text-acid uppercase">
            {t("kicker")}
          </p>
          <h1 className="mt-4 max-w-2xl font-display text-5xl font-semibold tracking-tight sm:text-6xl">
            {t("title")}
          </h1>
          <p className="mt-5 max-w-lg text-white/70">{t("subtitle")}</p>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 py-20 lg:px-10 lg:py-28">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActive("All")}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              active === "All"
                ? "border-ink bg-indigo text-white"
                : "border-ink/10 text-ink/65 hover:border-ink hover:text-ink"
            }`}
          >
            {t("filterAll")}
          </button>
          {serviceSlugs.map((slug) => (
            <button
              key={slug}
              type="button"
              onClick={() => setActive(slug)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                active === slug
                  ? "border-ink bg-indigo text-white"
                  : "border-ink/10 text-ink/65 hover:border-ink hover:text-ink"
              }`}
            >
              {tServices(`items.${slug}.title`)}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="mt-16 text-center text-ink/65">{t("emptyFilter")}</p>
        ) : (
          <RevealGroup className="mt-10 columns-1 gap-8 sm:columns-2 lg:columns-3">
            {filtered.map((project) => {
              const category = tServices(`items.${project.service}.title`);
              const title = titleFromSlug(project.slug);
              return (
                <div key={project.slug} className="mb-8 break-inside-avoid">
                  <div className="relative">
                    <Photo
                      src={project.photo}
                      alt={t("imageBrief", { category })}
                      ratio={ratioClass[project.ratio]}
                    />
                    <PortfolioLightbox
                      photos={project.photos}
                      title={title}
                      closeLabel={t("close")}
                    />
                  </div>
                  <div className="mt-4 flex items-baseline gap-3">
                    <span className="font-display text-sm font-semibold text-ink/65">
                      {serviceIndex[project.service]}
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-medium text-ink">{title}</h3>
                      <p className="text-sm text-ink/65">
                        {category} · {dateFormatter.format(new Date(project.date))}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </RevealGroup>
        )}
      </section>

      <section className="mx-auto max-w-[1400px] px-6 pb-24 lg:px-10 lg:pb-32">
        <Reveal className="flex flex-col items-start gap-6 rounded-3xl bg-indigo px-8 py-14 text-white sm:flex-row sm:items-center sm:justify-between sm:px-16">
          <div>
            <h2 className="max-w-md font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              {t("ctaTitle")}
            </h2>
            <p className="mt-3 max-w-md text-white/70">{t("ctaBody")}</p>
          </div>
          <Link
            href="/contact"
            className="shrink-0 rounded-full bg-acid px-8 py-4 text-sm font-semibold text-ink transition-transform hover:scale-[1.03]"
          >
            {t("ctaButton")}
          </Link>
        </Reveal>
      </section>
    </>
  );
}
