import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ContactForm from "@/components/sections/ContactForm/ContactForm";
import { colors } from "@/app/theme/tokens";
import { headers } from "next/headers";
import { getTranslations, defaultLocale, t } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

export const metadata = {
  title: "Contact — Studio Volante",
};

const ContactPage = async () => {
  const headersList = await headers();
  const locale = (headersList.get("x-locale") ?? defaultLocale) as Locale;
  const translations = await getTranslations(locale);

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

      <ContactForm translations={translations} />
    </>
  );
};

export default ContactPage;
