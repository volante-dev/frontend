"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@/components/ui/Button/Button";
import Link from "next/link";
import { colors } from "@/app/theme/tokens";
import { useI18n } from "@/components/providers/I18nProvider/I18nProvider";
import type { HomeHeroContent } from "@/lib/home-hero-content";

const Hero = ({ content }: { content: HomeHeroContent }) => {
  const { localizedHref } = useI18n();
  return (
    <Box
      component="section"
      data-testid="hero"
      data-scroll-anchor="post-hero"
      sx={{
        minHeight: "90vh",
        display: "flex",
        alignItems: "center",
        px: { xs: 2, md: 4 },
        py: { xs: 8, md: 12 },
        borderBottom: `1px solid ${colors.blueGray}`,
      }}
    >
      <Box sx={{ maxWidth: 1200, mx: "auto", width: "100%" }}>
        <Typography variant="subtitle2" sx={{ mb: 3, color: colors.green }}>
          {content.eyebrow}
        </Typography>

        <Typography variant="h1" sx={{ mb: 4, maxWidth: 800 }}>
          {content.title}
        </Typography>

        <Typography variant="subtitle1" sx={{ mb: 6, maxWidth: 560 }}>
          {content.subheading}
        </Typography>

        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Button
            variant="contained"
            size="large"
            component={Link}
            href={localizedHref("portfolio")}
            data-testid="hero-cta-portfolio"
          >
            {content.primaryCtaLabel}
          </Button>
          <Button
            variant="outlined"
            size="large"
            component={Link}
            href={localizedHref("contact")}
          >
            {content.secondaryCtaLabel}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Hero;
