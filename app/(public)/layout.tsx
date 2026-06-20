import { headers } from "next/headers";
import Header from "@/components/layout/Header/Header";
import PreviewSync from "@/components/layout/PreviewSync/PreviewSync";
import PageTransitionBoundary from "@/components/layout/PageTransition/PageTransitionBoundary";
import PublicExperienceProvider from "@/components/layout/PublicExperience/PublicExperienceProvider";
import I18nProvider from "@/components/providers/I18nProvider/I18nProvider";
import { getTranslations } from "@/lib/i18n";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next";
import JsonLd from "@/components/seo/JsonLd";
import { getOrganizationJsonLd, getWebsiteJsonLd } from "@/lib/seo";

const PublicLayout = async ({ children }: { children: React.ReactNode }) => {
  const headersList = await headers();
  const initialPathname = headersList.get("x-initial-pathname") ?? "/";
  const normalizedPathname =
    initialPathname.length > 1 && initialPathname.endsWith("/")
      ? initialPathname.slice(0, -1)
      : initialPathname;
  const initialHome =
    normalizedPathname === "/" || normalizedPathname === "/en";
  const [translationsFr, translationsEn] = await Promise.all([
    getTranslations("fr"),
    getTranslations("en"),
  ]);

  return (
    <I18nProvider
      translationsByLocale={{ fr: translationsFr, en: translationsEn }}
    >
      <JsonLd data={[getOrganizationJsonLd(), getWebsiteJsonLd()]} />
      <PublicExperienceProvider initialHome={initialHome}>
        <PreviewSync />
        <Header />
        <PageTransitionBoundary>{children}</PageTransitionBoundary>
        <SpeedInsights />
        <Analytics />
      </PublicExperienceProvider>
    </I18nProvider>
  );
};

export default PublicLayout;
