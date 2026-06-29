import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PortfolioMasonry from "@/components/sections/ProjectGrid/PortfolioMasonry";
import PortfolioDockFilters from "@/components/sections/ProjectGrid/PortfolioDockFilters";
import prisma from "@/lib/prisma";
import { getTranslations, localizeField } from "@/lib/i18n";
import { getPageHeaderContent } from "@/lib/page-header-content";
import { resolveLocale } from "@/lib/i18n-config";
import type { Locale } from "@/lib/i18n-config";
import { createPageMetadata } from "@/lib/seo";
import { createRouteMetadata } from "@/lib/seo-pages";
import { portfolioSectorPath } from "@/lib/portfolio-routes";
import RouteBreadcrumbJsonLd from "@/components/seo/RouteBreadcrumbJsonLd";

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

const localizeNullableField = (
  base: string | null | undefined,
  translated: string | null | undefined,
  locale: Locale,
) => {
  const normalizedBase = base?.trim();
  if (!normalizedBase) return null;
  return localizeField(normalizedBase, translated, locale);
};

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
        slug: sectorSlug,
      },
    })
    .catch(() => null);

  if (!sector) return null;

  return {
    ...sector,
    localizedLabel: localizeField(sector.label, sector.labelEn, locale),
  };
};

const getSectorIntroOverride = (
  sector: Awaited<ReturnType<typeof getActiveSector>>,
  locale: Locale,
): PortfolioIntroContent | null => {
  if (!sector?.introEyebrow?.trim() || !sector.introTitle?.trim()) return null;

  return {
    eyebrow: localizeField(sector.introEyebrow.trim(), sector.introEyebrowEn, locale),
    title: localizeField(sector.introTitle.trim(), sector.introTitleEn, locale),
    intro: localizeNullableField(sector.intro, sector.introEn, locale),
  };
};

export const generatePortfolioMetadata = async ({
  params,
}: PortfolioPageParams): Promise<Metadata> => {
  const { locale, sectorSlug } = await getLocaleAndSectorSlug(params);

  if (!sectorSlug) return createRouteMetadata(locale, "portfolio");

  const [translations, sector] = await Promise.all([
    getTranslations(locale),
    getActiveSector(sectorSlug, locale),
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
    pathname: portfolioSectorPath(locale, sector.slug ?? sectorSlug),
    alternatePathname: portfolioSectorPath(otherLocale, sector.slug ?? sectorSlug),
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
          sectorEntry: true,
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
      })
      .catch(() => []),
  ]);
  const pageHeader = await getPageHeaderContent("portfolio", locale, translations);
  const sectorIntro = getSectorIntroOverride(activeSector, locale);
  const introHeader = sectorIntro ?? pageHeader;

  const sectors = rawSectors.map((sector) => ({
    id: sector.id,
    label: localizeField(sector.label, sector.labelEn, locale),
    slug: sector.slug ?? "",
    icon: sector.icon,
  }));

  const projects = rawProjects.map(({ imageAsset, ...p }) => ({
    ...p,
    title: localizeField(p.title, p.titleEn, locale),
    description: localizeField(p.description, p.descriptionEn, locale),
    sector:
      (p.sectorEntry
        ? localizeField(p.sectorEntry.label, p.sectorEntry.labelEn, locale)
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
