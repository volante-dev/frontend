"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useMediaQuery from "@mui/material/useMediaQuery";
import type { Theme } from "@mui/material/styles";
import { colors } from "@/app/theme/tokens";
import VideoToggleButton from "@/components/ui/VideoToggleButton/VideoToggleButton";
import LiquidGlassFilter from "@/components/ui/LiquidGlass/LiquidGlassFilter";
import { useLiquidGlass } from "@/components/ui/LiquidGlass/useLiquidGlass";
import { useI18n } from "@/components/providers/I18nProvider/I18nProvider";

export interface ProjectRealizationSlide {
  id: string;
  title: string;
  contentHtml: string;
  mediaType: "IMAGE" | "VIDEO";
  mediaUrl: string;
  posterUrl?: string | null;
  alt?: string | null;
}

interface ProjectRealizationViewerProps {
  projectTitle: string;
  projectDescription?: string;
  facts?: Array<{ label: string; value: string }>;
  slides: ProjectRealizationSlide[];
}

const ProjectOverview = ({
  projectTitle,
  projectDescription,
  facts = [],
  compact = false,
}: Omit<ProjectRealizationViewerProps, "slides"> & { compact?: boolean }) => (
  <Box>
    <Typography variant="h6" component="h1" sx={{ color: colors.green, mb: facts.length ? 1.5 : 0 }}>
      {projectTitle}
    </Typography>
    {facts.length > 0 && (
      <Box
        component="dl"
        sx={{
          m: 0,
          display: "grid",
          gridTemplateColumns: compact ? "repeat(2, minmax(0, 1fr))" : "repeat(3, minmax(0, 1fr))",
          gap: 1.25,
          maxWidth: 620,
        }}
      >
        {facts.map((fact) => (
          <Box key={fact.label}>
            <Typography component="dt" variant="caption" sx={{ color: colors.mutedBlackLight }}>
              {fact.label}
            </Typography>
            <Typography component="dd" variant="body2" sx={{ m: 0 }}>
              {fact.value}
            </Typography>
          </Box>
        ))}
      </Box>
    )}
    {compact && projectDescription && (
      <Typography variant="body2" sx={{ mt: 2, maxWidth: 560 }}>
        {projectDescription}
      </Typography>
    )}
  </Box>
);

const SCROLL_COOLDOWN_MS = 980;
const CLOSE_BUTTON_SIZE = 44;
const CLOSE_BUTTON_RADIUS = 22;

const ProjectMedia = ({
  slide,
  active = true,
  priority = false,
}: {
  slide: ProjectRealizationSlide;
  active?: boolean;
  priority?: boolean;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wasActiveRef = useRef(false);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (slide.mediaType !== "VIDEO" || !videoRef.current) return;

    if (!active) {
      videoRef.current.pause();
      wasActiveRef.current = false;
      return;
    }

    if (!wasActiveRef.current) {
      videoRef.current.currentTime = 0;
      wasActiveRef.current = true;
    }

    if (playing) {
      void videoRef.current.play().catch(() => setPlaying(false));
    } else {
      videoRef.current.pause();
    }
  }, [active, playing, slide.mediaType, slide.mediaUrl]);

  const toggle = () => {
    if (slide.mediaType !== "VIDEO") return;
    setPlaying((value) => !value);
  };

  return (
    <Box sx={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
      {slide.mediaType === "VIDEO" ? (
        <>
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload={priority ? "auto" : "metadata"}
            poster={slide.posterUrl ?? undefined}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          >
            <source src={slide.mediaUrl} type="video/mp4" />
          </video>
          <VideoToggleButton
            playing={playing}
            onToggle={toggle}
            sx={{ position: "absolute", left: { xs: 18, md: 32 }, bottom: { xs: 66, md: 32 } }}
          />
        </>
      ) : (
        <Box
          component="img"
          src={slide.mediaUrl}
          alt={slide.alt ?? slide.title}
          width={1600}
          height={1200}
          loading={priority ? "eager" : "lazy"}
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      )}
    </Box>
  );
};

const CloseProjectButton = () => {
  const { localizedHref, t } = useI18n();
  const portfolioHref = localizedHref("portfolio");
  const router = useRouter();

  const handleClose = useCallback(() => {
    try {
      if (document.referrer && new URL(document.referrer).origin === window.location.origin) {
        router.back();
        return;
      }
    } catch {}
    router.push(portfolioHref);
  }, [router, portfolioHref]);

  const { filterId, displacementUrl, specularUrl, isSupported, scale } = useLiquidGlass({
    width: CLOSE_BUTTON_SIZE,
    height: CLOSE_BUTTON_SIZE,
    radius: CLOSE_BUTTON_RADIUS,
  });
  const glassActive = isSupported && displacementUrl && specularUrl;

  return (
    <>
      {glassActive && (
        <LiquidGlassFilter
          filterId={filterId}
          displacementUrl={displacementUrl}
          specularUrl={specularUrl}
          width={CLOSE_BUTTON_SIZE}
          height={CLOSE_BUTTON_SIZE}
          scale={scale}
        />
      )}
      <IconButton
        onClick={handleClose}
        aria-label={t("portfolio.close", "Fermer la réalisation")}
        sx={{
          position: "absolute",
          top: {
            xs: "calc(var(--header-height) + 18px)",
            md: "calc(var(--header-height) + 32px)",
            lg: "calc(var(--header-height) + 40px)",
          },
          right: { xs: 18, md: 40, lg: 56 },
          zIndex: 4,
          width: { xs: 40, md: CLOSE_BUTTON_SIZE },
          height: { xs: 40, md: CLOSE_BUTTON_SIZE },
          borderRadius: "50%",
          color: colors.mutedBlack,
          transform: "translateZ(0)",
          transition: "background-color 220ms ease, transform 220ms ease",
          ...(glassActive
            ? {
                backdropFilter: `url(#${filterId})`,
                WebkitBackdropFilter: `url(#${filterId})`,
                backgroundColor: "rgba(255, 255, 255, 0.35)",
                border: "none",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.16)",
              }
            : {
                backgroundColor: "rgba(247, 248, 249, 0.65)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(255, 255, 255, 0.8)",
                boxShadow: "0 4px 24px rgba(0, 0, 0, 0.12)",
              }),
          "&:hover": {
            backgroundColor: glassActive ? "rgba(255, 255, 255, 0.42)" : "rgba(247, 248, 249, 0.85)",
            transform: "translateZ(0) scale(1.04)",
          },
        }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  );
};

const VerticalProgressRail = ({
  activeIndex,
  count,
  onSelect,
}: {
  activeIndex: number;
  count: number;
  onSelect: (index: number) => void;
}) => (
  <Box
    aria-label="Progression de la réalisation"
    sx={{
      display: { xs: "none", md: "flex" },
      justifyContent: "center",
      alignItems: "stretch",
      minHeight: 220,
      width: 32,
      pt: 0.5,
      pb: 0.5,
    }}
  >
    <Box
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        width: 28,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 14,
          bottom: 14,
          left: "50%",
          width: "1px",
          transform: "translateX(-50%)",
          backgroundColor: colors.blueGrayDark,
        }}
      />
      {Array.from({ length: count }).map((_, index) => {
        const active = index === activeIndex;
        return (
          <Box
            key={index}
            component="button"
            type="button"
            aria-label={`Aller à la vue ${index + 1}`}
            aria-current={active ? "step" : undefined}
            onClick={() => onSelect(index)}
            sx={{
              position: "relative",
              zIndex: 1,
              width: 28,
              height: 28,
              border: active ? `1px solid ${colors.mutedBlack}` : "1px solid transparent",
              borderRadius: "50%",
              background: "transparent",
              display: "grid",
              placeItems: "center",
              p: 0,
              cursor: "pointer",
              transition: "border-color 360ms ease, transform 360ms ease",
              transform: active ? "scale(1)" : "scale(0.86)",
            }}
          >
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: active ? colors.mutedBlack : colors.blueGrayDark,
                transition: "background-color 360ms ease, transform 360ms ease",
                transform: active ? "scale(1)" : "scale(0.82)",
              }}
            />
          </Box>
        );
      })}
    </Box>
  </Box>
);

const DesktopViewer = ({ projectTitle, projectDescription, facts, slides }: ProjectRealizationViewerProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const lockUntil = useRef(0);
  const activeSlide = slides[activeIndex];

  const goTo = (nextIndex: number) => {
    setActiveIndex(Math.max(0, Math.min(slides.length - 1, nextIndex)));
  };

  const handleWheel = (event: React.WheelEvent<HTMLElement>) => {
    if (slides.length < 2) return;
    event.preventDefault();

    const now = Date.now();
    if (now < lockUntil.current || Math.abs(event.deltaY) < 8) return;

    lockUntil.current = now + SCROLL_COOLDOWN_MS;
    goTo(activeIndex + (event.deltaY > 0 ? 1 : -1));
  };

  return (
    <Box
      component="section"
      data-testid="project-realization-viewer"
      onWheel={handleWheel}
      sx={{
        display: { xs: "none", md: "grid" },
        gridTemplateColumns: "1fr 1fr",
        height: "100svh",
        minHeight: 640,
        position: "relative",
        overflow: "hidden",
        backgroundColor: colors.offWhite,
        animation: "realizationViewerIn 1300ms cubic-bezier(0.16, 1, 0.3, 1) both",
        "@keyframes realizationViewerIn": {
          from: { opacity: 0.001 },
          to: { opacity: 1 },
        },
        "@media (prefers-reduced-motion: reduce)": {
          animation: "none",
        },
      }}
    >
      <CloseProjectButton />
      <Box
        sx={{
          position: "relative",
          px: { md: 5, lg: 7 },
          pt: {
            md: "calc(var(--header-height) + 32px)",
            lg: "calc(var(--header-height) + 40px)",
          },
          pb: 12,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          animation: "realizationTextColumnIn 1250ms 260ms cubic-bezier(0.16, 1, 0.3, 1) both",
          "@keyframes realizationTextColumnIn": {
            from: { opacity: 0, transform: "translateY(14px)" },
            to: { opacity: 1, transform: "translateY(0)" },
          },
          "@media (prefers-reduced-motion: reduce)": {
            animation: "none",
          },
        }}
      >
        <Box sx={{ mb: "auto" }}>
          <ProjectOverview projectTitle={projectTitle} projectDescription={projectDescription} facts={facts} />
        </Box>
        <Box
          key={activeSlide.id}
          sx={{
            display: "grid",
            gridTemplateColumns: "32px minmax(0, 560px)",
            gap: { md: 2.5, lg: 3 },
            alignItems: "stretch",
            maxWidth: 640,
            animation: "realizationTextIn 760ms cubic-bezier(0.22, 1, 0.36, 1) both",
            "@keyframes realizationTextIn": {
              from: { opacity: 0, transform: "translateY(16px)" },
              to: { opacity: 1, transform: "translateY(0)" },
            },
            "@media (prefers-reduced-motion: reduce)": {
              animation: "none",
            },
          }}
        >
          <VerticalProgressRail
            activeIndex={activeIndex}
            count={slides.length}
            onSelect={goTo}
          />
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h1" component="h2" sx={{ mb: 3 }}>
              {activeSlide.title}
            </Typography>
            <Box
              sx={{
                "& p": { typography: "body1", mb: 2 },
                "& h3": { typography: "h3", mt: 4, mb: 1.5 },
                "& h4": { typography: "h4", mt: 3, mb: 1 },
                "& ul, & ol": { pl: 3, my: 2 },
                "& li": { mb: 0.75 },
                "& a": { color: colors.green, textDecorationColor: colors.greenLight },
              }}
              dangerouslySetInnerHTML={{ __html: activeSlide.contentHtml }}
            />
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          position: "relative",
          backgroundColor: colors.mutedBlack,
          overflow: "hidden",
          animation: "realizationMediaReveal 1450ms 80ms cubic-bezier(0.16, 1, 0.3, 1) both",
          transformOrigin: "right center",
          "@keyframes realizationMediaReveal": {
            from: { opacity: 0, transform: "scale(1.025) translateX(18px)" },
            to: { opacity: 1, transform: "scale(1) translateX(0)" },
          },
          "@media (prefers-reduced-motion: reduce)": {
            animation: "none",
          },
        }}
      >
        {slides.map((slide, index) => (
          <Box
            key={slide.id}
            sx={{
              position: "absolute",
              inset: 0,
              opacity: index === activeIndex ? 1 : 0,
              transform: index === activeIndex ? "scale(1)" : "scale(1.015)",
              transition:
                "opacity 780ms cubic-bezier(0.22, 1, 0.36, 1), transform 1100ms cubic-bezier(0.22, 1, 0.36, 1)",
              pointerEvents: index === activeIndex ? "auto" : "none",
              "@media (prefers-reduced-motion: reduce)": {
                transition: "none",
              },
            }}
          >
            <ProjectMedia slide={slide} active={index === activeIndex} priority={index === 0} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

const MobileSlide = ({ slide, index }: { slide: ProjectRealizationSlide; index: number }) => {
  const mediaRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const imageOnRight = index % 2 === 0;

  useEffect(() => {
    const media = mediaRef.current;
    if (!media || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = media.getBoundingClientRect();
      const centerDelta = rect.top + rect.height / 2 - window.innerHeight / 2;
      setOffset(Math.max(-24, Math.min(24, centerDelta * -0.045)));
    };
    const schedule = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <Box component="article" sx={{ mb: 7 }}>
      <Box
        ref={mediaRef}
        sx={{
          width: "88%",
          ml: imageOnRight ? "auto" : 0,
          mr: imageOnRight ? 0 : "auto",
          height: { xs: "58svh", sm: "64svh" },
          minHeight: 380,
          overflow: "hidden",
          backgroundColor: colors.mutedBlack,
          transform: `translateY(${offset}px)`,
          transition: "transform 120ms linear",
        }}
      >
        <ProjectMedia slide={slide} priority={index === 0} />
      </Box>
      <Box
        sx={{
          width: "86%",
          mt: -6,
          ml: imageOnRight ? 0 : "auto",
          mr: imageOnRight ? "auto" : 0,
          position: "relative",
          zIndex: 1,
          backgroundColor: colors.white,
          px: 2.5,
          py: 3,
          boxShadow: "0 18px 40px rgba(28, 29, 30, 0.10)",
        }}
      >
        <Typography variant="h2" component="h2" sx={{ mb: 2 }}>
          {slide.title}
        </Typography>
        <Box
          sx={{
            "& p": { typography: "body2", mb: 1.5, color: colors.mutedBlack },
            "& h3": { typography: "h4", mt: 3, mb: 1 },
            "& h4": { typography: "h5", mt: 2.5, mb: 1 },
            "& ul, & ol": { pl: 2.5, my: 1.5 },
            "& li": { mb: 0.75 },
            "& a": { color: colors.green, textDecorationColor: colors.greenLight },
          }}
          dangerouslySetInnerHTML={{ __html: slide.contentHtml }}
        />
      </Box>
    </Box>
  );
};

const MobileViewer = ({ projectTitle, projectDescription, facts, slides }: ProjectRealizationViewerProps) => (
  <Box
    component="section"
    data-testid="project-realization-viewer-mobile"
    sx={{
      display: { xs: "block", md: "none" },
      backgroundColor: colors.offWhite,
      px: 2,
      pt: "calc(var(--header-height) + 24px)",
      pb: 5,
      position: "relative",
    }}
  >
    <CloseProjectButton />
    <Box sx={{ mb: 4 }}>
      <ProjectOverview
        projectTitle={projectTitle}
        projectDescription={projectDescription}
        facts={facts}
        compact
      />
    </Box>
    {slides.map((slide, index) => (
      <MobileSlide key={slide.id} slide={slide} index={index} />
    ))}
  </Box>
);

const ProjectRealizationViewer = ({ projectTitle, projectDescription, facts, slides }: ProjectRealizationViewerProps) => {
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up("md"), { noSsr: true });
  const normalizedSlides = useMemo(() => slides.filter((slide) => slide.mediaUrl), [slides]);

  if (normalizedSlides.length === 0) return null;

  return isDesktop ? (
    <DesktopViewer projectTitle={projectTitle} projectDescription={projectDescription} facts={facts} slides={normalizedSlides} />
  ) : (
    <MobileViewer projectTitle={projectTitle} projectDescription={projectDescription} facts={facts} slides={normalizedSlides} />
  );
};

export default ProjectRealizationViewer;
