import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import PortfolioMasonry from "@/components/sections/ProjectGrid/PortfolioMasonry";
import { colors } from "@/app/theme/tokens";
import prisma from "@/lib/prisma";
import { getTranslations, t } from "@/lib/i18n";
import { resolveLocale } from "@/lib/i18n-config";
import type { Metadata } from "next";
import { createRouteMetadata } from "@/lib/seo-pages";
import RouteBreadcrumbJsonLd from "@/components/seo/RouteBreadcrumbJsonLd";

export const dynamic = "force-dynamic";

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
      })
      .catch(() => []),
    getTranslations(locale),
  ]);

  const projects = rawProjects.map((p) => ({
    ...p,
    title: locale === "en" && p.titleEn ? p.titleEn : p.title,
    description:
      locale === "en" && p.descriptionEn ? p.descriptionEn : p.description,
  }));

  return (
    <>
      <RouteBreadcrumbJsonLd locale={locale} route="portfolio" label="Portfolio" />
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          px: { xs: 2, md: 4 },
        }}
      >
        <Box sx={{ maxWidth: 1200, mx: "auto" }}>
          <Typography variant="subtitle2" sx={{ mb: 3, color: colors.green }}>
            {t(translations, "portfolio.page.eyebrow", "Nos réalisations")}
          </Typography>
          <Typography variant="h1" sx={{ maxWidth: 700 }}>
            {t(translations, "portfolio.page.heading", "Des projets construits avec exigence.")}
          </Typography>
        </Box>
      </Box>

      <PortfolioMasonry projects={projects} />
    </>
  );
};

export default PortfolioPage;
