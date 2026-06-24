import prisma from "@/lib/prisma";
import { localizeField, t, type Locale, type Translations } from "@/lib/i18n";

export const pageHeaderIds = [
  "studio",
  "services",
  "portfolio",
  "contact",
] as const;

export type PageHeaderId = (typeof pageHeaderIds)[number];

type PageHeaderContent = {
  eyebrow: string;
  title: string;
};

const pageHeaderTranslationKeys: Record<
  PageHeaderId,
  {
    eyebrow: string;
    title: string;
    fallbackEyebrow: string;
    fallbackTitle: string;
  }
> = {
  studio: {
    eyebrow: "studio.page.eyebrow",
    title: "studio.page.heading",
    fallbackEyebrow: "Qui sommes-nous",
    fallbackTitle: "Un studio indépendant, une vision singulière.",
  },
  services: {
    eyebrow: "services.page.eyebrow",
    title: "services.page.heading",
    fallbackEyebrow: "Notre expertise",
    fallbackTitle: "Des services pensés pour faire rayonner votre marque.",
  },
  portfolio: {
    eyebrow: "portfolio.page.eyebrow",
    title: "portfolio.page.heading",
    fallbackEyebrow: "Nos réalisations",
    fallbackTitle: "Des projets construits avec exigence.",
  },
  contact: {
    eyebrow: "contact.page.eyebrow",
    title: "contact.page.heading",
    fallbackEyebrow: "Nous contacter",
    fallbackTitle: "Parlons de votre projet.",
  },
};

const getFallbackPageHeaderContent = (
  pageId: PageHeaderId,
  translations: Translations,
): PageHeaderContent => {
  const keys = pageHeaderTranslationKeys[pageId];

  return {
    eyebrow: t(translations, keys.eyebrow, keys.fallbackEyebrow),
    title: t(translations, keys.title, keys.fallbackTitle),
  };
};

export const getPageHeaderContent = async (
  pageId: PageHeaderId,
  locale: Locale,
  translations: Translations,
): Promise<PageHeaderContent> => {
  const fallback = getFallbackPageHeaderContent(pageId, translations);

  try {
    const content = await prisma.pageHeaderContent.findUnique({
      where: { id: pageId },
    });

    if (!content) return fallback;

    return {
      eyebrow: localizeField(content.eyebrow, content.eyebrowEn, locale),
      title: localizeField(content.title, content.titleEn, locale),
    };
  } catch {
    return fallback;
  }
};
