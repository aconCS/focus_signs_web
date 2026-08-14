import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });
  return { title: t("portfolioTitle"), description: t("portfolioDescription") };
}

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return children;
}
