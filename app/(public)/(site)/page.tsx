import HeroVideo from "@/components/sections/HeroVideo/HeroVideo";
import Hero from "@/components/sections/Hero/Hero";
import FeaturedProjectsCarousel from "@/components/sections/FeaturedProjectsCarousel/FeaturedProjectsCarousel";
import prisma from "@/lib/prisma";
import { getTranslations } from "@/lib/i18n";
import { resolveLocale } from "@/lib/i18n-config";
import OpeningSequenceLoader from "@/components/layout/OpeningSequence/OpeningSequenceLoader";
import HomeScrollController from "@/components/sections/HomeScrollController/HomeScrollController";
import type { Metadata } from "next";
import { createRouteMetadata } from "@/lib/seo-pages";
import { getHomeHeroContent } from "@/lib/home-hero-content";
import { localizedTranslationField } from "@/lib/content-translations";

export const dynamic = "force-dynamic";

export const generateMetadata = async ({
  params,
}: {
  params?: Promise<{ locale?: string }>;
}): Promise<Metadata> =>
  createRouteMetadata(resolveLocale((await params)?.locale), "home");

const getProjects = async () => {
  try {
    return await prisma.project.findMany({
      where: { publishedAt: { not: null }, featured: true },
      orderBy: [{ order: "asc" }, { publishedAt: "desc" }],
      include: {
        translations: true,
        sectorEntry: { include: { translations: true } },
        locationEntry: { include: { translations: true } },
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

  const [projects, translations] = await Promise.all([
    getProjects(),
    getTranslations(locale),
  ]);
  const heroContent = await getHomeHeroContent(locale, translations);
  const localizedProjects = projects.map(({ imageAsset, ...p }) => ({
    ...p,
    title: localizedTranslationField(
      p.translations,
      locale,
      "title",
      p.title,
    ),
    description: localizedTranslationField(
      p.translations,
      locale,
      "description",
      p.description,
    ),
    sector:
      (p.sectorEntry
        ? localizedTranslationField(
            p.sectorEntry.translations,
            locale,
            "label",
            p.sectorEntry.label,
          )
        : "") || null,
    projectLocation:
      (p.locationEntry
        ? localizedTranslationField(
            p.locationEntry.translations,
            locale,
            "label",
            p.locationEntry.label,
          )
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
      <Hero content={heroContent} />
      {localizedProjects.length >= 2 && (
        <FeaturedProjectsCarousel projects={localizedProjects} />
      )}
    </>
  );
};

export default HomePage;
