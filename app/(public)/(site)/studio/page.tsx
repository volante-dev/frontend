import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { colors } from "@/app/theme/tokens";
import { headers } from "next/headers";
import { getTranslations, defaultLocale, t } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

export const metadata = {
  title: "Studio — Studio Volante",
};

const StudioPage = async () => {
  const headersList = await headers();
  const locale = (headersList.get("x-locale") ?? defaultLocale) as Locale;
  const translations = await getTranslations(locale);

  const defaultValues = [
    {
      title: "Exigence",
      description:
        "Chaque projet est traité avec la même rigueur, qu'il s'agisse d'une carte de visite ou d'une campagne nationale.",
    },
    {
      title: "Clarté",
      description:
        "Nous simplifions le complexe. Une bonne communication est d'abord une communication compréhensible.",
    },
    {
      title: "Durabilité",
      description:
        "Nous concevons des identités qui vieillissent bien et des messages qui restent pertinents dans le temps.",
    },
  ];

  // Lit studio.values.0, .1, .2… tant que l'index existe dans Edge Config
  const values: { key: string; title: string; description: string }[] = [];
  for (let i = 0; translations[`studio.values.${i}.title`]; i++) {
    values.push({
      key: String(i),
      title: translations[`studio.values.${i}.title`],
      description: t(translations, `studio.values.${i}.description`),
    });
  }
  if (values.length === 0) {
    defaultValues.forEach((value, i) => values.push({ key: String(i), ...value }));
  }

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
            {t(translations, "studio.page.eyebrow", "Qui sommes-nous")}
          </Typography>
          <Typography variant="h1" sx={{ maxWidth: 700 }}>
            {t(translations, "studio.page.heading", "Un studio indépendant, une vision singulière.")}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          py: { xs: 8, md: 12 },
          px: { xs: 2, md: 4 },
          borderBottom: `1px solid ${colors.blueGray}`,
        }}
      >
        <Box
          sx={{
            maxWidth: 1200,
            mx: "auto",
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: { xs: 4, md: 8 },
          }}
        >
          <Typography variant="h2">
            {t(translations, "studio.history.heading", "Notre histoire")}
          </Typography>
          <Box>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {t(translations, "studio.history.body1", "Studio Volante est né de la conviction que la communication doit être aussi bien pensée qu'elle est belle. Fondé par des créatifs passionnés, le studio accompagne des marques de toutes tailles dans la construction d'une identité forte et cohérente.")}
            </Typography>
            <Typography variant="body1">
              {t(translations, "studio.history.body2", "Notre approche est toujours stratégique avant d'être esthétique : comprendre le positionnement, les cibles, les ambitions — puis créer.")}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ py: { xs: 8, md: 12 }, px: { xs: 2, md: 4 } }}>
        <Box sx={{ maxWidth: 1200, mx: "auto" }}>
          <Typography variant="subtitle2" sx={{ mb: 6, color: colors.green }}>
            {t(translations, "studio.values.heading", "Nos valeurs")}
          </Typography>
          {values.map((value, i) => (
            <Box key={value.key}>
              {i > 0 && <Divider />}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 2fr" },
                  gap: { xs: 2, md: 6 },
                  py: { xs: 4, md: 5 },
                }}
              >
                <Typography variant="h3">{value.title}</Typography>
                <Typography variant="body1">{value.description}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </>
  );
};

export default StudioPage;
