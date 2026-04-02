import { get } from "@vercel/edge-config";

export { getLocalizedHref, getAlternateHref, slugs } from "./i18n-routes";
export type { RouteKey } from "./i18n-routes";

export type Locale = "fr" | "en";

export const defaultLocale: Locale = "fr";
export const locales: Locale[] = ["fr", "en"];

export type Translations = Record<string, string>;

/** Charge les traductions depuis Vercel Edge Config. Retourne {} en fallback. */
export const getTranslations = async (locale: Locale): Promise<Translations> => {
  try {
    const translations = await get<Translations>(locale);
    return translations ?? {};
  } catch {
    return {};
  }
};

/** Récupère une clé de traduction, avec fallback si absente. */
export const t = (translations: Translations, key: string, fallback = ""): string =>
  translations[key] ?? fallback;

/** Détermine la locale depuis un header Accept-Language. */
export const parseLocaleFromHeader = (header: string | null): Locale => {
  if (!header) return defaultLocale;
  const primary = header.split(",")[0].split(";")[0].trim().split("-")[0];
  return (locales as string[]).includes(primary) ? (primary as Locale) : defaultLocale;
};
