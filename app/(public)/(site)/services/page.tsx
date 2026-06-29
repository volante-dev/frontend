import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ServicesList from "@/components/sections/ServicesList/ServicesList";
import ServicesContactCta from "@/components/sections/ServicesContactCta/ServicesContactCta";
import { colors } from "@/app/theme/tokens";
import prisma from "@/lib/prisma";
import { getTranslations, t } from "@/lib/i18n";
import { getPageHeaderContent } from "@/lib/page-header-content";
import { resolveLocale } from "@/lib/i18n-config";
import type { Metadata } from "next";
import { createRouteMetadata } from "@/lib/seo-pages";
import { getLocalizedRouteHref } from "@/lib/site-route-config";
import { getSiteRoutes } from "@/lib/site-routes";
import RouteBreadcrumbJsonLd from "@/components/seo/RouteBreadcrumbJsonLd";
import { localizedTranslationField } from "@/lib/content-translations";

export const dynamic = "force-dynamic";

export const generateMetadata = async ({
  params,
}: {
  params?: Promise<{ locale?: string }>;
}): Promise<Metadata> =>
  createRouteMetadata(resolveLocale((await params)?.locale), "services");

const ServicesPage = async ({
  params,
}: {
  params?: Promise<{ locale?: string }>;
}) => {
  const locale = resolveLocale((await params)?.locale);

  const [rawServices, translations, siteRoutes] = await Promise.all([
    prisma.service
      .findMany({
        where: { active: true },
        orderBy: { order: "asc" },
        include: {
          translations: true,
          portfolioExamples: {
            orderBy: { order: "asc" },
            include: {
              project: {
                select: {
                  id: true,
                  title: true,
                  titleEn: true,
                  translations: true,
                  slug: true,
                  imageUrl: true,
                  imageAsset: { select: { mediaType: true, posterUrl: true } },
                  publishedAt: true,
                },
              },
            },
          },
        },
      })
      .catch(() => []),
    getTranslations(locale),
    getSiteRoutes(),
  ]);
  const pageHeader = await getPageHeaderContent("services", locale, translations);

  const services = rawServices.map((s) => ({
    ...s,
    title: localizedTranslationField(
      s.translations,
      locale,
      "title",
      s.title,
      s.titleEn,
    ),
    description: localizedTranslationField(
      s.translations,
      locale,
      "descriptionHtml",
      s.descriptionHtml ?? `<p>${s.description}</p>`,
      s.descriptionHtmlEn ?? s.descriptionEn,
    ),
    portfolioExamples: s.portfolioExamples
      .filter((example) => example.project.publishedAt)
      .map((example) => ({
        id: example.project.id,
        title: localizedTranslationField(
          example.project.translations,
          locale,
          "title",
          example.project.title,
          example.project.titleEn,
        ),
        slug: example.project.slug,
        imageUrl: example.project.imageUrl,
        coverMediaType: example.project.imageAsset?.mediaType ?? null,
        coverPosterUrl: example.project.imageAsset?.posterUrl ?? null,
      })),
  }));

  return (
    <>
      <RouteBreadcrumbJsonLd
        locale={locale}
        route="services"
        label={locale === "en" ? "Services" : "Services"}
      />
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          px: { xs: 2, md: 4 },
          borderBottom: `1px solid ${colors.blueGray}`,
        }}
      >
        <Box sx={{ maxWidth: 1200, mx: "auto" }}>
          <Typography variant="subtitle2" sx={{ mb: 3, color: colors.green }}>
            {pageHeader.eyebrow}
          </Typography>
          <Typography variant="h1" sx={{ maxWidth: 700 }}>
            {pageHeader.title}
          </Typography>
        </Box>
      </Box>

      <ServicesList services={services} />
      <ServicesContactCta
        href={getLocalizedRouteHref(siteRoutes, locale, "contact")}
        label={t(translations, "hero.cta.contact", "Travailler ensemble")}
      />
    </>
  );
};

export default ServicesPage;
