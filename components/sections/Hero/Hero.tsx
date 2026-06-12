"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@/components/ui/Button/Button";
import Link from "next/link";
import { colors } from "@/app/theme/tokens";
import type { Translations } from "@/lib/i18n";
import { t } from "@/lib/i18n";

interface HeroProps {
  translations?: Translations;
}

const Hero = ({ translations = {} }: HeroProps) => {
  return (
  <Box
    component="section"
    data-testid="hero"
    sx={{
      minHeight: "90vh",
      display: "flex",
      alignItems: "center",
      px: { xs: 2, md: 4 },
      py: { xs: 8, md: 12 },
      borderBottom: `1px solid ${colors.blueGray}`,
      scrollSnapAlign: "start",
    }}
  >
    <Box sx={{ maxWidth: 1200, mx: "auto", width: "100%" }}>
      <Typography variant="subtitle2" sx={{ mb: 3, color: colors.green }}>
        {t(translations, "hero.eyebrow", "Agence de communication créative")}
      </Typography>

      <Typography variant="h1" sx={{ mb: 4, maxWidth: 800 }}>
        {t(translations, "hero.heading", "Nous donnons vie aux idées qui méritent d\'exister.")}
      </Typography>

      <Typography variant="subtitle1" sx={{ mb: 6, maxWidth: 560 }}>
        {t(
          translations,
          "hero.subheading",
          "Studio Volante accompagne les marques ambitieuses dans leur communication — identité visuelle, stratégie de contenu, direction artistique."
        )}
      </Typography>

      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        <Button
          variant="contained"
          size="large"
          component={Link}
          href="/portfolio"
          data-testid="hero-cta-portfolio"
        >
          {t(translations, "hero.cta.portfolio", "Voir nos projets")}
        </Button>
        <Button variant="outlined" size="large" component={Link} href="/contact">
          {t(translations, "hero.cta.contact", "Travailler ensemble")}
        </Button>
      </Box>
    </Box>
  </Box>
)};

export default Hero;
