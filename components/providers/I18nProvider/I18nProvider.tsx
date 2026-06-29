"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { defaultLocale, locales, type Locale } from "@/lib/i18n-config";
import {
  getAlternateRouteHref,
  getLocalizedRouteHref,
  type SiteRoute,
  type SiteRouteId,
} from "@/lib/site-route-config";
import { t, type Translations } from "@/lib/i18n-messages";

type I18nContextValue = {
  locale: Locale;
  pathname: string;
  translations: Translations;
  siteRoutes: SiteRoute[];
  t: (key: string, fallback?: string) => string;
  localizedHref: (route: SiteRouteId) => string;
  alternateHref: (targetLocale: Locale) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export const getLocaleFromPathname = (pathname: string): Locale => {
  const firstSegment = pathname.split("/").filter(Boolean)[0];
  return locales.includes(firstSegment as Locale) && firstSegment !== defaultLocale
    ? (firstSegment as Locale)
    : defaultLocale;
};

const getVisiblePathname = (pathname: string): string => {
  if (pathname === `/${defaultLocale}`) return "/";
  if (pathname.startsWith(`/${defaultLocale}/`)) {
    return pathname.slice(defaultLocale.length + 1);
  }
  return pathname;
};

const I18nProvider = ({
  children,
  translationsByLocale,
  siteRoutes,
}: {
  children: ReactNode;
  translationsByLocale: Record<Locale, Translations>;
  siteRoutes: SiteRoute[];
}) => {
  const internalPathname = usePathname();
  const pathname = getVisiblePathname(internalPathname);
  const locale = getLocaleFromPathname(pathname);
  const translations = translationsByLocale[locale];

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      pathname,
      translations,
      siteRoutes,
      t: (key, fallback) => t(translations, key, fallback),
      localizedHref: (route) => getLocalizedRouteHref(siteRoutes, locale, route),
      alternateHref: (targetLocale) =>
        getAlternateRouteHref(siteRoutes, pathname, targetLocale),
    }),
    [locale, pathname, siteRoutes, translations],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = (): I18nContextValue => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used inside I18nProvider.");
  }
  return context;
};

export default I18nProvider;
