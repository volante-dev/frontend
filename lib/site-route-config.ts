import type { Locale } from "./i18n-config";
import { defaultLocale } from "./i18n-config";

export const siteRouteIds = [
  "home",
  "services",
  "portfolio",
  "trailblaze",
  "studio",
  "contact",
] as const;

export type SiteRouteId = (typeof siteRouteIds)[number];

export type SitemapFrequency =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";

export type SiteRoute = {
  id: SiteRouteId;
  label: string;
  labelEn: string;
  slug: string;
  slugEn: string;
  internalSegment: string;
  order: number;
  showInHeader: boolean;
  showInFooter: boolean;
  includeInSitemap: boolean;
  sitemapPriority: number;
  sitemapFrequency: SitemapFrequency;
};

export const defaultSiteRoutes: SiteRoute[] = [
  {
    id: "home",
    label: "Accueil",
    labelEn: "Home",
    slug: "",
    slugEn: "",
    internalSegment: "",
    order: 0,
    showInHeader: false,
    showInFooter: false,
    includeInSitemap: true,
    sitemapPriority: 1,
    sitemapFrequency: "weekly",
  },
  {
    id: "services",
    label: "Services",
    labelEn: "Services",
    slug: "services",
    slugEn: "services",
    internalSegment: "services",
    order: 1,
    showInHeader: true,
    showInFooter: true,
    includeInSitemap: true,
    sitemapPriority: 0.8,
    sitemapFrequency: "monthly",
  },
  {
    id: "portfolio",
    label: "Portfolio",
    labelEn: "Portfolio",
    slug: "portfolio",
    slugEn: "portfolio",
    internalSegment: "portfolio",
    order: 2,
    showInHeader: true,
    showInFooter: true,
    includeInSitemap: true,
    sitemapPriority: 0.9,
    sitemapFrequency: "monthly",
  },
  {
    id: "trailblaze",
    label: "Trailblaze",
    labelEn: "Trailblaze",
    slug: "trailblaze",
    slugEn: "trailblaze",
    internalSegment: "trailblaze",
    order: 3,
    showInHeader: true,
    showInFooter: true,
    includeInSitemap: true,
    sitemapPriority: 0.7,
    sitemapFrequency: "monthly",
  },
  {
    id: "studio",
    label: "Studio",
    labelEn: "Studio",
    slug: "studio",
    slugEn: "studio",
    internalSegment: "studio",
    order: 4,
    showInHeader: true,
    showInFooter: true,
    includeInSitemap: true,
    sitemapPriority: 0.7,
    sitemapFrequency: "monthly",
  },
  {
    id: "contact",
    label: "Contact",
    labelEn: "Contact",
    slug: "contact",
    slugEn: "contact",
    internalSegment: "contact",
    order: 5,
    showInHeader: true,
    showInFooter: true,
    includeInSitemap: true,
    sitemapPriority: 0.6,
    sitemapFrequency: "monthly",
  },
];

const routeIds = new Set<string>(siteRouteIds);
const defaultRoutesById = new Map(defaultSiteRoutes.map((route) => [route.id, route]));

export const portfolioSectorSegment = {
  fr: "secteur",
  en: "sector",
} as const satisfies Record<Locale, string>;

export const isSiteRouteId = (value: string): value is SiteRouteId =>
  routeIds.has(value);

export const normalizeSiteRoutes = (routes: SiteRoute[]): SiteRoute[] => {
  const merged = defaultSiteRoutes.map((defaultRoute) => {
    const route = routes.find((item) => item.id === defaultRoute.id);
    return route ? { ...defaultRoute, ...route } : defaultRoute;
  });

  return merged.sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
};

export const getSiteRouteById = (
  routes: SiteRoute[],
  id: SiteRouteId,
): SiteRoute => {
  const route = routes.find((item) => item.id === id);
  return route ?? defaultRoutesById.get(id)!;
};

export const getSiteRouteSlug = (route: SiteRoute, locale: Locale): string =>
  locale === "en" ? route.slugEn : route.slug;

export const getLocalizedRouteHref = (
  routes: SiteRoute[],
  locale: Locale,
  id: SiteRouteId,
): string => {
  const route = getSiteRouteById(routes, id);
  const slug = getSiteRouteSlug(route, locale);
  const prefix = locale === defaultLocale ? "" : `/${locale}`;
  return slug ? `${prefix}/${slug}` : prefix || "/";
};

export const getRouteFromPublicSlug = (
  routes: SiteRoute[],
  locale: Locale,
  slug: string,
): SiteRoute | null => {
  const normalizedSlug = slug.replace(/^\/+|\/+$/g, "");
  if (!normalizedSlug) return getSiteRouteById(routes, "home");
  return routes.find((route) => getSiteRouteSlug(route, locale) === normalizedSlug) ?? null;
};

export const getAlternateRouteHref = (
  routes: SiteRoute[],
  pathname: string,
  targetLocale: Locale,
): string => {
  const parts = pathname.split("/").filter(Boolean);
  const currentLocale =
    parts[0] === "en" ? "en" : defaultLocale;
  const visibleParts = currentLocale === "en" ? parts.slice(1) : parts;
  const currentRoute = visibleParts[0]
    ? getRouteFromPublicSlug(routes, currentLocale, visibleParts[0])
    : getSiteRouteById(routes, "home");

  if (!currentRoute) {
    const rawPath = visibleParts.join("/");
    return targetLocale === defaultLocale ? `/${rawPath}` : `/${targetLocale}/${rawPath}`;
  }

  const base = getLocalizedRouteHref(routes, targetLocale, currentRoute.id);
  const rest = visibleParts.slice(1);
  if (
    currentRoute.id === "portfolio" &&
    rest[0] === portfolioSectorSegment[currentLocale]
  ) {
    rest[0] = portfolioSectorSegment[targetLocale];
  }

  return rest.length ? `${base}/${rest.join("/")}` : base;
};
