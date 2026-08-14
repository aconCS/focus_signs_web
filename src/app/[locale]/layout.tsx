import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Jost, Inter } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import "../globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { companyInfo } from "@/lib/content";
import { siteUrl } from "@/lib/site";

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "greek", "cyrillic"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });
  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;

  return {
    metadataBase: new URL(siteUrl),
    title: { default: t("title"), template: `%s · Focus Signs` },
    description: t("description"),
    alternates: {
      canonical: `${siteUrl}${prefix}`,
      languages: Object.fromEntries([
        ...routing.locales.map((l) => [
          l,
          `${siteUrl}${l === routing.defaultLocale ? "" : `/${l}`}`,
        ]),
        ["x-default", siteUrl],
      ]),
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `${siteUrl}${prefix}`,
      siteName: "Focus Signs",
      locale,
      type: "website",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const tNav = await getTranslations({ locale, namespace: "Nav" });

  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "SignShop",
    name: companyInfo.name,
    url: siteUrl,
    email: companyInfo.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Akropoleos 31",
      addressLocality: "Emba",
      addressRegion: "Paphos",
      addressCountry: "CY",
    },
    areaServed: "CY",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "17:00",
      },
    ],
  };

  return (
    <html lang={locale} className={`${jost.variable} ${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-white text-ink">
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-indigo focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white"
        >
          {tNav("skipToContent")}
        </a>
        <NextIntlClientProvider>
          <Header />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
