"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { colors } from "@/app/theme/tokens";
import { getLocalizedHref } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import type { Project } from "./ProjectGrid";
import { getDesktopMasonryPlacements } from "./masonry-layout";

type PortfolioMasonryProps = {
  projects: Project[];
};

const isHero = (project: Project) => project.portfolioSize === "HERO";

const PortfolioMasonry = ({ projects }: PortfolioMasonryProps) => {
  const pathname = usePathname();
  const locale: Locale = pathname === "/en" || pathname.startsWith("/en/") ? "en" : "fr";
  const portfolioHref = getLocalizedHref(locale, "portfolio");
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
              "&:hover .portfolio-masonry-title": {
                opacity: 1,
              },
              "&:focus-visible .portfolio-masonry-title": {
                opacity: 1,
              },
            }}
          >
            <Box
              component="img"
              src={project.imageUrl}
              alt={project.title}
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
              sx={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                height: "48%",
                background:
                  "linear-gradient(to top, rgba(0, 0, 0, 0.72), rgba(0, 0, 0, 0))",
              }}
            />
            <Typography
              className="portfolio-masonry-title"
              variant={hero ? "h2" : "h4"}
              component="h3"
              sx={{
                position: "absolute",
                left: { xs: 1.5, md: hero ? 3 : 2 },
                right: { xs: 1.5, md: hero ? 3 : 2 },
                bottom: { xs: 1.5, md: hero ? 3 : 2 },
                color: colors.white,
                opacity: 0.68,
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
