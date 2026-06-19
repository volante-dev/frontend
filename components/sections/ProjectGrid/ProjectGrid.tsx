"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@/components/ui/Button/Button";
import ProjectCard from "@/components/ui/Card/Card";
import Link from "next/link";
import { colors } from "@/app/theme/tokens";
import { useI18n } from "@/components/providers/I18nProvider/I18nProvider";

export interface Project {
  id: string;
  title: string;
  titleEn?: string | null;
  slug: string;
  description: string;
  descriptionEn?: string | null;
  imageUrl: string;
  tags: string[];
  featured: boolean;
  portfolioSize: "NORMAL" | "HERO";
  portfolioOrder: number;
}

interface ProjectGridProps {
  projects: Project[];
  /** Limite le nombre de projets affichés, avec lien vers la page portfolio */
  preview?: boolean;
}

const ProjectGrid = ({ projects, preview = false }: ProjectGridProps) => {
  const displayed = preview ? projects.slice(0, 4) : projects;
  const { t, localizedHref } = useI18n();
  const portfolioHref = localizedHref("portfolio");

  return (
    <Box
      component="section"
      data-testid="project-grid"
      sx={{
        py: { xs: 8, md: 12 },
        px: { xs: 2, md: 4 },
        borderBottom: `1px solid ${colors.blueGray}`,
      }}
    >
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            mb: 6,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 2, color: colors.green }}>
              {t("portfolio.eyebrow", "Nos réalisations")}
            </Typography>
            <Typography variant="h2">
              {t("portfolio.heading", "Portfolio")}
            </Typography>
          </Box>
          {preview && (
            <Button variant="outlined" component={Link} href={portfolioHref}>
              {t("portfolio.cta.viewAll", "Voir tout")}
            </Button>
          )}
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
            gap: 3,
          }}
          data-testid="projects-list"
        >
          {displayed.map((project) => (
            <Box
              key={project.id}
              component={Link}
              href={`${portfolioHref}/${project.slug}`}
              sx={{ display: "block", textDecoration: "none", color: "inherit" }}
            >
              <ProjectCard
                title={project.title}
                description={project.description}
                imageUrl={project.imageUrl}
                tags={project.tags}
                sx={{ cursor: "pointer", height: "100%" }}
              />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default ProjectGrid;
