import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { Metadata } from "next";
import { colors } from "@/app/theme/tokens";

export const metadata: Metadata = {
  title: "Studio Volante — Bientôt",
  description: "Quelque chose de beau est en préparation.",
};

const ComingSoonPage = () => (
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
    {/* Ligne de séparation décorative — verte, positionnée en bas */}
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
        sx={{
          fontSize: { xs: "0.75rem", md: "0.8125rem" },
          fontWeight: 600,
          letterSpacing: "0.1em",
          color: colors.mutedBlack,
        }}
      >
        STUDIO VOLANTE
      </Typography>

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
        }}
      >
        Quelque chose
        <br />
        de beau
        <br />
        se prépare.
      </Typography>

      <Typography
        variant="subtitle1"
        sx={{
          fontSize: { xs: "0.875rem", md: "1rem" },
          color: colors.mutedBlackLight,
          maxWidth: 400,
        }}
      >
        Agence de communication créative.
        <br />
        Le studio ouvre bientôt ses portes.
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
      <Typography
        variant="caption"
        sx={{
          fontSize: "0.75rem",
          letterSpacing: "0.04em",
          color: colors.mutedBlackLight,
        }}
      >
        bonjour@studiovolante.fr
      </Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            width: 32,
            height: "1px",
            backgroundColor: colors.green,
          }}
        />
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
          Bientôt
        </Typography>
      </Box>
    </Box>
  </Box>
);

export default ComingSoonPage;
