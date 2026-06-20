import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import FeaturedProjectsCarousel from "./FeaturedProjectsCarousel";
import type { Project } from "@/components/sections/ProjectGrid/project-types";

const projects: Project[] = [
  {
    id: "one",
    title: "Écume",
    slug: "ecume",
    description: "Identité et campagne.",
    imageUrl:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80",
    heroPaletteComputed: ["#477C78", "#83A59D", "#D8C8A7", "#78909C"],
    sector: "Culture",
    projectLocation: "Paris",
    tags: [],
    featured: true,
    portfolioSize: "HERO",
    portfolioOrder: 0,
  },
  {
    id: "two",
    title: "Rivage",
    slug: "rivage",
    description: "Direction artistique.",
    imageUrl:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80",
    heroPaletteComputed: ["#245C74", "#4E8DA4", "#A8CDD1", "#D8C9A4"],
    sector: "Hospitalité",
    projectLocation: "Marseille",
    tags: [],
    featured: true,
    portfolioSize: "NORMAL",
    portfolioOrder: 1,
  },
  {
    id: "three",
    title: "Solstice",
    slug: "solstice",
    description: "Identité visuelle.",
    imageUrl:
      "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1600&q=80",
    heroPaletteComputed: ["#9A6845", "#C59061", "#E6C99C", "#8A7370"],
    sector: "Art de vivre",
    projectLocation: "Lyon",
    tags: [],
    featured: true,
    portfolioSize: "NORMAL",
    portfolioOrder: 2,
  },
];

const meta = {
  title: "Sections/FeaturedProjectsCarousel",
  component: FeaturedProjectsCarousel,
  parameters: { layout: "fullscreen" },
  args: { projects },
} satisfies Meta<typeof FeaturedProjectsCarousel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {};

export const Mobile: Story = {
  globals: { viewport: { value: "mobile1", isRotated: false } },
};

export const HiddenWithOneProject: Story = {
  args: { projects: projects.slice(0, 1) },
};
