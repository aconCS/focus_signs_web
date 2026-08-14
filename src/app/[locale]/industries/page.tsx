import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { RevealGroup } from "@/components/Reveal";
import { Photo } from "@/components/Photo";
import { industrySlugs, industryPhotos } from "@/lib/industries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });
  return { title: t("industriesTitle"), description: t("industriesDescription") };
}

export default function IndustriesPage() {
  const t = useTranslations("Industries");

  return (
    <>
      <section className="bg-indigo text-white">
        <div className="mx-auto max-w-[1400px] px-6 py-20 lg:px-10 lg:py-28">
          <p className="text-xs font-semibold tracking-[0.2em] text-acid uppercase">
            {t("hubKicker")}
          </p>
          <h1 className="mt-4 max-w-2xl font-display text-5xl font-semibold tracking-tight sm:text-6xl">
            {t("hubTitle")}
          </h1>
          <p className="mt-5 max-w-lg text-white/70">{t("hubSubtitle")}</p>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 py-20 lg:px-10 lg:py-28">
        <RevealGroup className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {industrySlugs.map((slug) => {
            const title = t(`items.${slug}.title`);
            const tagline = t(`items.${slug}.tagline`);
            return (
              <Link key={slug} href={`/industries/${slug}`} className="group block">
                <Photo
                  src={industryPhotos[slug]}
                  alt={tagline}
                  ratio="aspect-[4/3]"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="rounded-none!"
                />
                <div className="flex items-center justify-between gap-4 border-t-2 border-acid bg-indigo px-5 py-4">
                  <h2 className="font-display text-lg font-bold text-white">{title}</h2>
                  <span className="shrink-0 text-white/60 transition-colors group-hover:text-white">
                    →
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-ink/65">{tagline}</p>
              </Link>
            );
          })}
        </RevealGroup>
      </section>
    </>
  );
}
