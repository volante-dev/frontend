export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  imageUrl: string;
  coverMediaType?: "IMAGE" | "VIDEO";
  coverPosterUrl?: string | null;
  heroPaletteComputed?: string[];
  sector?: string | null;
  projectLocation?: string | null;
  tags: string[];
  featured: boolean;
  portfolioSize: "NORMAL" | "HERO";
  portfolioOrder: number;
}
