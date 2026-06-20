import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ServicesList from "@/components/sections/ServicesList/ServicesList";
import ContactForm from "@/components/sections/ContactForm/ContactForm";
import { colors } from "@/app/theme/tokens";
import prisma from "@/lib/prisma";
import { getTranslations, localizeField, t } from "@/lib/i18n";
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
  createRouteMetadata(resolveLocale((await params)?.locale), "services");

const ServicesPage = async ({
  params,
}: {
  params?: Promise<{ locale?: string }>;
}) => {
  const locale = resolveLocale((await params)?.locale);

  const [rawServices, translations] = await Promise.all([
    prisma.service
      .findMany({
        where: { active: true },
        orderBy: { order: "asc" },
      })
      .catch(() => []),
    getTranslations(locale),
  ]);

  const services = rawServices.map((s) => ({
    ...s,
    title: localizeField(s.title, s.titleEn, locale),
    description: localizeField(s.description, s.descriptionEn, locale),
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
            {t(translations, "services.page.eyebrow", "Notre expertise")}
          </Typography>
          <Typography variant="h1" sx={{ maxWidth: 700 }}>
            {t(translations, "services.page.heading", "Des services pensés pour faire rayonner votre marque.")}
          </Typography>
        </Box>
      </Box>

      <ServicesList services={services} />
      <ContactForm />
    </>
  );
};

export default ServicesPage;
