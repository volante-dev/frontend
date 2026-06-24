import PortfolioMasonry from "@/components/sections/ProjectGrid/PortfolioMasonry";
import prisma from "@/lib/prisma";
import { getTranslations } from "@/lib/i18n";
import { getPageHeaderContent } from "@/lib/page-header-content";
import { resolveLocale } from "@/lib/i18n-config";
import type { Metadata } from "next";
import { createRouteMetadata } from "@/lib/seo-pages";
import RouteBreadcrumbJsonLd from "@/components/seo/RouteBreadcrumbJsonLd";

export const dynamic = "force-dynamic";

const inferMediaTypeFromUrl = (value: string) =>
  /\.(mp4|mov|webm)(?:[?#].*)?$/i.test(value) ? "VIDEO" : "IMAGE";

export const generateMetadata = async ({
  params,
}: {
  params?: Promise<{ locale?: string }>;
}): Promise<Metadata> =>
  createRouteMetadata(resolveLocale((await params)?.locale), "portfolio");

const PortfolioPage = async ({
  params,
}: {
  params?: Promise<{ locale?: string }>;
}) => {
  const locale = resolveLocale((await params)?.locale);

  const [rawProjects, translations] = await Promise.all([
    prisma.project
      .findMany({
        where: { publishedAt: { not: null } },
        orderBy: [
          { portfolioOrder: "asc" },
          { publishedAt: "asc" },
          { id: "asc" },
        ],
        include: {
          imageAsset: { select: { mediaType: true, posterUrl: true } },
        },
      })
      .catch(() => []),
    getTranslations(locale),
  ]);
  const pageHeader = await getPageHeaderContent("portfolio", locale, translations);

  const projects = rawProjects.map(({ imageAsset, ...p }) => ({
    ...p,
    title: locale === "en" && p.titleEn ? p.titleEn : p.title,
    description:
      locale === "en" && p.descriptionEn ? p.descriptionEn : p.description,
    coverMediaType: imageAsset?.mediaType ?? inferMediaTypeFromUrl(p.imageUrl),
    coverPosterUrl: imageAsset?.posterUrl ?? null,
  }));

  return (
    <>
      <RouteBreadcrumbJsonLd locale={locale} route="portfolio" label="Portfolio" />
      <PortfolioMasonry projects={projects} header={pageHeader} />
    </>
  );
};

export default PortfolioPage;
