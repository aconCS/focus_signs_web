import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { QuoteForm } from "@/components/QuoteForm";
import { LocationMap } from "@/components/LocationMap";
import { companyInfo } from "@/lib/content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });
  return { title: t("contactTitle"), description: t("contactDescription") };
}

export default function ContactPage() {
  const t = useTranslations("Contact");
  const tHours = useTranslations("Hours");

  const hours = [
    { days: tHours("weekdays"), time: tHours("weekdaysTime") },
    { days: tHours("saturday"), time: tHours("saturdayTime") },
    { days: tHours("sunday"), time: tHours("sundayTime") },
  ];

  return (
    <section className="mx-auto max-w-[1400px] px-6 py-16 lg:px-10 lg:py-24">
      <h1 className="font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
        {t("title")}
      </h1>
      <p className="mt-4 max-w-md text-ink/65 leading-relaxed">{t("subtitle")}</p>

      {/* Shadow sits on the card, not the white half inside it — `overflow-hidden`
          here clips the rounded corners and would clip an inner shadow too.
          Tinted with ink rather than black so it stays in the brand family. */}
      <div className="mt-12 grid overflow-hidden rounded-3xl shadow-[0_28px_70px_-24px_rgba(21,18,31,0.45)] lg:grid-cols-2">
        <div className="flex flex-col gap-8 bg-indigo p-8 text-white sm:p-10">
          <LocationMap className="aspect-[4/3]" />

          <dl className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-5 shrink-0 text-acid"
                aria-hidden
              >
                <path d="M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" />
                <path d="m3.5 6.5 8.5 6 8.5-6" />
              </svg>
              <dt className="sr-only">{t("email")}</dt>
              <dd>
                <a href={`mailto:${companyInfo.email}`} className="font-semibold hover:text-acid">
                  {companyInfo.email}
                </a>
              </dd>
            </div>

            <div className="flex items-start gap-3">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mt-0.5 size-5 shrink-0 text-acid"
                aria-hidden
              >
                <path d="M12 21s7-6.5 7-11.5a7 7 0 1 0-14 0C5 14.5 12 21 12 21Z" />
                <circle cx="12" cy="9.5" r="2.5" />
              </svg>
              <dt className="sr-only">{t("workshop")}</dt>
              <dd className="font-semibold">{companyInfo.address}</dd>
            </div>

            <div className="flex items-start gap-3">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mt-0.5 size-5 shrink-0 text-acid"
                aria-hidden
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3.5 2" />
              </svg>
              <dt className="sr-only">{t("hours")}</dt>
              <dd className="space-y-0.5 text-sm font-medium text-white/80">
                {hours.map((h) => (
                  <p key={h.days}>
                    {h.days}: {h.time}
                  </p>
                ))}
              </dd>
            </div>
          </dl>
        </div>

        <div className="bg-white p-8 sm:p-10">
          <QuoteForm />
        </div>
      </div>
    </section>
  );
}
