import { get } from "@vercel/edge-config";
import type { BuiltInLocale, Locale } from "./i18n-config";
import { locales, defaultLocale } from "./i18n-config";
import {
  localTranslations,
  type Translations,
} from "./i18n-messages";

export { getLocalizedHref, getAlternateHref, slugs } from "./i18n-routes";
export type { RouteKey } from "./i18n-routes";
export type { BuiltInLocale, Locale } from "./i18n-config";
export type { Translations, TranslationKey } from "./i18n-messages";
export { locales, defaultLocale } from "./i18n-config";
export { t } from "./i18n-messages";

const isTranslationMap = (value: unknown): value is Translations =>
  typeof value === "object" &&
  value !== null &&
  !Array.isArray(value) &&
  Object.values(value).every((entry) => typeof entry === "string");

/** Charge les traductions locales et applique les éventuelles surcharges Edge Config. */
export const getTranslations = async (locale: Locale): Promise<Translations> => {
  const dictionaryLocale = (
    locale in localTranslations ? locale : defaultLocale
  ) as BuiltInLocale;
  const local = localTranslations[dictionaryLocale];

  if (!process.env.EDGE_CONFIG) {
    return local;
  }

  try {
    const remote = await get<unknown>(locale);
    if (remote === undefined) return local;

    if (!isTranslationMap(remote)) {
      console.error(`[i18n] Invalid Edge Config dictionary for locale "${locale}".`);
      return local;
    }

    return { ...local, ...remote };
  } catch (error) {
    console.error(
      `[i18n] Unable to load Edge Config dictionary for locale "${locale}".`,
      error instanceof Error ? error.message : error,
    );
    return local;
  }
};

/** Retourne la valeur traduite si disponible, sinon la valeur par défaut. */
export const localizeField = (base: string, translated: string | null | undefined, locale: Locale): string =>
  locale !== defaultLocale && translated ? translated : base;

/** Détermine la locale depuis un header Accept-Language. */
export const parseLocaleFromHeader = (header: string | null): Locale => {
  if (!header) return defaultLocale;
  const primary = header.split(",")[0].split(";")[0].trim().split("-")[0];
  return (locales as string[]).includes(primary) ? (primary as Locale) : defaultLocale;
};
