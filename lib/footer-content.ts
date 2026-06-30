import prisma from "./prisma";
import type { Locale } from "./i18n-config";
import type { Translations } from "./i18n-messages";

const footerTranslationKeys = {
  tagline: "footer.tagline",
  contactHeading: "footer.contact.heading",
  contactEmail: "footer.contact.email",
  contactSocialLabel: "footer.contact.social",
  legalText: "footer.copyright",
  madeWithCare: "footer.madeIn",
} as const;

const textValue = (value: string | null | undefined, fallback: string) =>
  value?.trim() || fallback;

export const getFooterTranslations = async (
  locale: Locale,
): Promise<Translations> => {
  try {
    const content = await prisma.footerContent.findUnique({
      where: { id: "footer" },
      include: {
        translations: {
          where: { locale },
          take: 1,
        },
      },
    });

    if (!content) return {};

    const translation = content.translations[0];

    return {
      [footerTranslationKeys.tagline]: textValue(
        translation?.tagline,
        content.tagline,
      ),
      [footerTranslationKeys.contactHeading]: textValue(
        translation?.contactHeading,
        content.contactHeading,
      ),
      [footerTranslationKeys.contactEmail]: textValue(
        translation?.contactEmail,
        content.contactEmail,
      ),
      [footerTranslationKeys.contactSocialLabel]: textValue(
        translation?.contactSocialLabel,
        content.contactSocialLabel,
      ),
      [footerTranslationKeys.legalText]: textValue(
        translation?.legalText,
        content.legalText,
      ),
      [footerTranslationKeys.madeWithCare]: textValue(
        translation?.madeWithCare,
        content.madeWithCare,
      ),
    };
  } catch {
    return {};
  }
};
