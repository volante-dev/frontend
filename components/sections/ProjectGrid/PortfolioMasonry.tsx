"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { useCallback, useMemo, useRef } from "react";
import { colors, typography } from "@/app/theme/tokens";
import { useI18n } from "@/components/providers/I18nProvider/I18nProvider";
import AppleTvCard from "@/components/ui/AppleTvCard/AppleTvCard";
import DepthHoverGroup, {
  depthHoverDirectionProps,
  depthHoverItemStyle,
  depthHoverTriggerProps,
} from "@/components/ui/DepthHoverGroup/DepthHoverGroup";
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
    intro: string | null;
  };
};

const isHero = (project: Project) => project.portfolioSize === "HERO";

const inferMediaTypeFromUrl = (value: string) =>
  /\.(mp4|mov|webm)(?:[?#].*)?$/i.test(value) ? "VIDEO" : "IMAGE";

const truncateMobileDescription = (value: string, maxLength = 140) => {
  const normalized = value.trim().replace(/\s+/g, " ");
  if (normalized.length <= maxLength) return normalized;

  return `${normalized.slice(0, maxLength - 1).trimEnd()}…`;
};

const mediaSx = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  transform: "scale(1.035)",
  transition: "transform 520ms cubic-bezier(0.22, 1, 0.36, 1)",
} as const;

const overlayTitleShadow =
  "0 16px 46px rgba(0, 0, 0, 0.62), 0 4px 18px rgba(0, 0, 0, 0.42)";
const overlayBodyShadow =
  "0 12px 36px rgba(0, 0, 0, 0.58), 0 2px 12px rgba(0, 0, 0, 0.38)";

const getDepthHoverDirection = (placement: DesktopMasonryPlacement) =>
  placement.columnStart <= 2 ? "left" : "right";

const getDepthHoverStyle = (placement: DesktopMasonryPlacement) => {
  const itemCenterColumn = placement.columnStart + placement.columnSpan / 2 - 0.5;
  const gridCenterColumn = 2.5;
  const translateX = (gridCenterColumn - itemCenterColumn) * 8.7;
  const scale = placement.columnSpan > 1 || placement.rowSpan > 1 ? 0.978 : 0.982;

  return depthHoverItemStyle({ translateX, scale });
};

const ProjectCoverMedia = ({ project }: { project: Project }) => {
  const mediaType = project.coverMediaType ?? inferMediaTypeFromUrl(project.imageUrl);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const handleVideoPointerEnter = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.play().catch(() => {
      // Browsers can still reject playback depending on user settings.
    });
  }, []);
  const handleVideoPointerLeave = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.pause();
    video.currentTime = 0;
  }, []);

  return mediaType === "VIDEO" ? (
    <Box
      ref={videoRef}
      component="video"
      src={project.imageUrl}
      poster={project.coverPosterUrl ?? undefined}
      muted
      loop
      playsInline
      preload="metadata"
      onPointerEnter={handleVideoPointerEnter}
      onPointerLeave={handleVideoPointerLeave}
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
  const { localizedHref, locale } = useI18n();
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
    const heroDescription = project.description.trim();
    const desktopPlacement: DesktopMasonryPlacement | undefined = forcedHero
      ? { columnStart: 3, rowStart: 1, columnSpan: 2, rowSpan: 2 }
      : desktopPlacements.get(project.id);
    const depthHoverDirection = desktopPlacement
      ? getDepthHoverDirection(desktopPlacement)
      : "center";
    const depthHoverStyle = desktopPlacement
      ? getDepthHoverStyle(desktopPlacement)
      : undefined;

    return (
      <AppleTvCard
        key={project.id}
        component={Link}
        href={`${portfolioHref}/${project.slug}`}
        data-link-variant="plain"
        {...depthHoverTriggerProps}
        {...depthHoverDirectionProps(depthHoverDirection)}
        style={depthHoverStyle}
        tilt={hero ? 2 : 4}
        parallax={hero ? 10 : 14}
        overlay={
          <>
            <Box
              className="portfolio-masonry-gradient"
              sx={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                height: hero ? "68%" : "48%",
                background:
                  "linear-gradient(to top, rgba(0, 0, 0, 0.72), rgba(0, 0, 0, 0))",
                opacity: { xs: 1, md: 0 },
                transition: "opacity 260ms ease-in",
              }}
            />
            <Box
              className="portfolio-masonry-copy"
              sx={{
                position: "absolute",
                left: { xs: "20px", md: hero ? "32px" : "24px" },
                right: { xs: "20px", md: hero ? "32px" : "24px" },
                bottom: { xs: "12px", md: hero ? "28px" : "20px" },
                opacity: { xs: 1, md: 0 },
                transition: "opacity 260ms ease-in",
              }}
            >
              <Typography
                variant={hero ? "h2" : "h3"}
                component="h3"
                sx={{
                  fontFamily: typography.fontFamilyDisplay,
                  fontWeight: hero ? { xs: 300, md: 200 } : 300,
                  color: colors.white,
                  textShadow: overlayTitleShadow,
                }}
              >
                {project.title}
              </Typography>
              {hero && heroDescription && (
                <>
                  <Typography
                    variant="body2"
                    sx={{
                      display: { xs: "none", md: "block" },
                      mt: 1.5,
                      maxWidth: 520,
                      color: colors.white,
                      textShadow: overlayBodyShadow,
                    }}
                  >
                    {heroDescription}
                  </Typography>
                  <Typography
                    variant="body2"
                    lang={locale}
                    sx={{
                      display: { xs: "block", md: "none" },
                      mt: 1,
                      maxWidth: 520,
                      color: colors.white,
                      lineHeight: 1.45,
                      hyphens: "auto",
                      overflowWrap: "break-word",
                      textShadow: overlayBodyShadow,
                    }}
                  >
                    {truncateMobileDescription(heroDescription)}
                  </Typography>
                </>
              )}
            </Box>
          </>
        }
        sx={{
          position: "relative",
          display: "block",
          overflow: "visible",
          minHeight: 0,
          color: colors.white,
          textDecoration: "none",
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
            transform: "scale(1.045)",
          },
          "&:hover .portfolio-masonry-gradient, &:hover .portfolio-masonry-copy": {
            opacity: 1,
          },
          "&:focus-visible .portfolio-masonry-gradient, &:focus-visible .portfolio-masonry-copy": {
            opacity: 1,
          },
        }}
      >
        <ProjectCoverMedia project={project} />
      </AppleTvCard>
    );
  };

  return (
    <DepthHoverGroup
      component="section"
      data-testid="portfolio-masonry"
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", md: "repeat(4, minmax(0, 1fr))" },
        gridAutoRows: { xs: "minmax(150px, 48vw)", md: "minmax(180px, 22vw)" },
        gap: { xs: "8px", md: "20px" },
        p: { xs: "8px", md: "20px" },
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
        {header.intro && (
          <Typography
            variant="body1"
            sx={{
              mt: { xs: 2, md: 3 },
              maxWidth: 560,
              color: colors.mutedBlackLight,
              lineHeight: 1.55,
            }}
          >
            {header.intro}
          </Typography>
        )}
      </Box>

      {firstProject && renderProject(firstProject, true)}
      {remainingProjects.map((project) => renderProject(project))}
    </DepthHoverGroup>
  );
};

export default PortfolioMasonry;
