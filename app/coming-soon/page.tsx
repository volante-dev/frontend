import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { colors } from "@/app/theme/tokens";
import { getTranslations, t, defaultLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Studio Volante",
  description: "Quelque chose de beau est en préparation.",
  robots: { index: false, follow: false, noarchive: true },
};

const ComingSoonPage = async () => {
  const headersList = await headers();
  const locale = (headersList.get("x-locale") ?? defaultLocale) as Locale;
  const tr = await getTranslations(locale);

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: colors.offWhite,
        position: "relative",
        px: { xs: 3, md: 6 },
        py: { xs: 4, md: 5 },
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* Ligne de séparation décorative */}
      <Box
        sx={{
          position: "absolute",
          bottom: { xs: 88, md: 96 },
          left: { xs: 24, md: 48 },
          right: { xs: 24, md: 48 },
          height: "1px",
          backgroundColor: colors.blueGray,
        }}
      />

      {/* En-tête */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <Typography
          variant="h6"
          component="p"
          sx={{
            fontSize: { xs: "0.75rem", md: "0.8125rem" },
            fontWeight: 600,
            letterSpacing: "0.1em",
            color: colors.mutedBlack,
          }}
        >
          STUDIO VOLANTE
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography
            variant="caption"
            sx={{
              fontSize: "0.75rem",
              letterSpacing: "0.04em",
              color: colors.mutedBlackLight,
            }}
          >
            {new Date().getFullYear()}
          </Typography>
          <Box
            component="a"
            href={locale === "fr" ? "?lang=en" : "?lang=fr"}
            sx={{
              color: colors.mutedBlackLight,
              fontSize: "0.75rem",
              fontWeight: 500,
              letterSpacing: "0.06em",
              textDecoration: "none",
              "&:hover": { color: colors.mutedBlack },
            }}
          >
            {locale === "fr" ? "EN" : "FR"}
          </Box>
        </Box>
      </Box>

      {/* Bloc message — aligné à droite */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          textAlign: "right",
          gap: { xs: 3, md: 4 },
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "clamp(2rem, 8vw, 5rem)", md: "clamp(3rem, 6vw, 5.5rem)" },
            fontWeight: 600,
            letterSpacing: "-0.03em",
            lineHeight: 1.08,
            color: colors.mutedBlack,
            maxWidth: { xs: "100%", md: "60%" },
            whiteSpace: "pre-line",
          }}
        >
          {t(tr, "coming-soon.heading", locale === "en" ? "Something beautiful\nis on its way." : "Quelque chose de beau\nest en préparation.")}
        </Typography>

        <Typography
          variant="subtitle1"
          sx={{
            fontSize: { xs: "0.875rem", md: "1rem" },
            color: colors.mutedBlackLight,
            maxWidth: 400,
            whiteSpace: "pre-line",
          }}
        >
          {t(tr, "coming-soon.subheading", locale === "en" ? "We're putting the finishing touches on our new site." : "Nous peaufinons les derniers détails de notre nouveau site.")}
        </Typography>
      </Box>

      {/* Pied de page */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography
            variant="caption"
            sx={{ fontSize: "0.75rem", letterSpacing: "0.04em", color: colors.mutedBlackLight }}
          >
            yasmine@studio-volante.fr
          </Typography>
          <Box sx={{ width: 16, height: "1px", backgroundColor: colors.green, mx: "6px" }} />
          <Typography
            variant="caption"
            sx={{ fontSize: "0.75rem", letterSpacing: "0.04em", color: colors.mutedBlackLight }}
          >
            william@studio-volante.fr
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box sx={{ width: 32, height: "1px", backgroundColor: colors.green }} />
          <Typography
            variant="caption"
            sx={{
              fontSize: "0.75rem",
              fontWeight: 500,
              letterSpacing: "0.08em",
              color: colors.green,
              textTransform: "uppercase",
            }}
          >
            {t(tr, "coming-soon.soon", "BIENTÔT")}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ComingSoonPage;
