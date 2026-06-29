import type { Locale } from "./i18n-config";
import {
  defaultSiteRoutes,
  getPortfolioSectorSegment,
  getLocalizedRouteHref,
  portfolioSectorSegment,
  type SiteRoute,
} from "./site-route-config";

export { portfolioSectorSegment };

export const portfolioPath = (
  locale: Locale,
  siteRoutes: SiteRoute[] = defaultSiteRoutes,
) => getLocalizedRouteHref(siteRoutes, locale, "portfolio");

export const portfolioSectorPath = (
  locale: Locale,
  sectorSlug: string,
  siteRoutes: SiteRoute[] = defaultSiteRoutes,
) => `${portfolioPath(locale, siteRoutes)}/${getPortfolioSectorSegment(locale)}/${sectorSlug}`;

export const isPortfolioSectorPath = (locale: Locale, segments: string[]) => {
  const portfolioSegment = "portfolio";
  const expectedSectorSegment = getPortfolioSectorSegment(locale);
  return segments[0] === portfolioSegment && segments[1] === expectedSectorSegment && Boolean(segments[2]);
};
