import prisma from "@/lib/prisma";
import { t, type Locale, type Translations } from "@/lib/i18n";
import { localizedTranslationField } from "./content-translations";

export type HomeHeroContent = {
  eyebrow: string;
  title: string;
  subheading: string;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
};

const getFallbackHomeHeroContent = (
  translations: Translations,
): HomeHeroContent => ({
  eyebrow: t(translations, "hero.eyebrow", "Agence de communication créative"),
  title: t(
    translations,
    "hero.heading",
    "Nous donnons vie aux idées qui méritent d'exister.",
  ),
  subheading: t(
    translations,
    "hero.subheading",
    "Studio Volante accompagne les marques ambitieuses dans leur communication — identité visuelle, stratégie de contenu, direction artistique.",
  ),
  primaryCtaLabel: t(translations, "hero.cta.portfolio", "Voir nos projets"),
  secondaryCtaLabel: t(
    translations,
    "hero.cta.contact",
    "Travailler ensemble",
  ),
});

export const getHomeHeroContent = async (
  locale: Locale,
  translations: Translations,
): Promise<HomeHeroContent> => {
  const fallback = getFallbackHomeHeroContent(translations);

  try {
    const content = await prisma.homePageContent.findUnique({
      where: { id: "home" },
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
      subheading: localizedTranslationField(
        content.translations,
        locale,
        "subheading",
        content.subheading,
      ),
      primaryCtaLabel: localizedTranslationField(
        content.translations,
        locale,
        "primaryCtaLabel",
        content.primaryCtaLabel,
      ),
      secondaryCtaLabel: localizedTranslationField(
        content.translations,
        locale,
        "secondaryCtaLabel",
        content.secondaryCtaLabel,
      ),
    };
  } catch {
    return fallback;
  }
};
