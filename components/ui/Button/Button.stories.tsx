import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Button from "./Button";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["contained", "outlined", "text"] },
    size: { control: "select", options: ["small", "medium", "large"] },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Contained: Story = {
  args: { variant: "contained", children: "Voir nos projets" },
};

export const Outlined: Story = {
  args: { variant: "outlined", children: "Travailler ensemble" },
};

export const Text: Story = {
  args: { variant: "text", children: "En savoir plus" },
};

export const Loading: Story = {
  args: { variant: "contained", loading: true, children: "Envoyer" },
};

export const Large: Story = {
  args: { variant: "contained", size: "large", children: "Démarrons un projet" },
};
