import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PortfolioMasonry from "@/components/sections/ProjectGrid/PortfolioMasonry";
import PortfolioDockFilters from "@/components/sections/ProjectGrid/PortfolioDockFilters";
import prisma from "@/lib/prisma";
import { getTranslations } from "@/lib/i18n";
import { getPageHeaderContent } from "@/lib/page-header-content";
import { resolveLocale } from "@/lib/i18n-config";
import type { Locale } from "@/lib/i18n-config";
import { createPageMetadata } from "@/lib/seo";
import { createRouteMetadata } from "@/lib/seo-pages";
import { portfolioSectorPath } from "@/lib/portfolio-routes";
import { getSiteRoutes } from "@/lib/site-routes";
import RouteBreadcrumbJsonLd from "@/components/seo/RouteBreadcrumbJsonLd";
import {
  localizedNullableTranslationField,
  localizedTranslationField,
} from "@/lib/content-translations";

type PortfolioPageParams = {
  params?: Promise<{ locale?: string; sectorSlug?: string }>;
};

type PortfolioIntroContent = {
  eyebrow: string;
  title: string;
  intro: string | null;
};

const inferMediaTypeFromUrl = (value: string) =>
  /\.(mp4|mov|webm)(?:[?#].*)?$/i.test(value) ? "VIDEO" : "IMAGE";

const getLocaleAndSectorSlug = async (params?: Promise<{ locale?: string; sectorSlug?: string }>) => {
  const resolvedParams = params ? await params : {};
  return {
    locale: resolveLocale(resolvedParams.locale),
    sectorSlug: resolvedParams.sectorSlug ?? null,
  };
};

const getActiveSector = async (sectorSlug: string, locale: Locale) => {
  const sector = await prisma.projectTaxonomyEntry
    .findFirst({
      where: {
        type: "SECTOR",
        active: true,
        OR: [
          { slug: sectorSlug },
          { translations: { some: { locale, slug: sectorSlug } } },
        ],
      },
      include: { translations: true },
    })
    .catch(() => null);

  if (!sector) return null;

  return {
    ...sector,
    localizedLabel: localizedTranslationField(
      sector.translations,
      locale,
      "label",
      sector.label,
      sector.labelEn,
    ),
    localizedSlug: localizedTranslationField(
      sector.translations,
      locale,
      "slug",
      sector.slug ?? "",
      sector.slug,
    ),
  };
};

const getSectorIntroOverride = (
  sector: Awaited<ReturnType<typeof getActiveSector>>,
  locale: Locale,
): PortfolioIntroContent | null => {
  if (!sector?.introEyebrow?.trim() || !sector.introTitle?.trim()) return null;

  return {
    eyebrow: localizedTranslationField(
      sector.translations,
      locale,
      "introEyebrow",
      sector.introEyebrow.trim(),
      sector.introEyebrowEn,
    ),
    title: localizedTranslationField(
      sector.translations,
      locale,
      "introTitle",
      sector.introTitle.trim(),
      sector.introTitleEn,
    ),
    intro: localizedNullableTranslationField(
      sector.translations,
      locale,
      "intro",
      sector.intro,
      sector.introEn,
    ),
  };
};

export const generatePortfolioMetadata = async ({
  params,
}: PortfolioPageParams): Promise<Metadata> => {
  const { locale, sectorSlug } = await getLocaleAndSectorSlug(params);

  if (!sectorSlug) return createRouteMetadata(locale, "portfolio");

  const [translations, sector, siteRoutes] = await Promise.all([
    getTranslations(locale),
    getActiveSector(sectorSlug, locale),
    getSiteRoutes(),
  ]);
  if (!sector) notFound();

  const pageHeader = await getPageHeaderContent("portfolio", locale, translations);
  const sectorIntro = getSectorIntroOverride(sector, locale);
  const otherLocale: Locale = locale === "fr" ? "en" : "fr";
  const title = `Portfolio - ${sector.localizedLabel}`;
  const description =
    sectorIntro?.intro ??
    pageHeader.intro ??
    (locale === "en"
      ? `Explore Studio Volante's selected work in ${sector.localizedLabel}.`
      : `Découvrez les réalisations de Studio Volante dans le secteur ${sector.localizedLabel}.`);

  return createPageMetadata({
    locale,
    pathname: portfolioSectorPath(locale, sector.localizedSlug || sectorSlug, siteRoutes),
    alternatePathname: portfolioSectorPath(
      otherLocale,
      sector.slug ?? sectorSlug,
      siteRoutes,
    ),
    title,
    description,
  });
};

export const PortfolioPageContent = async ({ params }: PortfolioPageParams) => {
  const { locale, sectorSlug } = await getLocaleAndSectorSlug(params);

  const [translations, activeSector] = await Promise.all([
    getTranslations(locale),
    sectorSlug ? getActiveSector(sectorSlug, locale) : Promise.resolve(null),
  ]);

  if (sectorSlug && !activeSector) notFound();

  const [rawProjects, rawSectors] = await Promise.all([
    prisma.project
      .findMany({
        where: {
          publishedAt: { not: null },
          ...(activeSector ? { sectorEntryId: activeSector.id } : {}),
        },
        orderBy: [
          { portfolioOrder: "asc" },
          { publishedAt: "asc" },
          { id: "asc" },
        ],
        include: {
          sectorEntry: { include: { translations: true } },
          translations: true,
          imageAsset: { select: { mediaType: true, posterUrl: true } },
        },
      })
      .catch(() => []),
    prisma.projectTaxonomyEntry
      .findMany({
        where: {
          type: "SECTOR",
          active: true,
          slug: { not: null },
          sectorProjects: { some: { publishedAt: { not: null } } },
        },
        orderBy: [{ label: "asc" }, { id: "asc" }],
        include: { translations: true },
      })
      .catch(() => []),
  ]);
  const pageHeader = await getPageHeaderContent("portfolio", locale, translations);
  const sectorIntro = getSectorIntroOverride(activeSector, locale);
  const introHeader = sectorIntro ?? pageHeader;

  const sectors = rawSectors.map((sector) => ({
    id: sector.id,
    label: localizedTranslationField(
      sector.translations,
      locale,
      "label",
      sector.label,
      sector.labelEn,
    ),
    slug: localizedTranslationField(
      sector.translations,
      locale,
      "slug",
      sector.slug ?? "",
      sector.slug,
    ),
    icon: sector.icon,
  }));

  const projects = rawProjects.map(({ imageAsset, ...p }) => ({
    ...p,
    title: localizedTranslationField(
      p.translations,
      locale,
      "title",
      p.title,
      p.titleEn,
    ),
    description: localizedTranslationField(
      p.translations,
      locale,
      "description",
      p.description,
      p.descriptionEn,
    ),
    sector:
      (p.sectorEntry
        ? localizedTranslationField(
            p.sectorEntry.translations,
            locale,
            "label",
            p.sectorEntry.label,
            p.sectorEntry.labelEn,
          )
        : "") || null,
    coverMediaType: imageAsset?.mediaType ?? inferMediaTypeFromUrl(p.imageUrl),
    coverPosterUrl: imageAsset?.posterUrl ?? null,
  }));

  return (
    <>
      <RouteBreadcrumbJsonLd locale={locale} route="portfolio" label="Portfolio" />
      <PortfolioDockFilters
        locale={locale}
        sectors={sectors}
        activeSectorSlug={activeSector?.slug ?? null}
      />
      <PortfolioMasonry projects={projects} header={introHeader} />
    </>
  );
};
