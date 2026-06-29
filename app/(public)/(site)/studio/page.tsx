import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { colors } from "@/app/theme/tokens";
import { getTranslations, t } from "@/lib/i18n";
import { getPageHeaderContent } from "@/lib/page-header-content";
import { resolveLocale } from "@/lib/i18n-config";
import prisma from "@/lib/prisma";
import { sanitizeRichTextHtml } from "@/lib/sanitize-html";
import type { Metadata } from "next";
import { createRouteMetadata } from "@/lib/seo-pages";
import RouteBreadcrumbJsonLd from "@/components/seo/RouteBreadcrumbJsonLd";
import FoundersBlock from "@/components/sections/FoundersBlock/FoundersBlock";
import type { Founder } from "@/components/sections/FoundersBlock/FoundersBlock";
import RichText from "@/components/ui/RichText/RichText";
import { localizedTranslationField } from "@/lib/content-translations";

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
    translations: [],
  },
  {
    id: "studio-value-clarte",
    title: "Clarté",
    titleEn: "Clarity",
    description:
      "Nous simplifions le complexe. Une bonne communication est d'abord une communication compréhensible.",
    descriptionEn:
      "We make complexity simple. Good communication begins with being understood.",
    translations: [],
  },
  {
    id: "studio-value-durabilite",
    title: "Durabilité",
    titleEn: "Durability",
    description:
      "Nous concevons des identités qui vieillissent bien et des messages qui restent pertinents dans le temps.",
    descriptionEn:
      "We design identities that age well and messages that remain relevant over time.",
    translations: [],
  },
];

const getStudioValues = async () => {
  try {
    return await prisma.studioValue.findMany({
      where: { active: true },
      orderBy: [{ order: "asc" }, { id: "asc" }],
      include: { translations: true },
    });
  } catch {
    return fallbackValues;
  }
};

const getStudioPageContent = async () => {
  try {
    return await prisma.studioPageContent.findUnique({
      where: { id: "studio" },
      include: {
        founderOneImageAsset: true,
        founderTwoImageAsset: true,
        translations: true,
      },
    });
  } catch {
    return null;
  }
};

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const StudioPage = async ({
  params,
}: {
  params?: Promise<{ locale?: string }>;
}) => {
  const locale = resolveLocale((await params)?.locale);
  const [translations, rawValues, studioContent] = await Promise.all([
    getTranslations(locale),
    getStudioValues(),
    getStudioPageContent(),
  ]);
  const pageHeader = await getPageHeaderContent("studio", locale, translations);
  const values = rawValues.map((value) => ({
    key: value.id,
    title: localizedTranslationField(
      value.translations,
      locale,
      "title",
      value.title,
      value.titleEn,
    ),
    description: localizedTranslationField(
      value.translations,
      locale,
      "description",
      value.description,
      value.descriptionEn,
    ),
  }));
  const founders: Founder[] = studioContent
    ? [
        {
          name: localizedTranslationField(
            studioContent.translations,
            locale,
            "founderOneName",
            studioContent.founderOneName,
            studioContent.founderOneNameEn,
          ),
          role: localizedTranslationField(
            studioContent.translations,
            locale,
            "founderOneRole",
            studioContent.founderOneRole,
            studioContent.founderOneRoleEn,
          ),
          description: sanitizeRichTextHtml(
            localizedTranslationField(
              studioContent.translations,
              locale,
              "founderOneDescription",
              studioContent.founderOneDescription,
              studioContent.founderOneDescriptionEn,
            ),
          ),
          imageUrl: studioContent.founderOneImageUrl,
          imageAlt: localizedTranslationField(
            studioContent.translations,
            locale,
            "founderOneImageAlt",
            studioContent.founderOneImageAsset?.alt ||
              studioContent.founderOneImageAlt ||
              studioContent.founderOneName,
            studioContent.founderOneImageAsset?.altEn ||
              studioContent.founderOneImageAltEn,
          ),
        },
        {
          name: localizedTranslationField(
            studioContent.translations,
            locale,
            "founderTwoName",
            studioContent.founderTwoName,
            studioContent.founderTwoNameEn,
          ),
          role: localizedTranslationField(
            studioContent.translations,
            locale,
            "founderTwoRole",
            studioContent.founderTwoRole,
            studioContent.founderTwoRoleEn,
          ),
          description: sanitizeRichTextHtml(
            localizedTranslationField(
              studioContent.translations,
              locale,
              "founderTwoDescription",
              studioContent.founderTwoDescription,
              studioContent.founderTwoDescriptionEn,
            ),
          ),
          imageUrl: studioContent.founderTwoImageUrl,
          imageAlt: localizedTranslationField(
            studioContent.translations,
            locale,
            "founderTwoImageAlt",
            studioContent.founderTwoImageAsset?.alt ||
              studioContent.founderTwoImageAlt ||
              studioContent.founderTwoName,
            studioContent.founderTwoImageAsset?.altEn ||
              studioContent.founderTwoImageAltEn,
          ),
        },
      ]
    : [];
  const foundersBlock =
    studioContent &&
    studioContent.intro.trim() &&
    founders.every(
      (founder) =>
        founder.name.trim() &&
        founder.role.trim() &&
        founder.description.trim() &&
        founder.imageUrl.trim(),
    )
      ? {
          eyebrow: localizedTranslationField(
            studioContent.translations,
            locale,
            "eyebrow",
            studioContent.eyebrow,
            studioContent.eyebrowEn,
          ),
          title: localizedTranslationField(
            studioContent.translations,
            locale,
            "title",
            studioContent.title,
            studioContent.titleEn,
          ),
          intro: localizedTranslationField(
            studioContent.translations,
            locale,
            "intro",
            studioContent.intro,
            studioContent.introEn,
          ),
          founders,
        }
      : null;
  const historyTitle = studioContent
    ? localizedTranslationField(
        studioContent.translations,
        locale,
        "historyTitle",
        studioContent.historyTitle,
        studioContent.historyTitleEn,
      )
    : t(translations, "studio.history.heading", "Notre histoire");
  const historyContentHtml = studioContent
    ? localizedTranslationField(
        studioContent.translations,
        locale,
        "historyContentHtml",
        studioContent.historyContentHtml,
        studioContent.historyContentHtmlEn,
      )
    : `<p>${escapeHtml(
        t(
          translations,
          "studio.history.body1",
          "Studio Volante est né de la conviction que la communication doit être aussi bien pensée qu'elle est belle. Fondé par des créatifs passionnés, le studio accompagne des marques de toutes tailles dans la construction d'une identité forte et cohérente.",
        ),
      )}</p><p>${escapeHtml(
        t(
          translations,
          "studio.history.body2",
          "Notre approche est toujours stratégique avant d'être esthétique : comprendre le positionnement, les cibles, les ambitions — puis créer.",
        ),
      )}</p>`;

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
            {pageHeader.eyebrow}
          </Typography>
          <Typography variant="h1" sx={{ maxWidth: 700 }}>
            {pageHeader.title}
          </Typography>
        </Box>
      </Box>

      {foundersBlock && <FoundersBlock {...foundersBlock} />}

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
          <Typography variant="h2">{historyTitle}</Typography>
          <RichText html={historyContentHtml} />
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
