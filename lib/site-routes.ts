import { cache } from "react";
import prisma from "./prisma";
import {
  defaultSiteRoutes,
  isSiteRouteId,
  normalizeSiteRoutes,
  type SiteRoute,
  type SitemapFrequency,
} from "./site-route-config";

const sitemapFrequencies = new Set<SitemapFrequency>([
  "always",
  "hourly",
  "daily",
  "weekly",
  "monthly",
  "yearly",
  "never",
]);

const toSitemapFrequency = (value: string): SitemapFrequency =>
  sitemapFrequencies.has(value as SitemapFrequency)
    ? (value as SitemapFrequency)
    : "monthly";

export const getSiteRoutes = cache(async (): Promise<SiteRoute[]> => {
  try {
    const routes = await prisma.siteRoute.findMany({
      orderBy: [{ order: "asc" }, { id: "asc" }],
      include: {
        translations: true,
      },
    });

    return normalizeSiteRoutes(
      routes
        .filter((route) => isSiteRouteId(route.id))
        .map((route) => ({
          id: route.id as SiteRoute["id"],
          label: route.label,
          labelEn: route.labelEn,
          slug: route.slug,
          slugEn: route.slugEn,
          translations: Object.fromEntries(
            route.translations.map((translation) => [
              translation.locale,
              {
                label: translation.label,
                slug: translation.slug,
              },
            ]),
          ),
          order: route.order,
          internalSegment:
            defaultSiteRoutes.find((item) => item.id === route.id)?.internalSegment ?? "",
          showInHeader: route.showInHeader,
          showInFooter: route.showInFooter,
          includeInSitemap: route.includeInSitemap,
          sitemapPriority: route.sitemapPriority,
          sitemapFrequency: toSitemapFrequency(route.sitemapFrequency),
        })),
    );
  } catch {
    return defaultSiteRoutes;
  }
});
