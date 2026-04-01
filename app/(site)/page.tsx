import Hero from "@/components/sections/Hero/Hero";
import ServicesList from "@/components/sections/ServicesList/ServicesList";
import ProjectGrid from "@/components/sections/ProjectGrid/ProjectGrid";
import type { Service } from "@/components/sections/ServicesList/ServicesList";
import type { Project } from "@/components/sections/ProjectGrid/ProjectGrid";

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
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/services`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return fallbackServices;
    return res.json() as Promise<Service[]>;
  } catch {
    return fallbackServices;
  }
};

const getProjects = async (): Promise<Project[]> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/projects`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    return res.json() as Promise<Project[]>;
  } catch {
    return [];
  }
};

const HomePage = async () => {
  const [services, projects] = await Promise.all([getServices(), getProjects()]);

  return (
    <>
      <Hero />
      <ServicesList services={services} />
      {projects.length > 0 && <ProjectGrid projects={projects} preview />}
    </>
  );
};

export default HomePage;
