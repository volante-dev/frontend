import type { Locale } from "./i18n-config";
import {
  defaultSiteRoutes,
  getAlternateRouteHref,
  getLocalizedRouteHref,
  getRouteFromPublicSlug,
  type SiteRouteId,
} from "./site-route-config";

export type RouteKey = SiteRouteId;

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

/** Construit l'URL localisée à partir d'une RouteKey.
 *  getLocalizedHref("en", "portfolio") → "/en/portfolio"
 *  getLocalizedHref("fr", "portfolio") → "/portfolio"
 */
export const getLocalizedHref = (locale: Locale, key: RouteKey): string => {
  return getLocalizedRouteHref(defaultSiteRoutes, locale, key);
};

/** Trouve la RouteKey correspondant à un slug dans une locale donnée. */
export const getRouteKeyFromSlug = (locale: Locale, slug: string): RouteKey | null => {
  return getRouteFromPublicSlug(defaultSiteRoutes, locale, slug)?.id ?? null;
};

/**
 * Calcule l'URL alternative dans une autre locale à partir du pathname courant.
 *  getAlternateHref("/en/portfolio", "fr") → "/portfolio"
 *  getAlternateHref("/portfolio", "en")    → "/en/portfolio"
 */
export const getAlternateHref = (pathname: string, targetLocale: Locale): string => {
  return getAlternateRouteHref(defaultSiteRoutes, pathname, targetLocale);
};
