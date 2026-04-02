import { headers } from "next/headers";
import Hero from "@/components/sections/Hero/Hero";
import ServicesList from "@/components/sections/ServicesList/ServicesList";
import ProjectGrid from "@/components/sections/ProjectGrid/ProjectGrid";
import type { Service } from "@/components/sections/ServicesList/ServicesList";
import type { Project } from "@/components/sections/ProjectGrid/ProjectGrid";
import prisma from "@/lib/prisma";
import { getTranslations, defaultLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

const fallbackServices: Service[] = [
  {
    id: "1",
    title: "Identité visuelle",
    description:
      "Création de systèmes d'identité cohérents et mémorables — logo, typographie, palette chromatique, charte graphique complète.",
    order: 1,
    active: true,
  },
  {
    id: "2",
    title: "Direction artistique",
    description:
      "Définition de l'univers visuel de vos campagnes, shootings et contenus digitaux. Un regard éditorial fort pour des communications qui marquent.",
    order: 2,
    active: true,
  },
  {
    id: "3",
    title: "Stratégie de contenu",
    description:
      "Conception éditoriale et production de contenus adaptés à chaque canal — réseaux sociaux, site web, print, motion.",
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

  return (
    <>
      <Hero translations={translations} />
      <ServicesList services={services} />
      {projects.length > 0 && <ProjectGrid projects={projects} preview />}
    </>
  );
};

export default HomePage;
