import type { MetadataRoute } from "next";
import prisma from "@/lib/prisma";
import { defaultLocale } from "@/lib/i18n-config";
import type { Locale } from "@/lib/i18n-config";
import { getLocalizedRouteHref } from "@/lib/site-route-config";
import { getSiteRoutes } from "@/lib/site-routes";
import { getPublishedLocaleCodes } from "@/lib/site-locales";
import { blogPostPath, projectPath, siteUrl, toAbsoluteUrl } from "@/lib/seo";
import { portfolioSectorPath } from "@/lib/portfolio-routes";
import { localizedTranslationField } from "@/lib/content-translations";

export const dynamic = "force-dynamic";

const languageAlternates = (paths: Record<Locale, string>) => ({
  languages: {
    ...Object.fromEntries(
      Object.entries(paths).map(([locale, path]) => [locale, toAbsoluteUrl(path)]),
    ),
    "x-default": toAbsoluteUrl(paths[defaultLocale]),
  },
});

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (process.env.COMING_SOON === "true") return [];

  const [siteRoutes, publishedLocales] = await Promise.all([
    getSiteRoutes(),
    getPublishedLocaleCodes(),
  ]);
  const projects = await prisma.project
    .findMany({
      where: { publishedAt: { not: null } },
      select: { slug: true, updatedAt: true, translations: true },
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
      select: {
        slug: true,
        updatedAt: true,
        translations: true,
      },
      orderBy: { updatedAt: "desc" },
    })
    .catch(() => []);

  const staticEntries = siteRoutes
    .filter((route) => route.includeInSitemap)
    .flatMap((route) => {
      const paths = Object.fromEntries(
        publishedLocales.map((locale) => [
          locale,
          getLocalizedRouteHref(siteRoutes, locale, route.id),
        ]),
      ) as Record<Locale, string>;

      return publishedLocales.map((locale) => ({
        url: new URL(paths[locale], siteUrl).toString(),
        changeFrequency: route.sitemapFrequency,
        priority: route.sitemapPriority,
        alternates: languageAlternates(paths),
      })) satisfies MetadataRoute.Sitemap;
    });

  const projectEntries = projects.flatMap((project) => {
    const paths = Object.fromEntries(
      publishedLocales.map((locale) => [
        locale,
        projectPath(
          locale,
          localizedTranslationField(
            project.translations,
            locale,
            "slug",
            project.slug,
          ),
          siteRoutes,
        ),
      ]),
    ) as Record<Locale, string>;

    return publishedLocales.map((locale) => ({
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
      publishedLocales.map((locale) => [
        locale,
        portfolioSectorPath(locale, sector.slug!, siteRoutes),
      ]),
    ) as Record<Locale, string>;

    return publishedLocales.map((locale) => ({
      url: toAbsoluteUrl(paths[locale]),
      lastModified: sector.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
      alternates: languageAlternates(paths),
    }));
  });

  const blogPostEntries = blogPosts.flatMap((post) => {
    const paths = Object.fromEntries(
      publishedLocales.map((locale) => [
        locale,
        blogPostPath(
          locale,
          localizedTranslationField(
            post.translations,
            locale,
            "slug",
            post.slug,
          ),
          siteRoutes,
        ),
      ]),
    ) as Record<Locale, string>;

    return publishedLocales.map((locale) => ({
      url: toAbsoluteUrl(paths[locale]),
      lastModified: post.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
      alternates: languageAlternates(paths),
    }));
  });

  return [...staticEntries, ...sectorEntries, ...projectEntries, ...blogPostEntries];
}
