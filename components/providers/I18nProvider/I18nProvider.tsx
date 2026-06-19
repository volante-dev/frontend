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
  getAlternateHref,
  getLocalizedHref,
  type RouteKey,
} from "@/lib/i18n-routes";
import { t, type Translations } from "@/lib/i18n-messages";

type I18nContextValue = {
  locale: Locale;
  pathname: string;
  translations: Translations;
  t: (key: string, fallback?: string) => string;
  localizedHref: (route: RouteKey) => string;
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
}: {
  children: ReactNode;
  translationsByLocale: Record<Locale, Translations>;
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
      t: (key, fallback) => t(translations, key, fallback),
      localizedHref: (route) => getLocalizedHref(locale, route),
      alternateHref: (targetLocale) => getAlternateHref(pathname, targetLocale),
    }),
    [locale, pathname, translations],
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
