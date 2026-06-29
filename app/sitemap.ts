import type { MetadataRoute } from "next";
import prisma from "@/lib/prisma";
import { locales } from "@/lib/i18n-config";
import type { Locale } from "@/lib/i18n-config";
import { getLocalizedRouteHref } from "@/lib/site-route-config";
import { getSiteRoutes } from "@/lib/site-routes";
import { blogPostPath, projectPath, siteUrl, toAbsoluteUrl } from "@/lib/seo";
import { portfolioSectorPath } from "@/lib/portfolio-routes";

export const dynamic = "force-dynamic";

const languageAlternates = (paths: Record<Locale, string>) => ({
  languages: {
    fr: toAbsoluteUrl(paths.fr),
    en: toAbsoluteUrl(paths.en),
    "x-default": toAbsoluteUrl(paths.fr),
  },
});

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (process.env.COMING_SOON === "true") return [];

  const siteRoutes = await getSiteRoutes();
  const projects = await prisma.project
    .findMany({
      where: { publishedAt: { not: null } },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
    })
    .catch(() => []);
  const sectors = await prisma.projectTaxonomyEntry
    .findMany({
      where: {
        type: "SECTOR",
        active: true,
        slug: { not: null },
        sectorProjects: { some: { publishedAt: { not: null } } },
      },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
    })
    .catch(() => []);
  const blogPosts = await prisma.blogPost
    .findMany({
      where: { publishedAt: { not: null } },
      select: { slug: true, slugEn: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
    })
    .catch(() => []);

  const staticEntries = siteRoutes
    .filter((route) => route.includeInSitemap)
    .flatMap((route) => {
      const paths = Object.fromEntries(
        locales.map((locale) => [
          locale,
          getLocalizedRouteHref(siteRoutes, locale, route.id),
        ]),
      ) as Record<Locale, string>;

      return locales.map((locale) => ({
        url: new URL(paths[locale], siteUrl).toString(),
        changeFrequency: route.sitemapFrequency,
        priority: route.sitemapPriority,
        alternates: languageAlternates(paths),
      })) satisfies MetadataRoute.Sitemap;
    });

  const projectEntries = projects.flatMap((project) => {
    const paths = Object.fromEntries(
      locales.map((locale) => [locale, projectPath(locale, project.slug, siteRoutes)]),
    ) as Record<Locale, string>;

    return locales.map((locale) => ({
      url: toAbsoluteUrl(paths[locale]),
      lastModified: project.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
      alternates: languageAlternates(paths),
    }));
  });

  const sectorEntries = sectors.flatMap((sector) => {
    if (!sector.slug) return [];
    const paths = Object.fromEntries(
      locales.map((locale) => [
        locale,
        portfolioSectorPath(locale, sector.slug!, siteRoutes),
      ]),
    ) as Record<Locale, string>;

    return locales.map((locale) => ({
      url: toAbsoluteUrl(paths[locale]),
      lastModified: sector.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
      alternates: languageAlternates(paths),
    }));
  });

  const blogPostEntries = blogPosts.flatMap((post) => {
    const paths: Record<Locale, string> = {
      fr: blogPostPath("fr", post.slug, siteRoutes),
      en: blogPostPath("en", post.slugEn, siteRoutes),
    };

    return locales.map((locale) => ({
      url: toAbsoluteUrl(paths[locale]),
      lastModified: post.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
      alternates: languageAlternates(paths),
    }));
  });

  return [...staticEntries, ...sectorEntries, ...projectEntries, ...blogPostEntries];
}
