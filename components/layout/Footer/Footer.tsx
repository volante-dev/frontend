"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Link from "next/link";
import { colors } from "@/app/theme/tokens";
import { t, getLocalizedHref } from "@/lib/i18n";
import type { Translations, Locale } from "@/lib/i18n";
import type { RouteKey } from "@/lib/i18n";

interface FooterProps {
  translations?: Translations;
  locale?: Locale;
}

const navRoutes: { key: RouteKey; label: string }[] = [
  { key: "services", label: "Services" },
  { key: "portfolio", label: "Portfolio" },
  { key: "studio", label: "Studio" },
  { key: "contact", label: "Contact" },
];

const Footer = ({ translations = {}, locale = "fr" }: FooterProps) => (
  <Box
    component="footer"
    sx={{
      borderTop: `1px solid ${colors.blueGray}`,
      backgroundColor: colors.offWhite,
      py: 6,
      px: { xs: 2, md: 4 },
    }}
  >
    <Box
      sx={{
        maxWidth: 1200,
        mx: "auto",
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "2fr 1fr 1fr" },
        gap: 4,
        mb: 4,
      }}
    >
      <Box>
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, fontSize: "1rem", letterSpacing: "0.08em", mb: 1.5 }}
        >
          STUDIO VOLANTE
        </Typography>
        <Typography variant="body2" sx={{ maxWidth: 320 }}>
          {t(translations, "footer.tagline", "Agence de communication créative. Nous donnons vie aux idées qui comptent.")}
        </Typography>
      </Box>

      <Box>
        <Typography variant="subtitle2" gutterBottom>
          {t(translations, "footer.nav.heading", "Navigation")}
        </Typography>
        {navRoutes.map(({ key, label }) => (
          <Typography key={key} variant="body2" sx={{ mb: 0.5 }}>
            <Box
              component={Link}
              href={getLocalizedHref(locale, key)}
              sx={{
                color: "inherit",
                textDecoration: "none",
                "&:hover": { color: colors.green },
              }}
            >
              {label}
            </Box>
          </Typography>
        ))}
      </Box>

      <Box>
        <Typography variant="subtitle2" gutterBottom>
          {t(translations, "footer.contact.heading", "Contact")}
        </Typography>
        <Typography variant="body2">yasmine@studio-volante.fr</Typography>
      </Box>
    </Box>

    <Divider sx={{ mb: 3 }} />

    <Box
      sx={{
        maxWidth: 1200,
        mx: "auto",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 1,
      }}
    >
      <Typography variant="caption">
      © {new Date().getFullYear()} {t(translations, "footer.copyright", "Studio Volante. Tous droits réservés.")}
      </Typography>
      <Typography variant="caption">
        {t(translations, "footer.madeIn", "Fait avec soin à Paris")}
      </Typography>
    </Box>
  </Box>
);

export default Footer;
