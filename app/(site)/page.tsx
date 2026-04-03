export const dynamic = "force-dynamic";

import { headers } from "next/headers";
import Hero from "@/components/sections/Hero/Hero";
import ServicesList from "@/components/sections/ServicesList/ServicesList";
import ProjectGrid from "@/components/sections/ProjectGrid/ProjectGrid";
import type { Service } from "@/components/sections/ServicesList/ServicesList";
import type { Project } from "@/components/sections/ProjectGrid/ProjectGrid";
import prisma from "@/lib/prisma";
import { getTranslations, localizeField, defaultLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

const fallbackServices = [
  {
    id: "1",
    title: "Identité visuelle",
    titleEn: "Visual identity",
    description:
      "Création de systèmes d'identité cohérents et mémorables — logo, typographie, palette chromatique, charte graphique complète.",
    descriptionEn:
      "Creation of coherent and memorable identity systems — logo, typography, colour palette, complete brand guidelines.",
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

const getProjects = async (): Promise<Project[]> => {
  try {
    return await prisma.project.findMany({
      where: { publishedAt: { not: null } },
      orderBy: [{ featured: "desc" }, { order: "asc" }, { publishedAt: "desc" }],
    });
  } catch {
    return [];
  }
};

const HomePage = async () => {
  const headersList = await headers();
  const locale = (headersList.get("x-locale") ?? defaultLocale) as Locale;

  const [services, projects, translations] = await Promise.all([
    getServices(),
    getProjects(),
    getTranslations(locale),
  ]);

  const localizedServices = services.map((s) => ({
    ...s,
    title: localizeField(s.title, s.titleEn, locale),
    description: localizeField(s.description, s.descriptionEn, locale),
  }));
  const localizedProjects = projects.map((p) => ({
    ...p,
    title: localizeField(p.title, p.titleEn, locale),
    description: localizeField(p.description, p.descriptionEn, locale),
  }));

  return (
    <>
      <Hero translations={translations} />
      <ServicesList services={localizedServices} translations={translations} />
      {localizedProjects.length > 0 && <ProjectGrid projects={localizedProjects} translations={translations} preview />}
    </>
  );
};

export default HomePage;
