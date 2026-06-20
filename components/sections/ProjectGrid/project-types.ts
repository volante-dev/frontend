export interface Project {
  id: string;
  title: string;
  titleEn?: string | null;
  slug: string;
  description: string;
  descriptionEn?: string | null;
  imageUrl: string;
  heroColorOverride?: string | null;
  heroColorComputed?: string | null;
  sector?: string | null;
  sectorEn?: string | null;
  projectLocation?: string | null;
  projectLocationEn?: string | null;
  tags: string[];
  featured: boolean;
  portfolioSize: "NORMAL" | "HERO";
  portfolioOrder: number;
}
