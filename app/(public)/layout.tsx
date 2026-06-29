import { headers } from "next/headers";
import Header from "@/components/layout/Header/Header";
import DockMenu from "@/components/layout/DockMenu/DockMenu";
import DockMenuProvider from "@/components/layout/DockMenu/DockMenuProvider";
import PreviewSync from "@/components/layout/PreviewSync/PreviewSync";
import PageTransitionBoundary from "@/components/layout/PageTransition/PageTransitionBoundary";
import PublicExperienceProvider from "@/components/layout/PublicExperience/PublicExperienceProvider";
import I18nProvider from "@/components/providers/I18nProvider/I18nProvider";
import { getTranslations } from "@/lib/i18n";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next";
import JsonLd from "@/components/seo/JsonLd";
import { getOrganizationJsonLd, getWebsiteJsonLd } from "@/lib/seo";
import { getSiteRoutes } from "@/lib/site-routes";
import { defaultLocale } from "@/lib/i18n-config";
import { getPublishedLocaleCodes } from "@/lib/site-locales";

const PublicLayout = async ({ children }: { children: React.ReactNode }) => {
  const headersList = await headers();
  const initialPathname = headersList.get("x-initial-pathname") ?? "/";
  const normalizedPathname =
    initialPathname.length > 1 && initialPathname.endsWith("/")
      ? initialPathname.slice(0, -1)
      : initialPathname;
  const [localeCodes, siteRoutes] = await Promise.all([
    getPublishedLocaleCodes(),
    getSiteRoutes(),
  ]);
  const initialHome =
    normalizedPathname === "/" ||
    localeCodes
      .filter((locale) => locale !== defaultLocale)
      .some((locale) => normalizedPathname === `/${locale}`);
  const translationsEntries = await Promise.all(
    localeCodes.map(async (locale) => [locale, await getTranslations(locale)] as const),
  );
  const translationsByLocale = Object.fromEntries(translationsEntries);

  return (
    <I18nProvider
      translationsByLocale={translationsByLocale}
      localeCodes={localeCodes}
      siteRoutes={siteRoutes}
    >
      <JsonLd data={[getOrganizationJsonLd(), getWebsiteJsonLd()]} />
      <PublicExperienceProvider initialHome={initialHome}>
        <DockMenuProvider>
          <PreviewSync />
          <Header items={siteRoutes.filter((route) => route.showInHeader)} />
          <DockMenu />
          <PageTransitionBoundary>{children}</PageTransitionBoundary>
          <SpeedInsights />
          <Analytics />
        </DockMenuProvider>
      </PublicExperienceProvider>
    </I18nProvider>
  );
};

export default PublicLayout;
