export interface Project {
  id: string;
  title: string;
  titleEn?: string | null;
  slug: string;
  description: string;
  descriptionEn?: string | null;
  imageUrl: string;
  heroPaletteComputed?: string[];
  sector?: string | null;
  sectorEn?: string | null;
  projectLocation?: string | null;
  projectLocationEn?: string | null;
  tags: string[];
  featured: boolean;
  portfolioSize: "NORMAL" | "HERO";
  portfolioOrder: number;
}
