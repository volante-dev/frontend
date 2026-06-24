import HeroVideo from "@/components/sections/HeroVideo/HeroVideo";
import Hero from "@/components/sections/Hero/Hero";
import ServicesList from "@/components/sections/ServicesList/ServicesList";
import FeaturedProjectsCarousel from "@/components/sections/FeaturedProjectsCarousel/FeaturedProjectsCarousel";
import type { Service } from "@/components/sections/ServicesList/ServicesList";
import prisma from "@/lib/prisma";
import { localizeField } from "@/lib/i18n";
import { resolveLocale } from "@/lib/i18n-config";
import OpeningSequenceLoader from "@/components/layout/OpeningSequence/OpeningSequenceLoader";
import HomeScrollController from "@/components/sections/HomeScrollController/HomeScrollController";
import type { Metadata } from "next";
import { createRouteMetadata } from "@/lib/seo-pages";

export const dynamic = "force-dynamic";

export const generateMetadata = async ({
  params,
}: {
  params?: Promise<{ locale?: string }>;
}): Promise<Metadata> =>
  createRouteMetadata(resolveLocale((await params)?.locale), "home");

const fallbackServices = [
  {
    id: "1",
    title: "Identité visuelle",
    titleEn: "Visual identity",
    description:
      "Création de systèmes d'identité cohérents et mémorables — logo, typographie, palette chromatique, charte graphique complète.",
    descriptionEn:
      "Creation of coherent and memorable identity systems — logo, typography, colour palette, complete brand guidelines.",
    descriptionHtml:
      "<p>Création de systèmes d'identité cohérents et mémorables — logo, typographie, palette chromatique, charte graphique complète.</p>",
    descriptionHtmlEn:
      "<p>Creation of coherent and memorable identity systems — logo, typography, colour palette, complete brand guidelines.</p>",
    icon: null,
    order: 1,
    active: true,
  },
  {
    id: "2",
    title: "Direction artistique",
    titleEn: "Art direction",
    description:
      "Définition de l'univers visuel de vos campagnes, shootings et contenus digitaux. Un regard éditorial fort pour des communications qui marquent.",
    descriptionEn:
      "Defining the visual universe of your campaigns, shoots and digital content. A strong editorial eye for communications that leave a mark.",
    descriptionHtml:
      "<p>Définition de l'univers visuel de vos campagnes, shootings et contenus digitaux. Un regard éditorial fort pour des communications qui marquent.</p>",
    descriptionHtmlEn:
      "<p>Defining the visual universe of your campaigns, shoots and digital content. A strong editorial eye for communications that leave a mark.</p>",
    icon: null,
    order: 2,
    active: true,
  },
  {
    id: "3",
    title: "Stratégie de contenu",
    titleEn: "Content strategy",
    description:
      "Conception éditoriale et production de contenus adaptés à chaque canal — réseaux sociaux, site web, print, motion.",
    descriptionEn:
      "Editorial design and content production tailored to every channel — social media, website, print, motion.",
    descriptionHtml:
      "<p>Conception éditoriale et production de contenus adaptés à chaque canal — réseaux sociaux, site web, print, motion.</p>",
    descriptionHtmlEn:
      "<p>Editorial design and content production tailored to every channel — social media, website, print, motion.</p>",
    icon: null,
    order: 3,
    active: true,
  },
];

const getServices = async (): Promise<Service[]> => {
  try {
    return await prisma.service.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
    });
  } catch {
    return fallbackServices;
  }
};

const getProjects = async () => {
  try {
    return await prisma.project.findMany({
      where: { publishedAt: { not: null }, featured: true },
      orderBy: [{ order: "asc" }, { publishedAt: "desc" }],
      include: {
        sectorEntry: true,
        locationEntry: true,
        imageAsset: { select: { mediaType: true, posterUrl: true } },
      },
    });
  } catch {
    return [];
  }
};

const inferMediaTypeFromUrl = (value: string) =>
  /\.(mp4|mov|webm)(?:[?#].*)?$/i.test(value) ? "VIDEO" : "IMAGE";

const HomePage = async ({
  params,
}: {
  params?: Promise<{ locale?: string }>;
}) => {
  const locale = resolveLocale((await params)?.locale);

  const [services, projects] = await Promise.all([
    getServices(),
    getProjects(),
  ]);

  const localizedServices = services.map((s) => ({
    ...s,
    title: localizeField(s.title, s.titleEn, locale),
    description: localizeField(
      s.descriptionHtml ?? `<p>${s.description}</p>`,
      s.descriptionHtmlEn ?? s.descriptionEn,
      locale,
    ),
  }));
  const localizedProjects = projects.map(({ imageAsset, ...p }) => ({
    ...p,
    title: localizeField(p.title, p.titleEn, locale),
    description: localizeField(p.description, p.descriptionEn, locale),
    sector:
      (p.sectorEntry
        ? localizeField(p.sectorEntry.label, p.sectorEntry.labelEn, locale)
        : "") || null,
    projectLocation:
      (p.locationEntry
        ? localizeField(p.locationEntry.label, p.locationEntry.labelEn, locale)
        : "") || null,
    coverMediaType: imageAsset?.mediaType ?? inferMediaTypeFromUrl(p.imageUrl),
    coverPosterUrl: imageAsset?.posterUrl ?? null,
  }));

  const heroVideoSrc = process.env.NEXT_PUBLIC_HERO_VIDEO_URL;
  const heroVideoPoster = process.env.NEXT_PUBLIC_HERO_VIDEO_POSTER_URL;

  return (
    <>
      <OpeningSequenceLoader />
      <HomeScrollController />
      <HeroVideo src={heroVideoSrc} poster={heroVideoPoster} />
      <Hero />
      <ServicesList services={localizedServices} />
      {localizedProjects.length >= 2 && (
        <FeaturedProjectsCarousel projects={localizedProjects} />
      )}
    </>
  );
};

export default HomePage;
