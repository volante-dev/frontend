import prisma from "@/lib/prisma";
import { t, type Locale, type Translations } from "@/lib/i18n";
import {
  localizedNullableTranslationField,
  localizedTranslationField,
} from "./content-translations";

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
  intro: string | null;
};

const pageHeaderTranslationKeys: Record<
  PageHeaderId,
  {
    eyebrow: string;
    title: string;
    fallbackEyebrow: string;
    fallbackTitle: string;
    fallbackIntro: string | null;
  }
> = {
  studio: {
    eyebrow: "studio.page.eyebrow",
    title: "studio.page.heading",
    fallbackEyebrow: "Qui sommes-nous",
    fallbackTitle: "Un studio indépendant, une vision singulière.",
    fallbackIntro: null,
  },
  services: {
    eyebrow: "services.page.eyebrow",
    title: "services.page.heading",
    fallbackEyebrow: "Notre expertise",
    fallbackTitle: "Des services pensés pour faire rayonner votre marque.",
    fallbackIntro: null,
  },
  portfolio: {
    eyebrow: "portfolio.page.eyebrow",
    title: "portfolio.page.heading",
    fallbackEyebrow: "Nos réalisations",
    fallbackTitle: "Des projets construits avec exigence.",
    fallbackIntro: null,
  },
  contact: {
    eyebrow: "contact.page.eyebrow",
    title: "contact.page.heading",
    fallbackEyebrow: "Nous contacter",
    fallbackTitle: "Parlons de votre projet.",
    fallbackIntro: null,
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
    intro: keys.fallbackIntro,
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
      include: { translations: true },
    });

    if (!content) return fallback;

    return {
      eyebrow: localizedTranslationField(
        content.translations,
        locale,
        "eyebrow",
        content.eyebrow,
      ),
      title: localizedTranslationField(
        content.translations,
        locale,
        "title",
        content.title,
      ),
      intro: localizedNullableTranslationField(
        content.translations,
        locale,
        "intro",
        content.intro,
      ),
    };
  } catch {
    return fallback;
  }
};
