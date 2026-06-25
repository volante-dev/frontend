import prisma from "@/lib/prisma";
import { localizeField, t, type Locale, type Translations } from "@/lib/i18n";

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
    });

    if (!content) return fallback;

    return {
      eyebrow: localizeField(content.eyebrow, content.eyebrowEn, locale),
      title: localizeField(content.title, content.titleEn, locale),
      subheading: localizeField(
        content.subheading,
        content.subheadingEn,
        locale,
      ),
      primaryCtaLabel: localizeField(
        content.primaryCtaLabel,
        content.primaryCtaLabelEn,
        locale,
      ),
      secondaryCtaLabel: localizeField(
        content.secondaryCtaLabel,
        content.secondaryCtaLabelEn,
        locale,
      ),
    };
  } catch {
    return fallback;
  }
};
