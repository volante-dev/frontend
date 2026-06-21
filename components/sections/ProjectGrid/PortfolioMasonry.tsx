"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { useMemo } from "react";
import { colors, typography } from "@/app/theme/tokens";
import { useI18n } from "@/components/providers/I18nProvider/I18nProvider";
import type { Project } from "./project-types";
import { getDesktopMasonryPlacements } from "./masonry-layout";

type PortfolioMasonryProps = {
  projects: Project[];
};

const isHero = (project: Project) => project.portfolioSize === "HERO";

const PortfolioMasonry = ({ projects }: PortfolioMasonryProps) => {
  const { localizedHref } = useI18n();
  const portfolioHref = localizedHref("portfolio");
  const desktopPlacements = useMemo(
    () => getDesktopMasonryPlacements(projects),
    [projects],
  );

  return (
    <Box
      component="section"
      data-testid="portfolio-masonry"
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", md: "repeat(4, minmax(0, 1fr))" },
        gridAutoRows: { xs: "minmax(150px, 48vw)", md: "minmax(180px, 22vw)" },
        gap: "2px",
      }}
    >
      {projects.map((project) => {
        const hero = isHero(project);
        const desktopPlacement = desktopPlacements.get(project.id);

        return (
          <Box
            key={project.id}
            component={Link}
            href={`${portfolioHref}/${project.slug}`}
            sx={{
              position: "relative",
              display: "block",
              overflow: "hidden",
              minHeight: 0,
              color: colors.white,
              textDecoration: "none",
              backgroundColor: colors.mutedBlack,
              gridColumn: {
                xs: hero ? "span 2" : "span 1",
                md: desktopPlacement
                  ? `${desktopPlacement.columnStart} / span ${desktopPlacement.columnSpan}`
                  : "auto",
              },
              gridRow: {
                xs: hero ? "span 2" : "span 1",
                md: desktopPlacement
                  ? `${desktopPlacement.rowStart} / span ${desktopPlacement.rowSpan}`
                  : "auto",
              },
              "&:hover img": {
                transform: "scale(1.025)",
              },
              "&:hover .portfolio-masonry-gradient, &:hover .portfolio-masonry-title": {
                opacity: 1,
              },
              "&:focus-visible .portfolio-masonry-gradient, &:focus-visible .portfolio-masonry-title": {
                opacity: 1,
              },
            }}
          >
            <Box
              component="img"
              src={project.imageUrl}
              alt={project.title}
              width={1200}
              height={900}
              loading="lazy"
              sx={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "transform 520ms cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            />
            <Box
              className="portfolio-masonry-gradient"
              sx={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                height: "48%",
                background:
                  "linear-gradient(to top, rgba(0, 0, 0, 0.72), rgba(0, 0, 0, 0))",
                opacity: { xs: 1, md: 0 },
                transition: "opacity 260ms ease-in",
              }}
            />
            <Typography
              className="portfolio-masonry-title"
              variant={hero ? "h2" : "h3"}
              component="h3"
              sx={{
                fontFamily: typography.fontFamilyDisplay,
                position: "absolute",
                left: { xs: "20px", md: hero ? "32px" : "24px" },
                right: { xs: "20px", md: hero ? "32px" : "24px" },
                bottom: { xs: "12px", md: hero ? "28px" : "20px" },
                color: colors.white,
                opacity: { xs: 0.68, md: 0 },
                transition: "opacity 260ms ease-in",
              }}
            >
              {project.title}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};

export default PortfolioMasonry;
