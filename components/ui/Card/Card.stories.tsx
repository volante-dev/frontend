import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import ProjectCard from "./Card";

const meta: Meta<typeof ProjectCard> = {
  title: "UI/ProjectCard",
  component: ProjectCard,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div style={{ width: 400 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ProjectCard>;

export const Default: Story = {
  args: {
    title: "Refonte identité — Maison Léa",
    description:
      "Création d'une nouvelle identité visuelle pour une maison de mode parisienne, incluant logo, charte graphique et déclinaisons print/digital.",
    tags: ["Identité visuelle", "Branding", "Print"],
  },
};

export const WithImage: Story = {
  args: {
    title: "Campagne digitale — Atelier Nord",
    description: "Direction artistique et production d'une campagne social media.",
    imageUrl: "https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=800",
    tags: ["Direction artistique", "Digital"],
  },
};

export const Minimal: Story = {
  args: { title: "Stratégie de contenu — Collectif FORM" },
};
