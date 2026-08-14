import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Reveal, RevealGroup } from "@/components/Reveal";
import { Photo } from "@/components/Photo";
import { serviceIndex } from "@/lib/content";
import {
  industrySlugs,
  industryServices,
  industryPhotos,
  type IndustrySlug,
} from "@/lib/industries";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    industrySlugs.map((slug) => ({ locale, slug }))
  );
}

function isIndustrySlug(slug: string): slug is IndustrySlug {
  return (industrySlugs as string[]).includes(slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isIndustrySlug(slug)) return {};
  const t = await getTranslations({ locale, namespace: "Industries" });
  const tMeta = await getTranslations({ locale, namespace: "Meta" });
  return {
    title: tMeta("industryTitle", { industry: t(`items.${slug}.title`) }),
    description: tMeta("industryDescription", { intro: t(`items.${slug}.intro`) }),
  };
}

export default async function IndustryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!isIndustrySlug(slug)) notFound();

  return <IndustryContent slug={slug} />;
}

function IndustryContent({ slug }: { slug: IndustrySlug }) {
  const t = useTranslations("Industries");
  const tServices = useTranslations("Services");
  const tHome = useTranslations("Home");

  const services = industryServices[slug];

  return (
    <>
      <section className="mx-auto max-w-[1400px] px-6 py-20 lg:px-10 lg:py-28">
        <Link
          href="/industries"
          className="text-sm font-semibold text-indigo hover:text-ink"
        >
          ← {t("backToHub")}
        </Link>
        <Reveal className="mt-6 grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-indigo uppercase">
              {t("hubKicker")}
            </p>
            <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
              {t(`items.${slug}.title`)}
            </h1>
            <p className="mt-3 font-display text-lg text-ink/65">
              {t(`items.${slug}.tagline`)}
            </p>
            <p className="mt-5 max-w-lg leading-relaxed text-ink/65">
              {t(`items.${slug}.intro`)}
            </p>
          </div>
          <Photo
            src={industryPhotos[slug]}
            alt={t(`items.${slug}.title`)}
            ratio="aspect-[4/5]"
          />
        </Reveal>
      </section>

      <section className="border-y border-ink/10 bg-white">
        <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-10">
          <h2 className="text-xs font-semibold tracking-[0.2em] text-ink/65 uppercase">
            {t("relevantServices")}
          </h2>
          <RevealGroup className="mt-6 grid gap-6 sm:grid-cols-3">
            {services.map((serviceSlug) => (
              <Link
                key={serviceSlug}
                href={`/services#${serviceSlug}`}
                className="group rounded-2xl border border-ink/10 p-6 transition-colors hover:border-indigo"
              >
                <span className="font-display text-sm font-semibold text-ink/65">
                  {serviceIndex[serviceSlug]}
                </span>
                <h3 className="mt-2 font-display text-lg font-medium text-ink">
                  {tServices(`items.${serviceSlug}.title`)}
                </h3>
                <p className="mt-1 text-sm text-ink/65">
                  {tServices(`items.${serviceSlug}.summary`)}
                </p>
              </Link>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 pb-24 lg:px-10 lg:pb-32">
        <Reveal className="flex flex-col items-start gap-6 rounded-3xl bg-indigo px-8 py-14 text-white sm:flex-row sm:items-center sm:justify-between sm:px-16">
          <div>
            <h2 className="max-w-md font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              {t("ctaTitle", { industry: t(`items.${slug}.title`).toLowerCase() })}
            </h2>
            <p className="mt-3 max-w-md text-white/70">{t("ctaBody")}</p>
          </div>
          <Link
            href="/contact"
            className="shrink-0 rounded-full bg-acid px-8 py-4 text-sm font-semibold text-ink transition-transform hover:scale-[1.03]"
          >
            {tHome("ctaBandButton")}
          </Link>
        </Reveal>
      </section>
    </>
  );
}
