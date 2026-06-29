import type { Locale } from "./i18n-config";
import { getLocalizedHref } from "./i18n-routes";

export const portfolioSectorSegment = {
  fr: "secteur",
  en: "sector",
} as const satisfies Record<Locale, string>;

export const portfolioPath = (locale: Locale) => getLocalizedHref(locale, "portfolio");

export const portfolioSectorPath = (locale: Locale, sectorSlug: string) =>
  `${portfolioPath(locale)}/${portfolioSectorSegment[locale]}/${sectorSlug}`;

export const isPortfolioSectorPath = (locale: Locale, segments: string[]) => {
  const portfolioSegment = "portfolio";
  const expectedSectorSegment = portfolioSectorSegment[locale];
  return segments[0] === portfolioSegment && segments[1] === expectedSectorSegment && Boolean(segments[2]);
};
