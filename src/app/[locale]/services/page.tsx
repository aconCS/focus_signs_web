import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/Reveal";
import { Photo } from "@/components/Photo";
import { serviceSlugs, serviceIndex } from "@/lib/content";
import { getServiceCovers } from "@/lib/portfolio.server";
import { industrySlugs, industryServices } from "@/lib/industries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });
  return { title: t("servicesTitle"), description: t("servicesDescription") };
}

export default function ServicesPage() {
  const t = useTranslations("Services");
  const tIndustries = useTranslations("Industries");
  const serviceCovers = getServiceCovers();

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

      <div className="mx-auto max-w-[1400px] divide-y divide-ink/10 px-6 lg:px-10">
        {serviceSlugs.map((slug) => {
          const title = t(`items.${slug}.title`);
          return (
            <section key={slug} id={slug} className="scroll-mt-24 py-20 lg:py-24">
              <Reveal className="grid gap-10 lg:grid-cols-[auto_1fr_1fr] lg:items-start lg:gap-14">
                <span className="font-display text-sm font-semibold text-ink/65">
                  {serviceIndex[slug]}
                </span>
                <div>
                  <h2 className="font-display text-3xl font-medium text-ink sm:text-4xl">
                    {title}
                  </h2>
                  <p className="mt-4 max-w-md text-ink/65 leading-relaxed">
                    {t(`items.${slug}.detail`)}
                  </p>

                  {/* What the category actually covers. Listed rather than
                      buried in prose, so a visitor scanning for one specific
                      job can find it without reading the paragraph. */}
                  <h3 className="mt-7 text-xs font-semibold tracking-[0.15em] text-ink/65 uppercase">
                    {t("covers")}
                  </h3>
                  <ul className="mt-3 flex flex-wrap gap-x-2 gap-y-2">
                    {(t.raw(`items.${slug}.covers`) as string[]).map((entry) => (
                      <li
                        key={entry}
                        className="rounded-full bg-ink/5 px-3 py-1.5 text-sm text-ink"
                      >
                        {entry}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 flex flex-wrap gap-4">
                    <Link
                      href="/contact"
                      className="text-sm font-semibold text-indigo hover:text-ink"
                    >
                      {t("askAbout", { service: title.toLowerCase() })}
                    </Link>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {industrySlugs
                      .filter((iSlug) => industryServices[iSlug].includes(slug))
                      .map((iSlug) => (
                        <Link
                          key={iSlug}
                          href={`/industries/${iSlug}`}
                          className="rounded-full border border-ink/10 px-3 py-1 text-xs font-medium text-ink/65 hover:border-indigo hover:text-indigo"
                        >
                          {tIndustries(`items.${iSlug}.title`)}
                        </Link>
                      ))}
                  </div>
                </div>
                <Photo
                  src={serviceCovers[slug] ?? ""}
                  alt={t("imageBrief", { service: title.toLowerCase() })}
                  ratio="aspect-[5/4]"
                  sizes="(min-width: 1024px) 33vw, 100vw"
                  className="rounded-lg!"
                />
              </Reveal>
            </section>
          );
        })}
      </div>
    </>
  );
}
