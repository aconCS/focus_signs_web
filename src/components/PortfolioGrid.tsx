"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { RevealGroup } from "@/components/Reveal";
import { Photo } from "@/components/Photo";
import { PortfolioLightbox } from "@/components/PortfolioLightbox";
import { serviceSlugs, serviceIndex, type ServiceSlug } from "@/lib/content";
import {
  ratioClass,
  type PortfolioIndustry,
  type PortfolioProject,
} from "@/lib/portfolio";

const chipClass = (activeChip: boolean) =>
  `rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
    activeChip
      ? "border-ink bg-indigo text-white"
      : "border-ink/10 text-ink/65 hover:border-ink hover:text-ink"
  }`;

export function PortfolioGrid({ projects }: { projects: PortfolioProject[] }) {
  const t = useTranslations("Portfolio");
  const tServices = useTranslations("Services");
  const locale = useLocale();

  const [service, setService] = useState<ServiceSlug | "all">("all");
  const [industry, setIndustry] = useState<PortfolioIndustry | "all">("all");
  const [query, setQuery] = useState("");

  const dateFormatter = useMemo(
    () => new Intl.DateTimeFormat(locale, { year: "numeric", month: "long" }),
    [locale]
  );

  /* Only offer filters that actually match something, so the client never
     lands on an empty grid by picking a category with no work in it. */
  const usedServices = useMemo(
    () => serviceSlugs.filter((slug) => projects.some((p) => p.service === slug)),
    [projects]
  );
  const usedIndustries = useMemo(() => {
    const seen = new Set(projects.map((p) => p.industry));
    return [...seen].sort();
  }, [projects]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return projects.filter((p) => {
      if (service !== "all" && p.service !== service) return false;
      if (industry !== "all" && p.industry !== industry) return false;
      if (needle && !`${p.title} ${p.client}`.toLowerCase().includes(needle)) {
        return false;
      }
      return true;
    });
  }, [projects, service, industry, query]);

  return (
    <>
      <div className="flex flex-col gap-5">
        <div>
          <p className="mb-3 text-xs font-semibold tracking-[0.15em] text-ink/50 uppercase">
            {t("byService")}
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setService("all")}
              className={chipClass(service === "all")}
            >
              {t("filterAll")}
            </button>
            {usedServices.map((slug) => (
              <button
                key={slug}
                type="button"
                onClick={() => setService(slug)}
                className={chipClass(service === slug)}
              >
                {tServices(`items.${slug}.title`)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold tracking-[0.15em] text-ink/50 uppercase">
            {t("byIndustry")}
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setIndustry("all")}
              className={chipClass(industry === "all")}
            >
              {t("filterAll")}
            </button>
            {usedIndustries.map((slug) => (
              <button
                key={slug}
                type="button"
                onClick={() => setIndustry(slug)}
                className={chipClass(industry === slug)}
              >
                {t(`industries.${slug}`)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("searchPlaceholder")}
            aria-label={t("searchPlaceholder")}
            className="w-full max-w-sm rounded-full border border-ink/15 px-5 py-2.5 text-sm text-ink outline-none placeholder:text-ink/40 focus:border-indigo"
          />
          <p className="text-sm text-ink/50">
            {t("resultCount", { count: filtered.length })}
          </p>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-16 text-center text-ink/65">{t("emptyFilter")}</p>
      ) : (
        <RevealGroup className="mt-10 columns-1 gap-8 sm:columns-2 lg:columns-3">
          {filtered.map((project) => {
            const category = tServices(`items.${project.service}.title`);
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
                    title={project.title}
                    closeLabel={t("close")}
                  />
                </div>
                <div className="mt-4 flex items-baseline gap-3">
                  <span className="font-display text-sm font-semibold text-ink/65">
                    {serviceIndex[project.service]}
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-medium text-ink">
                      {project.title}
                    </h3>
                    <p className="text-sm text-ink/65">
                      {category}
                      {project.date &&
                        ` · ${dateFormatter.format(new Date(project.date))}`}
                    </p>
                    {project.summary && (
                      <p className="mt-1 text-sm text-ink/50">{project.summary}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </RevealGroup>
      )}
    </>
  );
}
