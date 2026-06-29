import { cache } from "react";
import { defaultLocale, locales, type Locale } from "./i18n-config";
import prisma from "./prisma";

export type SiteLocale = {
  code: Locale;
  label: string;
  nativeLabel: string;
  hreflang: string;
  isDefault: boolean;
  enabledInAdmin: boolean;
  publishedOnFront: boolean;
  aiEnabled: boolean;
  order: number;
};

const fallbackSiteLocales: SiteLocale[] = [
  {
    code: "fr",
    label: "Français",
    nativeLabel: "Français",
    hreflang: "fr-FR",
    isDefault: true,
    enabledInAdmin: true,
    publishedOnFront: true,
    aiEnabled: false,
    order: 0,
  },
  {
    code: "en",
    label: "Anglais",
    nativeLabel: "English",
    hreflang: "en",
    isDefault: false,
    enabledInAdmin: true,
    publishedOnFront: true,
    aiEnabled: true,
    order: 1,
  },
];

const normalizeLocales = (siteLocales: SiteLocale[]) => {
  const normalized = [...siteLocales].sort(
    (a, b) => a.order - b.order || a.code.localeCompare(b.code),
  );

  if (normalized.some((locale) => locale.code === defaultLocale)) {
    return normalized;
  }

  return [
    fallbackSiteLocales.find((locale) => locale.code === defaultLocale)!,
    ...normalized,
  ];
};

export const getSiteLocales = cache(async (): Promise<SiteLocale[]> => {
  try {
    const siteLocales = await prisma.siteLocale.findMany({
      orderBy: [{ order: "asc" }, { code: "asc" }],
    });

    if (!siteLocales.length) return fallbackSiteLocales;

    return normalizeLocales(
      siteLocales.map((locale) => ({
        code: locale.code,
        label: locale.label,
        nativeLabel: locale.nativeLabel,
        hreflang: locale.hreflang,
        isDefault: locale.isDefault,
        enabledInAdmin: locale.enabledInAdmin,
        publishedOnFront: locale.publishedOnFront,
        aiEnabled: locale.aiEnabled,
        order: locale.order,
      })),
    );
  } catch {
    return fallbackSiteLocales;
  }
});

export const getPublishedLocaleCodes = cache(async (): Promise<Locale[]> => {
  const siteLocales = await getSiteLocales();
  const published = siteLocales
    .filter((locale) => locale.publishedOnFront || locale.code === defaultLocale)
    .map((locale) => locale.code);

  return published.length ? published : locales;
});

export const getAdminLocaleCodes = cache(async (): Promise<Locale[]> => {
  const siteLocales = await getSiteLocales();
  const adminLocales = siteLocales
    .filter((locale) => locale.enabledInAdmin || locale.code === defaultLocale)
    .map((locale) => locale.code);

  return adminLocales.length ? adminLocales : locales;
});
