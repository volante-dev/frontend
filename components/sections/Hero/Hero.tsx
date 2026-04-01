"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@/components/ui/Button/Button";
import Link from "next/link";
import { colors } from "@/app/theme/tokens";

const Hero = () => (
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
    }}
  >
    <Box sx={{ maxWidth: 1200, mx: "auto", width: "100%" }}>
      <Typography variant="subtitle2" sx={{ mb: 3, color: colors.green }}>
        Agence de communication créative
      </Typography>

      <Typography variant="h1" sx={{ mb: 4, maxWidth: 800 }}>
        Nous donnons vie aux idées qui méritent d&apos;exister.
      </Typography>

      <Typography variant="subtitle1" sx={{ mb: 6, maxWidth: 560 }}>
        Studio Volante accompagne les marques ambitieuses dans leur communication — identité
        visuelle, stratégie de contenu, direction artistique.
      </Typography>

      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        <Button
          variant="contained"
          size="large"
          component={Link}
          href="/portfolio"
          data-testid="hero-cta-portfolio"
        >
          Voir nos projets
        </Button>
        <Button variant="outlined" size="large" component={Link} href="/contact">
          Travailler ensemble
        </Button>
      </Box>
    </Box>
  </Box>
);

export default Hero;
