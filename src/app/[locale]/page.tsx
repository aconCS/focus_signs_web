import Image from "next/image";
import { useTranslations } from "next-intl";
import { Hero } from "@/components/Hero";
import { Reveal, RevealGroup } from "@/components/Reveal";
import { IrisMark } from "@/components/IrisMark";
import { Photo } from "@/components/Photo";
import { ClientLogos } from "@/components/ClientLogos";
import { AboutReveal } from "@/components/AboutReveal";
import { DraggableMarquee } from "@/components/DraggableMarquee";
import { Link } from "@/i18n/navigation";
import { serviceSlugs, serviceIndex } from "@/lib/content";
import { portfolioProjects } from "@/lib/portfolio";
import type { ServiceSlug } from "@/lib/content";

const servicePhotos = portfolioProjects.reduce(
  (acc, project) => {
    acc[project.service] = project.photo;
    return acc;
  },
  {} as Record<ServiceSlug, string>
);

function ServiceCard({
  slug,
  index,
  title,
  summary,
  photo,
  viewLabel,
}: {
  slug: ServiceSlug;
  index: string;
  title: string;
  summary: string;
  photo: string;
  viewLabel: string;
}) {
  return (
    <Link href={`/services#${slug}`} className="group block">
      <Photo
        src={photo}
        alt={summary}
        ratio="aspect-[4/3]"
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="rounded-none!"
      />
      <div className="flex items-center justify-between gap-6 border-t-2 border-acid bg-indigo px-6 py-6">
        <p className="flex items-baseline gap-3 truncate">
          <span className="shrink-0 font-display text-sm font-semibold text-white/50">
            {index}
          </span>
          <span className="truncate font-display text-lg font-bold text-white sm:text-xl">
            {title}
          </span>
        </p>
        <span className="shrink-0 text-xs font-semibold tracking-wide text-white/60 uppercase transition-colors group-hover:text-white">
          {viewLabel}
        </span>
      </div>
    </Link>
  );
}

export default function Home() {
  const t = useTranslations("Home");
  const tServices = useTranslations("Services");
  const tPortfolio = useTranslations("Portfolio");
  const tNav = useTranslations("Nav");

  const recentWork = [...portfolioProjects].sort((a, b) => (a.date < b.date ? 1 : -1));
  const workHalf = Math.ceil(recentWork.length / 2);
  const workRowA = recentWork.slice(0, workHalf);
  const workRowB = recentWork.slice(workHalf);

  const viewServiceLabel = tServices("viewService");
  const serviceCards = serviceSlugs.map((slug) => ({
    slug,
    index: serviceIndex[slug],
    title: tServices(`items.${slug}.title`),
    summary: tServices(`items.${slug}.summary`),
    photo: servicePhotos[slug],
  }));
  return (
    <>
      <Hero />

      {/* About */}
      <section className="bg-white py-16 md:py-24">
        <div className="shell mb-16 grid items-stretch gap-12 md:grid-cols-2 md:gap-16">
          <Reveal className="min-h-[280px]">
            <Photo
              src="/photos/work.jpg"
              alt={t("aboutLead")}
              ratio="h-full"
              sizes="(min-width: 768px) 50vw, 100vw"
              className="rounded-lg!"
            />
          </Reveal>
          <div className="flex flex-col justify-center">
            <AboutReveal lead={t("aboutLead")} rest={t("aboutRest")} />
            <Link
              href="/about"
              className="mt-6 inline-block w-fit text-sm font-semibold text-indigo hover:text-ink"
            >
              {t("aboutCta")}
            </Link>
          </div>
        </div>

        <Reveal className="shell">
          <ClientLogos />
        </Reveal>
      </section>

      {/* Recent work teaser */}
      <section className="overflow-hidden border-y border-ink/10 bg-white py-16 md:py-24">
        <div className="shell mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              {t("recentWorkTitle")}
            </h2>
            <p className="mt-3 max-w-xl text-ink/65">{t("recentWorkSubtitle")}</p>
          </div>
          <Link
            href="/portfolio"
            className="shrink-0 rounded-full bg-indigo px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-ink"
          >
            {t("recentWorkCta")}
          </Link>
        </div>

        <div className="flex flex-col gap-5">
          {[workRowA, workRowB].map((row, rowIndex) => (
            <DraggableMarquee
              key={rowIndex}
              reverse={rowIndex === 1}
              className="[mask-image:linear-gradient(90deg,transparent,#000_5%,#000_95%,transparent)]"
            >
              <div className="flex w-max gap-5">
                {[...row, ...row].map((project, i) => {
                  const category = tServices(`items.${project.service}.title`);
                  return (
                    <Link
                      key={`${project.slug}-${i}`}
                      href="/portfolio"
                      draggable={false}
                      className="relative h-[220px] w-[320px] shrink-0 overflow-hidden rounded-lg md:h-[260px] md:w-[380px]"
                    >
                      <Image
                        src={project.photo}
                        alt={tPortfolio("imageBrief", { category })}
                        fill
                        sizes="380px"
                        draggable={false}
                        className="object-cover transition-opacity select-none hover:opacity-90"
                      />
                    </Link>
                  );
                })}
              </div>
            </DraggableMarquee>
          ))}
        </div>
      </section>

      {/* Services index */}
      {/* Heading and grid share one container so their left edges line up. */}
      <section className="shell py-24 lg:py-32">
        <Reveal>
          <h2 className="font-display text-[clamp(2.5rem,8vw,7.25rem)] font-extrabold leading-[1.02] tracking-tight text-ink uppercase">
            {t("servicesHeading1")}
            <br />
            <span className="text-indigo">{t("servicesHeading2")}</span>
          </h2>
        </Reveal>

        <div className="mt-16 flex flex-col gap-10 lg:mt-32 lg:flex-row lg:items-stretch lg:gap-16">
          <RevealGroup className="flex flex-1 flex-col gap-12">
            <ServiceCard {...serviceCards[0]} viewLabel={viewServiceLabel} />
            <ServiceCard {...serviceCards[2]} viewLabel={viewServiceLabel} />
            <ServiceCard {...serviceCards[4]} viewLabel={viewServiceLabel} />

            <div className="flex min-h-0 flex-1 flex-col justify-center">
              <div className="flex flex-wrap items-center justify-between gap-5">
                <h3 className="font-display text-2xl font-extrabold leading-[1.05] tracking-tight text-ink uppercase">
                  {t("browseByLine1")}
                </h3>
                <Link
                  href="/contact"
                  className="inline-flex w-fit shrink-0 items-center rounded-full bg-acid px-6 py-3 text-xs font-bold tracking-wide text-ink uppercase transition-transform hover:scale-[1.03]"
                >
                  {tNav("requestQuote")}
                </Link>
              </div>
              <span className="font-display text-2xl font-extrabold leading-[1.05] tracking-tight text-indigo uppercase">
                {t("browseByLine2")}
              </span>
            </div>
          </RevealGroup>

          <RevealGroup className="flex flex-1 flex-col gap-12">
            <div className="max-w-lg">
              <p className="text-xl leading-[1.9] text-ink">
                <span className="font-display font-semibold">{t("servicesHeading1")} </span>
                {tServices("subtitle")}
              </p>
              <Link
                href="/services"
                className="mt-5 inline-block text-sm font-semibold text-indigo hover:text-ink"
              >
                {t("allServices")}
              </Link>
            </div>
            <ServiceCard {...serviceCards[1]} viewLabel={viewServiceLabel} />
            <ServiceCard {...serviceCards[3]} viewLabel={viewServiceLabel} />
            <ServiceCard {...serviceCards[5]} viewLabel={viewServiceLabel} />
          </RevealGroup>
        </div>
      </section>

      {/* CTA band */}
      <section className="shell py-24 lg:py-32">
        <Reveal className="flex flex-col items-start gap-8 rounded-3xl bg-indigo px-8 py-14 text-white sm:px-16 sm:py-20 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-5">
            <IrisMark className="mt-1 size-10 shrink-0 text-acid" />
            <div>
              <h2 className="max-w-md font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                {t("ctaBandTitle")}
              </h2>
              <p className="mt-3 max-w-md text-white/70">{t("ctaBandSub")}</p>
            </div>
          </div>
          <div className="flex shrink-0 flex-col items-start gap-3 lg:items-end">
            <Link
              href="/contact"
              className="rounded-full bg-acid px-8 py-4 text-sm font-semibold text-ink transition-transform hover:scale-[1.03]"
            >
              {t("ctaBandButton")}
            </Link>
            <p className="text-xs text-white/60">{t("ctaBandReassurance")}</p>
          </div>
        </Reveal>
      </section>
    </>
  );
}
