import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { colors } from "@/app/theme/tokens";
import { getTranslations, localizeField, t } from "@/lib/i18n";
import { resolveLocale } from "@/lib/i18n-config";
import prisma from "@/lib/prisma";
import type { Metadata } from "next";
import { createRouteMetadata } from "@/lib/seo-pages";
import RouteBreadcrumbJsonLd from "@/components/seo/RouteBreadcrumbJsonLd";

export const dynamic = "force-dynamic";

export const generateMetadata = async ({
  params,
}: {
  params?: Promise<{ locale?: string }>;
}): Promise<Metadata> =>
  createRouteMetadata(resolveLocale((await params)?.locale), "studio");

const fallbackValues = [
  {
    id: "studio-value-exigence",
    title: "Exigence",
    titleEn: "Excellence",
    description:
      "Chaque projet est traité avec la même rigueur, qu'il s'agisse d'une carte de visite ou d'une campagne nationale.",
    descriptionEn:
      "Every project receives the same attention to detail, from a business card to a national campaign.",
  },
  {
    id: "studio-value-clarte",
    title: "Clarté",
    titleEn: "Clarity",
    description:
      "Nous simplifions le complexe. Une bonne communication est d'abord une communication compréhensible.",
    descriptionEn:
      "We make complexity simple. Good communication begins with being understood.",
  },
  {
    id: "studio-value-durabilite",
    title: "Durabilité",
    titleEn: "Durability",
    description:
      "Nous concevons des identités qui vieillissent bien et des messages qui restent pertinents dans le temps.",
    descriptionEn:
      "We design identities that age well and messages that remain relevant over time.",
  },
];

const getStudioValues = async () => {
  try {
    return await prisma.studioValue.findMany({
      where: { active: true },
      orderBy: [{ order: "asc" }, { id: "asc" }],
    });
  } catch {
    return fallbackValues;
  }
};

const StudioPage = async ({
  params,
}: {
  params?: Promise<{ locale?: string }>;
}) => {
  const locale = resolveLocale((await params)?.locale);
  const [translations, rawValues] = await Promise.all([
    getTranslations(locale),
    getStudioValues(),
  ]);
  const values = rawValues.map((value) => ({
    key: value.id,
    title: localizeField(value.title, value.titleEn, locale),
    description: localizeField(
      value.description,
      value.descriptionEn,
      locale,
    ),
  }));

  return (
    <>
      <RouteBreadcrumbJsonLd locale={locale} route="studio" label="Studio" />
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

      {values.length > 0 && (
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
      )}
    </>
  );
};

export default StudioPage;
