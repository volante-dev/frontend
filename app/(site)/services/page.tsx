import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ServicesList from "@/components/sections/ServicesList/ServicesList";
import ContactForm from "@/components/sections/ContactForm/ContactForm";
import { colors } from "@/app/theme/tokens";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { getTranslations, localizeField, defaultLocale, t } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Services — Studio Volante",
};

const ServicesPage = async () => {
  const headersList = await headers();
  const locale = (headersList.get("x-locale") ?? defaultLocale) as Locale;

  const [rawServices, translations] = await Promise.all([
    prisma.service
      .findMany({ where: { active: true }, orderBy: { order: "asc" } })
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

      <ServicesList services={services} translations={translations} />
      <ContactForm translations={translations} />
    </>
  );
};

export default ServicesPage;
