import type { Locale } from "./i18n-config";
import { defaultLocale, locales } from "./i18n-config";

export type RouteKey =
  | "home"
  | "services"
  | "portfolio"
  | "trailblaze"
  | "studio"
  | "contact";

/**
 * Mapping des slugs par locale.
 * Pour un slug différent par langue, modifier la valeur dans la locale concernée.
 * Ex : en.portfolio = "work" donnera /en/work au lieu de /en/portfolio.
 */
export const slugs: Record<Locale, Record<RouteKey, string>> = {
  fr: {
    home: "",
    services: "services",
    portfolio: "portfolio",
    trailblaze: "trailblaze",
    studio: "studio",
    contact: "contact",
  },
  en: {
    home: "",
    services: "services",
    portfolio: "portfolio",
    trailblaze: "trailblaze",
    studio: "studio",
    contact: "contact",
  },
};

const portfolioSectorSegment: Record<Locale, string> = {
  fr: "secteur",
  en: "sector",
};

/** Construit l'URL localisée à partir d'une RouteKey.
 *  getLocalizedHref("en", "portfolio") → "/en/portfolio"
 *  getLocalizedHref("fr", "portfolio") → "/portfolio"
 */
export const getLocalizedHref = (locale: Locale, key: RouteKey): string => {
  const slug = slugs[locale][key];
  const prefix = locale === defaultLocale ? "" : `/${locale}`;
  return slug ? `${prefix}/${slug}` : prefix || "/";
};

/** Trouve la RouteKey correspondant à un slug dans une locale donnée. */
export const getRouteKeyFromSlug = (locale: Locale, slug: string): RouteKey | null => {
  const entry = Object.entries(slugs[locale]).find(([, s]) => s === slug);
  return entry ? (entry[0] as RouteKey) : null;
};

/**
 * Calcule l'URL alternative dans une autre locale à partir du pathname courant.
 *  getAlternateHref("/en/portfolio", "fr") → "/portfolio"
 *  getAlternateHref("/portfolio", "en")    → "/en/portfolio"
 */
export const getAlternateHref = (pathname: string, targetLocale: Locale): string => {
  // Détecter la locale courante depuis le pathname en utilisant le tableau locales
  const parts = pathname.split("/").filter(Boolean);
  const nonDefaultLocales = locales.filter((l) => l !== defaultLocale) as string[];
  const isLocalePrefix = parts.length > 0 && nonDefaultLocales.includes(parts[0]);
  const currentLocale: Locale = isLocalePrefix ? (parts[0] as Locale) : defaultLocale;
  const slugPart = isLocalePrefix ? parts.slice(1).join("/") : parts.join("/");
  const slugSegments = slugPart.split("/").filter(Boolean);

  if (
    slugSegments[0] === slugs[currentLocale].portfolio &&
    slugSegments[1] === portfolioSectorSegment[currentLocale] &&
    slugSegments[2]
  ) {
    const prefix = targetLocale === defaultLocale ? "" : `/${targetLocale}`;
    return `${prefix}/${slugs[targetLocale].portfolio}/${portfolioSectorSegment[targetLocale]}/${slugSegments[2]}`;
  }

  // Trouver la RouteKey dans la locale courante
  const routeKey = slugPart ? getRouteKeyFromSlug(currentLocale, slugPart) : "home";

  if (!routeKey) {
    // Slug inconnu : on préfixe/dépréfixe naïvement
    return targetLocale === defaultLocale ? `/${slugPart}` : `/${targetLocale}/${slugPart}`;
  }

  return getLocalizedHref(targetLocale, routeKey);
};
