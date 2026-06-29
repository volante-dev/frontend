import type { MetadataRoute } from "next";
import prisma from "@/lib/prisma";
import { getLocalizedHref } from "@/lib/i18n-routes";
import { locales } from "@/lib/i18n-config";
import type { Locale } from "@/lib/i18n-config";
import type { RouteKey } from "@/lib/i18n-routes";
import { projectPath, siteUrl, toAbsoluteUrl } from "@/lib/seo";
import { portfolioSectorPath } from "@/lib/portfolio-routes";

export const dynamic = "force-dynamic";

const staticRoutes: Array<{ key: RouteKey; priority: number }> = [
  { key: "home", priority: 1 },
  { key: "services", priority: 0.8 },
  { key: "portfolio", priority: 0.9 },
  { key: "studio", priority: 0.7 },
  { key: "contact", priority: 0.6 },
];

const languageAlternates = (paths: Record<Locale, string>) => ({
  languages: {
    fr: toAbsoluteUrl(paths.fr),
    en: toAbsoluteUrl(paths.en),
    "x-default": toAbsoluteUrl(paths.fr),
  },
});

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (process.env.COMING_SOON === "true") return [];

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

  const staticEntries = staticRoutes.flatMap(({ key, priority }) => {
    const paths = Object.fromEntries(
      locales.map((locale) => [locale, getLocalizedHref(locale, key)]),
    ) as Record<Locale, string>;

    return locales.map((locale) => ({
      url: new URL(paths[locale], siteUrl).toString(),
      changeFrequency: key === "home" ? "weekly" : "monthly",
      priority,
      alternates: languageAlternates(paths),
    })) satisfies MetadataRoute.Sitemap;
  });

  const projectEntries = projects.flatMap((project) => {
    const paths = Object.fromEntries(
      locales.map((locale) => [locale, projectPath(locale, project.slug)]),
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
      locales.map((locale) => [locale, portfolioSectorPath(locale, sector.slug!)]),
    ) as Record<Locale, string>;

    return locales.map((locale) => ({
      url: toAbsoluteUrl(paths[locale]),
      lastModified: sector.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
      alternates: languageAlternates(paths),
    }));
  });

  return [...staticEntries, ...sectorEntries, ...projectEntries];
}
