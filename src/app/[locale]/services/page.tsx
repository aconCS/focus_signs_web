import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/Reveal";
import { Photo } from "@/components/Photo";
import { serviceSlugs, serviceIndex } from "@/lib/content";
import { getServicePhotos } from "@/lib/portfolio.server";
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
  const servicePhotos = getServicePhotos();

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

      {/* Big categories as a scannable list; each one's subcategories sit in
          a carousel directly below it, one card per item in `covers`. */}
      <div className="mx-auto max-w-[1400px] divide-y divide-ink/10 px-6 lg:px-10">
        {serviceSlugs.map((slug) => {
          const title = t(`items.${slug}.title`);
          const covers = t.raw(`items.${slug}.covers`) as string[];
          const photos = servicePhotos[slug];

          return (
            <section key={slug} id={slug} className="scroll-mt-24 py-16 lg:py-20">
              <Reveal>
                <div className="flex items-baseline gap-4">
                  <span className="font-display text-sm font-semibold text-ink/65">
                    {serviceIndex[slug]}
                  </span>
                  <h2 className="font-display text-3xl font-medium text-ink sm:text-4xl">
                    {title}
                  </h2>
                </div>
                <p className="mt-4 max-w-2xl text-ink/65 leading-relaxed">
                  {t(`items.${slug}.detail`)}
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-5">
                  <Link
                    href="/contact"
                    className="text-sm font-semibold text-indigo hover:text-ink"
                  >
                    {t("askAbout", { service: title.toLowerCase() })}
                  </Link>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
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
              </Reveal>

              {photos.length > 0 && (
                <div
                  className="mt-8 -mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-2 [scrollbar-width:none] lg:-mx-10 lg:px-10 [&::-webkit-scrollbar]:hidden"
                >
                  {covers.map((label, i) => (
                    <div
                      key={label}
                      className="w-[200px] shrink-0 snap-start sm:w-[240px]"
                    >
                      <Photo
                        src={photos[i % photos.length]}
                        alt={label}
                        ratio="aspect-[4/5]"
                        sizes="240px"
                        className="rounded-lg!"
                      />
                      <p className="mt-3 text-sm font-medium text-ink">
                        {label}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </>
  );
}
