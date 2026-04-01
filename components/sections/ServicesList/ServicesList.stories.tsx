import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import ServicesList from "./ServicesList";

const services = [
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
      "Définition de l'univers visuel de vos campagnes, shootings et contenus digitaux.",
    order: 2,
    active: true,
  },
  {
    id: "3",
    title: "Stratégie de contenu",
    description: "Conception éditoriale et production de contenus adaptés à chaque canal.",
    order: 3,
    active: true,
  },
];

const meta: Meta<typeof ServicesList> = {
  title: "Sections/ServicesList",
  component: ServicesList,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof ServicesList>;

export const Default: Story = { args: { services } };
export const SingleService: Story = { args: { services: [services[0]] } };
