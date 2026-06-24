"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { useMemo } from "react";
import { colors, typography } from "@/app/theme/tokens";
import { useI18n } from "@/components/providers/I18nProvider/I18nProvider";
import type { Project } from "./project-types";
import {
  getDesktopMasonryPlacements,
  type DesktopMasonryPlacement,
} from "./masonry-layout";

type PortfolioMasonryProps = {
  projects: Project[];
  header: {
    eyebrow: string;
    title: string;
  };
};

const isHero = (project: Project) => project.portfolioSize === "HERO";

const inferMediaTypeFromUrl = (value: string) =>
  /\.(mp4|mov|webm)(?:[?#].*)?$/i.test(value) ? "VIDEO" : "IMAGE";

const mediaSx = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  transition: "transform 520ms cubic-bezier(0.22, 1, 0.36, 1)",
} as const;

const ProjectCoverMedia = ({ project }: { project: Project }) => {
  const mediaType = project.coverMediaType ?? inferMediaTypeFromUrl(project.imageUrl);

  return mediaType === "VIDEO" ? (
    <Box
      component="video"
      src={project.imageUrl}
      poster={project.coverPosterUrl ?? undefined}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      sx={mediaSx}
    />
  ) : (
    <Box
      component="img"
      src={project.imageUrl}
      alt={project.title}
      width={1200}
      height={900}
      loading="lazy"
      sx={mediaSx}
    />
  );
};

const PortfolioMasonry = ({ projects, header }: PortfolioMasonryProps) => {
  const { localizedHref } = useI18n();
  const portfolioHref = localizedHref("portfolio");
  const firstProject = projects[0];
  const remainingProjects = useMemo(() => projects.slice(1), [projects]);
  const desktopPlacements = useMemo(
    () =>
      getDesktopMasonryPlacements(remainingProjects, {
        rowStart: 3,
        promoteNormalBands: true,
      }),
    [remainingProjects],
  );

  const renderProject = (project: Project, forcedHero = false) => {
    const hero = forcedHero || isHero(project);
    const desktopPlacement: DesktopMasonryPlacement | undefined = forcedHero
      ? { columnStart: 3, rowStart: 1, columnSpan: 2, rowSpan: 2 }
      : desktopPlacements.get(project.id);

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
          "&:hover img, &:hover video": {
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
        <ProjectCoverMedia project={project} />
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
  };

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
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          minHeight: 0,
          px: { xs: 2.5, md: 4 },
          py: { xs: 3, md: 4 },
          backgroundColor: colors.offWhite,
          border: `1px solid ${colors.blueGray}`,
          gridColumn: { xs: "span 2", md: "1 / span 2" },
          gridRow: { xs: "span 2", md: "1 / span 2" },
        }}
      >
        <Typography variant="subtitle2" sx={{ mb: 3, color: colors.green }}>
          {header.eyebrow}
        </Typography>
        <Typography
          variant="h1"
          sx={{
            maxWidth: 620,
            color: colors.mutedBlack,
          }}
        >
          {header.title}
        </Typography>
      </Box>

      {firstProject && renderProject(firstProject, true)}
      {remainingProjects.map((project) => renderProject(project))}
    </Box>
  );
};

export default PortfolioMasonry;
