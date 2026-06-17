"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import type { Theme } from "@mui/material/styles";
import { colors } from "@/app/theme/tokens";
import VideoToggleButton from "@/components/ui/VideoToggleButton/VideoToggleButton";

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
  slides: ProjectRealizationSlide[];
}

const SCROLL_COOLDOWN_MS = 720;

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
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (slide.mediaType !== "VIDEO" || !videoRef.current) return;

    if (!active) {
      videoRef.current.pause();
      return;
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
            sx={{ position: "absolute", left: { xs: 18, md: 32 }, bottom: { xs: 18, md: 32 } }}
          />
        </>
      ) : (
        <Box
          component="img"
          src={slide.mediaUrl}
          alt={slide.alt ?? slide.title}
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

const ProgressRail = ({
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
      position: "absolute",
      left: { md: 40, lg: 56 },
      bottom: { md: 34, lg: 40 },
      width: "calc(50% - 112px)",
      display: { xs: "none", md: "flex" },
      alignItems: "center",
      zIndex: 2,
    }}
  >
    <Box sx={{ position: "absolute", left: 0, right: 0, height: "1px", backgroundColor: colors.blueGrayDark }} />
    <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", position: "relative" }}>
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
              width: 28,
              height: 28,
              border: active ? `1px solid ${colors.mutedBlack}` : "1px solid transparent",
              borderRadius: "50%",
              background: "transparent",
              display: "grid",
              placeItems: "center",
              p: 0,
              cursor: "pointer",
            }}
          >
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: active ? colors.mutedBlack : colors.blueGrayDark,
              }}
            />
          </Box>
        );
      })}
    </Box>
  </Box>
);

const DesktopViewer = ({ projectTitle, slides }: ProjectRealizationViewerProps) => {
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
        height: "calc(100svh - var(--header-height))",
        minHeight: 640,
        position: "relative",
        overflow: "hidden",
        backgroundColor: colors.offWhite,
      }}
    >
      <Box
        sx={{
          position: "relative",
          px: { md: 5, lg: 7 },
          pt: { md: 4, lg: 5 },
          pb: 12,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h6" component="p" sx={{ mb: "auto", color: colors.green }}>
          {projectTitle}
        </Typography>
        <Box
          key={activeSlide.id}
          sx={{
            maxWidth: 560,
            animation: "realizationTextIn 420ms ease both",
            "@keyframes realizationTextIn": {
              from: { opacity: 0, transform: "translateY(10px)" },
              to: { opacity: 1, transform: "translateY(0)" },
            },
          }}
        >
          <Typography variant="h1" component="h1" sx={{ mb: 3 }}>
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
        <ProgressRail activeIndex={activeIndex} count={slides.length} onSelect={goTo} />
      </Box>

      <Box sx={{ position: "relative", backgroundColor: colors.mutedBlack }}>
        {slides.map((slide, index) => (
          <Box
            key={slide.id}
            sx={{
              position: "absolute",
              inset: 0,
              opacity: index === activeIndex ? 1 : 0,
              transform: index === activeIndex ? "scale(1)" : "scale(1.015)",
              transition: "opacity 500ms ease, transform 700ms ease",
              pointerEvents: index === activeIndex ? "auto" : "none",
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

  useEffect(() => {
    const media = mediaRef.current;
    if (!media || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = media.getBoundingClientRect();
      const centerDelta = rect.top + rect.height / 2 - window.innerHeight / 2;
      setOffset(Math.max(-18, Math.min(18, centerDelta * -0.035)));
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
          ml: "auto",
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
          ml: 0,
          mr: "auto",
          position: "relative",
          zIndex: 1,
          backgroundColor: colors.white,
          px: 2.5,
          py: 3,
          boxShadow: "0 18px 40px rgba(28, 29, 30, 0.10)",
        }}
      >
        <Typography variant="h2" component={index === 0 ? "h1" : "h2"} sx={{ mb: 2 }}>
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

const MobileViewer = ({ projectTitle, slides }: ProjectRealizationViewerProps) => (
  <Box
    component="section"
    data-testid="project-realization-viewer-mobile"
    sx={{
      display: { xs: "block", md: "none" },
      backgroundColor: colors.offWhite,
      px: 2,
      pt: 3,
      pb: 5,
    }}
  >
    <Typography variant="h6" component="p" sx={{ mb: 3, color: colors.green }}>
      {projectTitle}
    </Typography>
    {slides.map((slide, index) => (
      <MobileSlide key={slide.id} slide={slide} index={index} />
    ))}
  </Box>
);

const ProjectRealizationViewer = ({ projectTitle, slides }: ProjectRealizationViewerProps) => {
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up("md"), { noSsr: true });
  const normalizedSlides = useMemo(() => slides.filter((slide) => slide.mediaUrl), [slides]);

  if (normalizedSlides.length === 0) return null;

  return isDesktop ? (
    <DesktopViewer projectTitle={projectTitle} slides={normalizedSlides} />
  ) : (
    <MobileViewer projectTitle={projectTitle} slides={normalizedSlides} />
  );
};

export default ProjectRealizationViewer;
