import type { Metadata } from "next";
import type { Locale } from "./i18n-config";
import type { RouteKey } from "./i18n-routes";
import { createPageMetadata, siteDescription, siteDescriptionEn } from "./seo";

const pageSeo: Record<
  RouteKey,
  Record<Locale, { title: string; description: string }>
> = {
  home: {
    fr: {
      title: "Studio créatif de la petite Ceinture",
      description: siteDescription,
    },
    en: {
      title: "Creative studio of the petite Ceinture",
      description: siteDescriptionEn,
    },
  },
  services: {
    fr: {
      title: "Services de communication créative",
      description:
        "Identité visuelle, direction artistique et stratégie de contenu : découvrez les expertises de Studio Volante pour construire une marque cohérente.",
    },
    en: {
      title: "Creative communication services",
      description:
        "Visual identity, art direction and content strategy: discover Studio Volante's expertise for building a coherent and memorable brand.",
    },
  },
  portfolio: {
    fr: {
      title: "Portfolio et réalisations",
      description:
        "Découvrez les réalisations de Studio Volante en identité visuelle, direction artistique, campagnes et création de contenu.",
    },
    en: {
      title: "Portfolio and selected work",
      description:
        "Explore Studio Volante's work across visual identity, art direction, campaigns and content creation.",
    },
  },
  trailblaze: {
    fr: {
      title: "Trailblaze",
      description:
        "Pensées, récits et points de vue de Studio Volante sur les marques, les lieux culturels, l'image et la communication créative.",
    },
    en: {
      title: "Trailblaze",
      description:
        "Thoughts, stories and perspectives from Studio Volante on brands, cultural places, image-making and creative communication.",
    },
  },
  studio: {
    fr: {
      title: "Le studio",
      description:
        "Découvrez Studio Volante, studio indépendant de communication créative basé à Paris, son approche et ses valeurs.",
    },
    en: {
      title: "The studio",
      description:
        "Meet Studio Volante, an independent creative communication studio based in Paris, and discover its approach and values.",
    },
  },
  contact: {
    fr: {
      title: "Contact",
      description:
        "Parlez-nous de votre projet d'identité, de direction artistique ou de contenu. Studio Volante accompagne les marques à Paris et en France.",
    },
    en: {
      title: "Contact",
      description:
        "Tell us about your visual identity, art direction or content project. Studio Volante works with brands in Paris, France and beyond.",
    },
  },
};

export const createRouteMetadata = (
  locale: Locale,
  route: RouteKey,
): Metadata => createPageMetadata({ locale, route, ...pageSeo[route][locale] });
