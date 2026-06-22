import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ContactForm from "@/components/sections/ContactForm/ContactForm";
import { colors } from "@/app/theme/tokens";
import { getTranslations, t } from "@/lib/i18n";
import { resolveLocale } from "@/lib/i18n-config";
import type { Metadata } from "next";
import { createRouteMetadata } from "@/lib/seo-pages";
import RouteBreadcrumbJsonLd from "@/components/seo/RouteBreadcrumbJsonLd";

export const generateMetadata = async ({
  params,
}: {
  params?: Promise<{ locale?: string }>;
}): Promise<Metadata> =>
  createRouteMetadata(resolveLocale((await params)?.locale), "contact");

const ContactPage = async ({
  params,
}: {
  params?: Promise<{ locale?: string }>;
}) => {
  const locale = resolveLocale((await params)?.locale);
  const translations = await getTranslations(locale);

  return (
    <>
      <RouteBreadcrumbJsonLd locale={locale} route="contact" label="Contact" />
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          px: { xs: 2, md: 4 },
          borderBottom: `1px solid ${colors.blueGray}`,
        }}
      >
        <Box sx={{ maxWidth: 1200, mx: "auto" }}>
          <Typography variant="subtitle2" sx={{ mb: 3, color: colors.green }}>
            {t(translations, "contact.page.eyebrow", "Nous contacter")}
          </Typography>
          <Typography variant="h1" sx={{ maxWidth: 600 }}>
            {t(
              translations,
              "contact.page.heading",
              "Parlons de votre projet.",
            )}
          </Typography>
        </Box>
      </Box>

      <ContactForm />
      <Box
        component="address"
        sx={{
          maxWidth: 1200,
          mx: "auto",
          px: { xs: 2, md: 4 },
          pb: { xs: 8, md: 12 },
          fontStyle: "normal",
        }}
      >
        <Typography variant="h2" sx={{ mb: 2 }}>
          Studio Volante, Paris
        </Typography>
        <Typography variant="body1">
          <a href="mailto:yasmine@studio-volante.fr">yasmine@studio-volante.fr</a>
        </Typography>
        <Typography variant="body1">
          <a href="mailto:william@studio-volante.fr">william@studio-volante.fr</a>
        </Typography>
        {process.env.NEXT_PUBLIC_STUDIO_ADDRESS_LABEL && (
          <Typography variant="body1">
            {process.env.NEXT_PUBLIC_STUDIO_ADDRESS_LABEL}
          </Typography>
        )}
        {process.env.NEXT_PUBLIC_STUDIO_PHONE && (
          <Typography variant="body1">
            <a href={`tel:${process.env.NEXT_PUBLIC_STUDIO_PHONE}`}>
              {process.env.NEXT_PUBLIC_STUDIO_PHONE}
            </a>
          </Typography>
        )}
      </Box>
    </>
  );
};

export default ContactPage;
