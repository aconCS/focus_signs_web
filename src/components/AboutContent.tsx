"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Reveal, RevealGroup } from "@/components/Reveal";
import { Photo } from "@/components/Photo";
import { AboutReveal } from "@/components/AboutReveal";
import { ClientLogos } from "@/components/ClientLogos";
import { faqKeys } from "@/lib/faq";
import type { PortfolioProject } from "@/lib/portfolio";

const statKeys = ["statYearsValue", "statLinesValue", "statLangValue"] as const;
const statLabelKeys = ["statYearsLabel", "statLinesLabel", "statLangLabel"] as const;
const processKeys = ["brief", "survey", "design", "fabrication", "install"] as const;
const capabilityKeys = ["printing", "laser", "cnc", "fabrication", "electrical", "installation"] as const;
const valueKeys = ["inHouse", "weather", "quotes", "multilingual", "archive", "onePoint"] as const;

const capabilityIcons: Record<(typeof capabilityKeys)[number], string> = {
  printing: "M6 8h12M6 8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2M6 8v9a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8m-8 4h4",
  laser: "M12 3v3m0 12v3m9-9h-3M6 12H3m14.5-6.5-2.1 2.1M8.6 15.4l-2.1 2.1m11 0-2.1-2.1M8.6 8.6 6.5 6.5M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z",
  cnc: "M10.3 4.3c.4-1.7 2.9-1.7 3.3 0a1.7 1.7 0 0 0 2.6 1.1c1.5-.9 3.3.8 2.4 2.4a1.7 1.7 0 0 0 1 2.6c1.8.4 1.8 2.9 0 3.3a1.7 1.7 0 0 0-1 2.6c.9 1.5-.8 3.3-2.4 2.4a1.7 1.7 0 0 0-2.6 1c-.4 1.8-2.9 1.8-3.3 0a1.7 1.7 0 0 0-2.6-1c-1.5.9-3.3-.8-2.4-2.4a1.7 1.7 0 0 0-1-2.6c-1.8-.4-1.8-2.9 0-3.3a1.7 1.7 0 0 0 1-2.6c-.9-1.5.8-3.3 2.4-2.4.9.6 2.2.1 2.6-1Z",
  fabrication: "m14.7 6.3 3 3L7.4 19.6H4.4v-3L14.7 6.3Zm0 0 3-3 3 3-3 3",
  electrical: "M13 3 4 14h6l-1 7 9-11h-6l1-7Z",
  installation: "M9 12.75 11.25 15 15 9.75M12 3l8 4v5c0 4.5-3.4 8.4-8 9.5-4.6-1.1-8-5-8-9.5V7l8-4Z",
};

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-ink/10 py-5">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-start justify-between gap-4 text-left"
      >
        <span className="font-display text-base font-medium text-ink sm:text-lg">
          {question}
        </span>
        <span
          className={`mt-1 shrink-0 text-xl text-ink/65 transition-transform ${open ? "rotate-45" : ""}`}
          aria-hidden="true"
        >
          +
        </span>
      </button>
      {open && (
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/65">{answer}</p>
      )}
    </div>
  );
}

export default function AboutContent({
  projects,
}: {
  projects: PortfolioProject[];
}) {
  const t = useTranslations("About");
  const tHome = useTranslations("Home");
  const tServices = useTranslations("Services");
  const tPortfolio = useTranslations("Portfolio");

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqKeys.map((key) => ({
      "@type": "Question",
      name: t(`faq.${key}.q`),
      acceptedAnswer: {
        "@type": "Answer",
        text: t(`faq.${key}.a`),
      },
    })),
  };

  const featuredProjects = projects.slice(0, 3);

  /* Drawn from published work rather than fixed files, so these keep working
     as projects are added and removed through the CMS. */
  const gallery = projects.slice(0, 4).map((project) => project.photo);
  const workshopPhotos = [
    { src: gallery[0] ?? "", alt: t("imageBrief"), span: "sm:col-span-2 sm:row-span-2" },
    { src: gallery[1] ?? "", alt: t("workshopTitle"), span: "" },
    { src: gallery[2] ?? "", alt: t("workshopTitle"), span: "" },
    { src: gallery[3] ?? "", alt: t("workshopTitle"), span: "sm:col-span-2" },
  ].filter((photo) => photo.src);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-indigo px-6 py-24 text-white md:px-10 md:py-32">
        <Image
          src={gallery[0] ?? ""}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-indigo via-indigo/85 to-indigo/50" />

        <Reveal className="relative mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full bg-acid px-4 py-1.5 text-xs font-bold tracking-wide text-ink uppercase">
            {t("kicker")}
          </span>
          <h1 className="mt-6 font-display text-4xl font-extrabold uppercase leading-[1.05] tracking-tight md:text-6xl">
            {t("heroTitleLine1")} <span className="text-acid">{t("heroTitleLine2")}</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/85">
            {t("body")}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="rounded-full bg-acid px-7 py-3.5 text-sm font-semibold text-ink transition-transform hover:scale-[1.03]"
            >
              {t("cta")}
            </Link>
            <Link
              href="/portfolio"
              className="rounded-full border border-white/25 px-7 py-3.5 text-sm font-semibold text-white hover:border-white/60"
            >
              {t("ctaSecondary")}
            </Link>
          </div>
        </Reveal>
      </section>

      {/* Intro + client logos */}
      <section className="bg-white px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-3xl">
          <AboutReveal lead={t("introLead")} rest={t("introRest")} />
        </div>
        <Reveal className="mt-16">
          <ClientLogos />
        </Reveal>
      </section>

      {/* Capabilities */}
      <section className="mx-auto max-w-[1400px] px-6 py-24 lg:px-10 lg:py-32">
        <Reveal className="max-w-xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-indigo uppercase">
            {t("capabilitiesKicker")}
          </p>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            {t("capabilitiesTitle")}
          </h2>
          <p className="mt-4 text-ink/65 leading-relaxed">{t("capabilitiesSubtitle")}</p>
        </Reveal>

        <RevealGroup className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {capabilityKeys.map((key) => (
            <div
              key={key}
              className="flex flex-col gap-4 rounded-2xl border border-ink/10 p-7 transition-transform duration-300 hover:-translate-y-1"
            >
              <span className="flex size-12 items-center justify-center rounded-full bg-indigo/10">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-6 text-indigo"
                >
                  <path d={capabilityIcons[key]} />
                </svg>
              </span>
              <h3 className="font-display text-lg font-medium text-ink">
                {t(`capabilities.${key}.title`)}
              </h3>
              <p className="text-sm leading-relaxed text-ink/65">
                {t(`capabilities.${key}.body`)}
              </p>
            </div>
          ))}
        </RevealGroup>
      </section>

      {/* Process */}
      <section className="border-y border-ink/10 bg-white">
        <div className="mx-auto max-w-[1400px] px-6 py-24 lg:px-10 lg:py-32">
          <Reveal className="max-w-xl">
            <p className="text-xs font-semibold tracking-[0.2em] text-indigo uppercase">
              {t("processKicker")}
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              {t("processTitle")}
            </h2>
            <p className="mt-4 text-ink/65 leading-relaxed">{t("processSubtitle")}</p>
          </Reveal>

          <RevealGroup className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-5">
            {processKeys.map((key, i) => (
              <div key={key} className="relative flex flex-col gap-3">
                {i < processKeys.length - 1 && (
                  <div className="absolute top-6 left-6 hidden h-px w-full bg-ink/10 lg:block" />
                )}
                <span className="relative flex size-12 shrink-0 items-center justify-center rounded-full bg-indigo font-display text-sm font-semibold text-white">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-lg font-medium text-ink">
                  {t(`processSteps.${key}.title`)}
                </h3>
                <p className="text-sm leading-relaxed text-ink/65">
                  {t(`processSteps.${key}.body`)}
                </p>
              </div>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Why choose us */}
      <section className="mx-auto max-w-[1400px] px-6 py-24 lg:px-10 lg:py-32">
        <Reveal className="grid gap-14 lg:grid-cols-2 lg:items-center">
          <div className="min-h-[280px]">
            <Photo
              src={gallery[1] ?? ""}
              alt={t("capabilities.installation.title")}
              ratio="h-full"
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="rounded-lg!"
            />
          </div>
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-indigo uppercase">
              {t("whyKicker")}
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              {t("howWeWork")}
            </h2>
            <ul className="mt-8 flex flex-col gap-5">
              {valueKeys.map((key) => (
                <li key={key} className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-acid">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={3}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="size-3.5 text-ink"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span>
                    <span className="font-semibold text-ink">{t(`values.${key}.title`)}</span>{" "}
                    <span className="text-sm text-ink/65">{t(`values.${key}.body`)}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>

      {/* Workshop gallery */}
      <section className="border-y border-ink/10 bg-white">
        <div className="mx-auto max-w-[1400px] px-6 py-24 lg:px-10 lg:py-32">
          <Reveal className="max-w-xl">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              {t("workshopTitle")}
            </h2>
            <p className="mt-4 text-ink/65 leading-relaxed">{t("workshopSubtitle")}</p>
          </Reveal>

          <RevealGroup className="mt-10 grid grid-cols-2 gap-4 sm:auto-rows-[200px] sm:grid-cols-3">
            {workshopPhotos.map((photo) => (
              <div key={photo.src} className={`overflow-hidden rounded-lg ${photo.span}`}>
                <Photo
                  src={photo.src}
                  alt={photo.alt}
                  ratio="h-full"
                  sizes="(min-width: 640px) 33vw, 50vw"
                  className="rounded-none! h-full"
                />
              </div>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Featured projects */}
      <section className="mx-auto max-w-[1400px] px-6 py-24 lg:px-10 lg:py-32">
        <Reveal className="flex flex-col items-start gap-4 border-b border-ink/10 pb-8 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
          <div>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              {t("projectsTitle")}
            </h2>
            <p className="mt-3 max-w-xl text-ink/65">{t("projectsSubtitle")}</p>
          </div>
          <Link
            href="/portfolio"
            className="shrink-0 rounded-full bg-indigo px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-ink"
          >
            {t("projectsCta")}
          </Link>
        </Reveal>

        <RevealGroup className="mt-10 grid gap-6 sm:grid-cols-3">
          {featuredProjects.map((project) => {
            const category = tServices(`items.${project.service}.title`);
            return (
              <Link
                key={project.slug}
                href="/portfolio"
                className="group relative block h-[280px] overflow-hidden rounded-lg"
              >
                <Photo
                  src={project.photo}
                  alt={tPortfolio("imageBrief", { category })}
                  ratio="h-full"
                  sizes="(min-width: 640px) 33vw, 100vw"
                  className="rounded-none! h-full transition-transform duration-500 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1.5 p-4">
                  <span className="text-sm font-semibold text-white">{category}</span>
                </div>
              </Link>
            );
          })}
        </RevealGroup>
      </section>

      {/* Stats */}
      <section className="bg-indigo text-white">
        <div className="mx-auto grid max-w-[1400px] gap-10 px-6 py-16 sm:grid-cols-3 lg:px-10">
          {statKeys.map((key, i) => (
            <Reveal key={key}>
              <div className="font-display text-4xl font-semibold text-acid">
                {tHome(key)}
              </div>
              <p className="mt-3 max-w-[22ch] text-sm text-white/60">
                {tHome(statLabelKeys[i])}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Materials */}
      <section className="mx-auto max-w-[1400px] px-6 py-24 lg:px-10 lg:py-32">
        <Reveal className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-indigo uppercase">
              {t("materialsKicker")}
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              {t("materialsTitle")}
            </h2>
            <p className="mt-4 text-ink/65 leading-relaxed">{t("materialsBody")}</p>
          </div>
          <div className="flex items-center">
            <p className="text-sm leading-loose text-ink/65">{t("materialsList")}</p>
          </div>
        </Reveal>
      </section>

      {/* Service areas */}
      <section className="border-y border-ink/10 bg-white">
        <div className="mx-auto max-w-[1400px] px-6 py-24 lg:px-10 lg:py-32">
          <Reveal className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-indigo uppercase">
                {t("areasKicker")}
              </p>
              <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                {t("areasTitle")}
              </h2>
              <p className="mt-4 text-ink/65 leading-relaxed">{t("areasBody")}</p>
            </div>
            <div className="flex items-center">
              <p className="text-sm leading-loose text-ink/65">{t("areasList")}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-[1400px] px-6 py-24 lg:px-10 lg:py-32">
        <Reveal className="max-w-xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-indigo uppercase">
            {t("faqKicker")}
          </p>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            {t("faqTitle")}
          </h2>
          <p className="mt-4 text-ink/65 leading-relaxed">{t("faqSubtitle")}</p>
        </Reveal>

        <Reveal className="mt-10 max-w-3xl">
          {faqKeys.map((key) => (
            <FaqItem key={key} question={t(`faq.${key}.q`)} answer={t(`faq.${key}.a`)} />
          ))}
        </Reveal>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-[1400px] px-6 pb-24 lg:px-10 lg:pb-32">
        <Reveal className="flex flex-col items-start gap-8 rounded-3xl bg-indigo px-8 py-14 text-white sm:px-16 sm:py-20 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="max-w-md font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              {t("finalCtaTitle")}
            </h2>
            <p className="mt-3 max-w-md text-white/70">{t("finalCtaBody")}</p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-4">
            <Link
              href="/contact"
              className="rounded-full bg-acid px-8 py-4 text-sm font-semibold text-ink transition-transform hover:scale-[1.03]"
            >
              {t("finalCtaButton")}
            </Link>
            <Link
              href="/portfolio"
              className="rounded-full border border-white/25 px-8 py-4 text-sm font-semibold text-white hover:border-white/60"
            >
              {t("finalCtaSecondary")}
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
