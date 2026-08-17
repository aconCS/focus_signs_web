import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/Reveal";
import { PortfolioGrid } from "@/components/PortfolioGrid";
import { getPortfolioProjects } from "@/lib/portfolio.server";

export default function PortfolioPage() {
  const t = useTranslations("Portfolio");
  // Read on the server; the grid only needs the data to filter client-side.
  const projects = getPortfolioProjects();

  return (
    <>
      <section className="bg-indigo text-white">
        <div className="shell py-20 lg:py-28">
          <p className="text-xs font-semibold tracking-[0.2em] text-acid uppercase">
            {t("kicker")}
          </p>
          <h1 className="mt-4 max-w-2xl font-display text-5xl font-semibold tracking-tight sm:text-6xl">
            {t("title")}
          </h1>
          <p className="mt-5 max-w-lg text-white/70">{t("subtitle")}</p>
        </div>
      </section>

      <section className="shell py-20 lg:py-28">
        <PortfolioGrid projects={projects} />
      </section>

      <section className="shell pb-24 lg:pb-32">
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
