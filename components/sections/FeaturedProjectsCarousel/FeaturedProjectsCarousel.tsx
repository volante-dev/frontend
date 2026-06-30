"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Link from "next/link";
import Button from "@/components/ui/Button/Button";
import { colors, typography } from "@/app/theme/tokens";
import { useI18n } from "@/components/providers/I18nProvider/I18nProvider";
import type { Project } from "@/components/sections/ProjectGrid/project-types";

type FeaturedProjectsCarouselProps = {
  projects: Project[];
};

type DragState = {
  pointerId: number;
  pointerType: string;
  startX: number;
  startY: number;
  startedAt: number;
  moved: boolean;
  directionLocked: "horizontal" | "vertical" | null;
};

const FALLBACK_PALETTE = [
  colors.green,
  colors.greenLight,
  colors.champagne,
  colors.blueGrayDark,
];
const DRAG_CLICK_THRESHOLD_TOUCH = 6;
const DRAG_CLICK_THRESHOLD_MOUSE = 14;
const DRAG_SUPPRESS_CLICK_THRESHOLD = 2;
const DIRECTION_LOCK_THRESHOLD = 10;
const CAROUSEL_CARD_TRANSITION =
  "left 820ms cubic-bezier(0.22, 1, 0.36, 1), width 820ms cubic-bezier(0.22, 1, 0.36, 1), transform 820ms cubic-bezier(0.22, 1, 0.36, 1), opacity 300ms ease";
const MOBILE_CAROUSEL_CARD_TRANSITION =
  "left 520ms cubic-bezier(0.22, 1, 0.36, 1), transform 520ms cubic-bezier(0.22, 1, 0.36, 1), opacity 220ms ease";
const SLIDE_HALO_TRANSITION =
  "left 820ms cubic-bezier(0.22, 1, 0.36, 1), width 820ms cubic-bezier(0.22, 1, 0.36, 1), transform 820ms cubic-bezier(0.22, 1, 0.36, 1), opacity 620ms ease";

const modulo = (value: number, length: number) =>
  ((value % length) + length) % length;

const normalizeHex = (
  value: string | null | undefined,
  fallback = FALLBACK_PALETTE[0],
) => {
  const match = value?.trim().match(/^#([0-9a-f]{6})$/i);
  return match ? `#${match[1].toUpperCase()}` : fallback;
};

const normalizePalette = (palette: string[] | undefined) =>
  FALLBACK_PALETTE.map((fallback, index) =>
    normalizeHex(palette?.[index], fallback),
  );

const inferMediaTypeFromUrl = (value: string) =>
  /\.(mp4|mov|webm)(?:[?#].*)?$/i.test(value) ? "VIDEO" : "IMAGE";

const coverMediaSx = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  pointerEvents: "none",
  transition: "transform 900ms cubic-bezier(0.22, 1, 0.36, 1)",
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
      sx={coverMediaSx}
    />
  ) : (
    <Box
      component="img"
      src={project.imageUrl}
      alt=""
      width={1600}
      height={1200}
      loading="lazy"
      sx={coverMediaSx}
    />
  );
};

const SlideHalo = ({
  project,
  position,
  active,
  visible,
  dragging,
}: {
  project: Project;
  position: number;
  active: boolean;
  visible: boolean;
  dragging: boolean;
}) => {
  const palette = normalizePalette(project.heroPaletteComputed);
  const opacity = visible ? (active ? 1 : 0.54) : 0;

  return (
    <Box
      aria-hidden
      style={
        {
          "--slide-halo-primary": palette[0],
          "--slide-halo-secondary": palette[1],
          "--slide-halo-accent": palette[2],
          "--slide-halo-muted": palette[3],
        } as CSSProperties
      }
      sx={{
        display: { xs: "none", md: "block" },
        position: "absolute",
        left: cardLeft(position),
        top: 0,
        bottom: 0,
        width: active
          ? "var(--carousel-active-width)"
          : "var(--carousel-side-width)",
        opacity,
        pointerEvents: "none",
        zIndex: 0,
        transform: "translate3d(var(--carousel-drag-offset), 0, 0)",
        transition: dragging ? "none" : SLIDE_HALO_TRANSITION,
        "@media (prefers-reduced-motion: reduce)": {
          transition: "none",
        },
        "@keyframes slideHaloCentralPrimary": {
          "0%, 100%": {
            opacity: active ? 1 : 0.82,
            transform: "translate3d(-50%, -50%, 0) scaleX(1.06)",
          },
          "50%": {
            opacity: active ? 0.64 : 0.42,
            transform: "translate3d(-50%, -50%, 0) scaleX(0.94)",
          },
        },
        "@keyframes slideHaloCentralSecondary": {
          "0%, 100%": {
            opacity: active ? 0.54 : 0.28,
            transform: "translate3d(-50%, -50%, 0) scaleX(0.98)",
          },
          "50%": {
            opacity: active ? 0.92 : 0.54,
            transform: "translate3d(-50%, -50%, 0) scaleX(1.12)",
          },
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          left: "50%",
          top: "54%",
          width: active ? { xs: "130%", md: "120%" } : { xs: "96%", md: "90%" },
          height: active ? "134%" : "98%",
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at center, var(--slide-halo-primary) 0%, var(--slide-halo-secondary) 42%, rgba(255, 255, 255, 0) 74%)",
          filter: active
            ? { xs: "blur(30px) saturate(1.5)", md: "blur(54px) saturate(1.5)" }
            : { xs: "blur(22px) saturate(1.32)", md: "blur(38px) saturate(1.32)" },
          transform: "translate3d(-50%, -50%, 0) scaleX(1.06)",
          animation: "slideHaloCentralPrimary 4.2s ease-in-out infinite",
          "@media (prefers-reduced-motion: reduce)": {
            animation: "none",
          },
        }}
      />
      <Box
        sx={{
          position: "absolute",
          left: "50%",
          top: "48%",
          width: active ? { xs: "112%", md: "104%" } : { xs: "80%", md: "74%" },
          height: active ? "120%" : "88%",
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at center, var(--slide-halo-accent) 0%, var(--slide-halo-muted) 40%, rgba(255, 255, 255, 0) 72%)",
          filter: active
            ? { xs: "blur(26px) saturate(1.56)", md: "blur(48px) saturate(1.56)" }
            : { xs: "blur(20px) saturate(1.36)", md: "blur(34px) saturate(1.36)" },
          transform: "translate3d(-50%, -50%, 0) scaleX(0.98)",
          animation: "slideHaloCentralSecondary 4.2s ease-in-out infinite",
          "@media (prefers-reduced-motion: reduce)": {
            animation: "none",
          },
        }}
      />
      <Box
        sx={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: active ? { xs: "120%", md: "112%" } : { xs: "88%", md: "82%" },
          height: active ? "126%" : "92%",
          borderRadius: { xs: 3, md: 4 },
          background:
            "radial-gradient(ellipse at center, color-mix(in srgb, var(--slide-halo-primary) 52%, var(--slide-halo-accent) 48%) 0%, rgba(255, 255, 255, 0) 70%)",
          filter: active
            ? { xs: "blur(34px) saturate(1.4)", md: "blur(60px) saturate(1.4)" }
            : { xs: "blur(22px) saturate(1.26)", md: "blur(40px) saturate(1.26)" },
          opacity: active ? 0.52 : 0.22,
          transform: "translate3d(-50%, -50%, 0)",
        }}
      />
    </Box>
  );
};

const MobileSlideHalo = ({
  project,
  position,
  active,
  visible,
  dragging,
}: {
  project: Project;
  position: number;
  active: boolean;
  visible: boolean;
  dragging: boolean;
}) => {
  const palette = normalizePalette(project.heroPaletteComputed);
  const opacity = visible && active ? 0.42 : 0;

  return (
    <Box
      aria-hidden
      style={
        {
          "--slide-halo-primary": palette[0],
          "--slide-halo-secondary": palette[1],
          "--slide-halo-accent": palette[2],
          "--slide-halo-muted": palette[3],
        } as CSSProperties
      }
      sx={{
        display: { xs: "block", md: "none" },
        position: "absolute",
        left: cardLeft(position),
        top: "-6%",
        width: active
          ? "var(--carousel-active-width)"
          : "var(--carousel-side-width)",
        height: "112%",
        pointerEvents: "none",
        zIndex: 0,
        opacity,
        transform: "translate3d(var(--carousel-drag-offset), 0, 0)",
        transition: dragging
          ? "none"
          : {
              xs: "left 520ms cubic-bezier(0.22, 1, 0.36, 1), transform 520ms cubic-bezier(0.22, 1, 0.36, 1), opacity 260ms ease",
              md: "none",
            },
        "@media (prefers-reduced-motion: reduce)": {
          transition: "none",
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: "-10% -16%",
          borderRadius: "42%",
          background:
            "radial-gradient(ellipse at center, var(--slide-halo-primary) 0%, var(--slide-halo-secondary) 42%, rgba(255, 255, 255, 0) 74%)",
          filter: "blur(22px) saturate(1.18)",
          transform: "translateZ(0)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          inset: "4% 0 0 10%",
          borderRadius: "42%",
          background:
            "radial-gradient(ellipse at center, var(--slide-halo-accent) 0%, var(--slide-halo-muted) 44%, rgba(255, 255, 255, 0) 72%)",
          filter: "blur(18px) saturate(1.16)",
          opacity: 0.5,
          transform: "translateZ(0)",
        }}
      />
    </Box>
  );
};

const cardLeft = (position: number) => {
  if (position === 0) return "var(--carousel-start)";
  if (position > 0) {
    const extraSteps = Array.from(
      { length: position - 1 },
      () => "var(--carousel-side-width) + var(--carousel-gap)",
    ).join(" + ");
    return `calc(var(--carousel-start) + var(--carousel-active-width) + var(--carousel-gap)${
      extraSteps ? ` + ${extraSteps}` : ""
    })`;
  }
  const previousSteps = Array.from(
    { length: Math.abs(position) },
    () => " - var(--carousel-side-width) - var(--carousel-gap)",
  ).join("");
  return `calc(var(--carousel-start)${previousSteps})`;
};

const FeaturedProjectsCarousel = ({ projects }: FeaturedProjectsCarouselProps) => {
  const { t, localizedHref } = useI18n();
  const portfolioHref = localizedHref("portfolio");
  const [activeStep, setActiveStep] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [cursor, setCursor] = useState({ x: 0, y: 0, visible: false });
  const trackRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const dragOffsetRef = useRef(0);
  const pendingDragOffsetRef = useRef(0);
  const cursorRef = useRef(cursor);
  const pendingCursorRef = useRef(cursor);
  const pointerFrameRef = useRef<number | null>(null);
  const suppressClickRef = useRef(false);

  const flushPointerFrame = useCallback(() => {
    pointerFrameRef.current = null;
    const nextDragOffset = pendingDragOffsetRef.current;
    const nextCursor = pendingCursorRef.current;

    setDragOffset((current) =>
      current === nextDragOffset ? current : nextDragOffset,
    );
    setCursor((current) =>
      current.x === nextCursor.x &&
      current.y === nextCursor.y &&
      current.visible === nextCursor.visible
        ? current
        : nextCursor,
    );
  }, []);

  const schedulePointerFrame = useCallback(() => {
    if (pointerFrameRef.current !== null) return;
    pointerFrameRef.current = window.requestAnimationFrame(flushPointerFrame);
  }, [flushPointerFrame]);

  const setDragOffsetImmediate = useCallback((nextOffset: number) => {
    dragOffsetRef.current = nextOffset;
    pendingDragOffsetRef.current = nextOffset;
    setDragOffset(nextOffset);
  }, []);

  const scheduleDragOffset = useCallback(
    (nextOffset: number) => {
      dragOffsetRef.current = nextOffset;
      pendingDragOffsetRef.current = nextOffset;
      schedulePointerFrame();
    },
    [schedulePointerFrame],
  );

  const setCursorImmediate = useCallback((nextCursor: typeof cursor) => {
    cursorRef.current = nextCursor;
    pendingCursorRef.current = nextCursor;
    setCursor(nextCursor);
  }, []);

  const scheduleCursor = useCallback(
    (nextCursor: typeof cursor) => {
      cursorRef.current = nextCursor;
      pendingCursorRef.current = nextCursor;
      schedulePointerFrame();
    },
    [schedulePointerFrame],
  );

  useEffect(
    () => () => {
      if (pointerFrameRef.current !== null) {
        window.cancelAnimationFrame(pointerFrameRef.current);
      }
    },
    [],
  );

  const goTo = useCallback(
    (delta: number) => {
      setActiveStep((current) => current + delta);
      setDragOffsetImmediate(0);
    },
    [setDragOffsetImmediate],
  );

  const suppressNextClick = useCallback(() => {
    suppressClickRef.current = true;
    window.setTimeout(() => {
      suppressClickRef.current = false;
    }, 0);
  }, []);

  const virtualItems = useMemo(
    () => {
      if (projects.length < 2) return [];
      return [-2, -1, 0, 1, 2, 3].map((position) => {
        const virtualIndex = activeStep + position;
        return {
          position,
          virtualIndex,
          project: projects[modulo(virtualIndex, projects.length)],
        };
      });
    },
    [activeStep, projects],
  );
  const updateCursor = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const rect = trackRef.current?.getBoundingClientRect();
      if (!rect) return;
      scheduleCursor({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        visible: event.pointerType === "mouse",
      });
    },
    [scheduleCursor],
  );

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    if ((event.target as HTMLElement).closest("button")) return;

    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      pointerType: event.pointerType,
      startX: event.clientX,
      startY: event.clientY,
      startedAt: performance.now(),
      moved: false,
      directionLocked: null,
    };
    if (event.pointerType === "mouse") setDragging(true);
    updateCursor(event);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    updateCursor(event);
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    if (!drag.directionLocked) {
      const deltaX = event.clientX - drag.startX;
      const deltaY = Math.abs(event.clientY - drag.startY);
      const absDeltaX = Math.abs(deltaX);
      if (absDeltaX >= DIRECTION_LOCK_THRESHOLD || deltaY >= DIRECTION_LOCK_THRESHOLD) {
        drag.directionLocked = absDeltaX >= deltaY ? "horizontal" : "vertical";
        if (drag.directionLocked === "vertical") {
          try { event.currentTarget.releasePointerCapture(event.pointerId); } catch {}
          dragRef.current = null;
          setDragging(false);
          setDragOffsetImmediate(0);
          return;
        }
        if (drag.directionLocked === "horizontal" && drag.pointerType !== "mouse") {
          try { event.currentTarget.releasePointerCapture(event.pointerId); } catch {}
          dragRef.current = null;
          suppressNextClick();
          setDragOffsetImmediate(0);
          goTo(deltaX < 0 ? 1 : -1);
          return;
        }
      }
    }

    if (drag.directionLocked === "vertical") return;

    const rawOffset = event.clientX - drag.startX;
    const maximum = Math.max(180, (trackRef.current?.clientWidth ?? 900) * 0.32);
    const nextOffset = Math.max(-maximum, Math.min(maximum, rawOffset));
    if (Math.abs(rawOffset) > DRAG_SUPPRESS_CLICK_THRESHOLD) drag.moved = true;
    const clickThreshold = drag.pointerType === "mouse"
      ? DRAG_CLICK_THRESHOLD_MOUSE
      : DRAG_CLICK_THRESHOLD_TOUCH;
    if (Math.abs(nextOffset) > clickThreshold) drag.moved = true;
    scheduleDragOffset(nextOffset);
  };

  const finishDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const currentDragOffset = dragOffsetRef.current;
    const elapsed = Math.max(1, performance.now() - drag.startedAt);
    const velocity = currentDragOffset / elapsed;
    const threshold = Math.min(
      120,
      Math.max(64, (trackRef.current?.clientWidth ?? 900) * 0.1),
    );
    const shouldMove =
      Math.abs(currentDragOffset) >= threshold || Math.abs(velocity) > 0.5;

    if (drag.moved) suppressNextClick();

    // Pointer capture redirects click to the track, bypassing the Link cards.
    // For mouse clicks without drag, find the link under the cursor and navigate.
    if (!drag.moved && drag.pointerType === "mouse") {
      const target = document.elementFromPoint(event.clientX, event.clientY);
      const link = target?.closest("a") as HTMLAnchorElement | null;
      if (link) {
        dragRef.current = null;
        setDragging(false);
        setDragOffsetImmediate(0);
        link.click();
        return;
      }
    }

    dragRef.current = null;
    setDragging(false);
    if (shouldMove) goTo(currentDragOffset < 0 ? 1 : -1);
    else setDragOffsetImmediate(0);

  };

  const handlePointerCancel = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;
    setDragging(false);
    setDragOffsetImmediate(0);
  };

  if (projects.length < 2) return null;

  return (
    <Box
      component="section"
      data-testid="featured-projects-carousel"
      aria-roledescription="carousel"
      aria-label={t("portfolio.heading", "Portfolio")}
      style={{ color: colors.mutedBlack, backgroundColor: colors.offWhite }}
      sx={{
        width: "100%",
        position: "relative",
        isolation: "isolate",
        borderBottom: `1px solid ${colors.blueGray}`,
        py: { xs: 7, md: 10 },
        overflow: "hidden",
        transition: dragging
          ? "none"
          : "background-color 720ms cubic-bezier(0.22, 1, 0.36, 1), color 360ms ease",
        "@media (prefers-reduced-motion: reduce)": {
          transition: "none",
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1200,
          mx: "auto",
          px: { xs: 2, md: 4 },
          mb: { xs: 4, md: 6 },
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="subtitle2"
            sx={{ mb: 1.5, color: "inherit", opacity: 0.76, textShadow: "0 4px 30px rgba(0, 0, 0, 0.28)" }}
          >
            {t("portfolio.eyebrow", "Nos réalisations")}
          </Typography>
          <Typography variant="h2" sx={{ color: "inherit", textShadow: "0 4px 36px rgba(0, 0, 0, 0.25)" }}>
            {t("portfolio.heading", "Portfolio")}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Button
            variant="liquidGlass"
            aria-label={t("carousel.previous", "Réalisation précédente")}
            onClick={() => goTo(-1)}
            sx={{ minWidth: 44, width: 44, height: 44, p: 0, borderRadius: "50%" }}
          >
            <ArrowBackIcon fontSize="small" />
          </Button>
          <Button
            variant="liquidGlass"
            aria-label={t("carousel.next", "Réalisation suivante")}
            onClick={() => goTo(1)}
            sx={{ minWidth: 44, width: 44, height: 44, p: 0, borderRadius: "50%" }}
          >
            <ArrowForwardIcon fontSize="small" />
          </Button>
        </Box>
      </Box>

      <Box
        ref={trackRef}
        role="group"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            goTo(-1);
          }
          if (event.key === "ArrowRight") {
            event.preventDefault();
            goTo(1);
          }
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={handlePointerCancel}
        onPointerLeave={() => {
          if (!dragRef.current) {
            setCursorImmediate({ ...cursorRef.current, visible: false });
          }
        }}
        onClickCapture={(event) => {
          if (!suppressClickRef.current) return;
          event.preventDefault();
          event.stopPropagation();
        }}
        style={
          {
            "--carousel-drag-offset": `${dragOffset}px`,
          } as CSSProperties
        }
        sx={{
          "--carousel-start": { xs: "12vw", md: "clamp(150px, 12vw, 220px)" },
          "--carousel-active-width": { xs: "76vw", md: "clamp(620px, 58vw, 900px)" },
          "--carousel-side-width": { xs: "68vw", md: "clamp(230px, 23vw, 340px)" },
          "--carousel-gap": { xs: "12px", md: "36px" },
          height: { xs: "min(68svh, 600px)", md: "clamp(520px, 48vw, 650px)" },
          minHeight: { xs: 440, md: 520 },
          position: "relative",
          zIndex: 1,
          outline: "none",
          touchAction: "pan-y",
          userSelect: "none",
          cursor: { xs: "grab", md: "none" },
          "&:active": { cursor: { xs: "grabbing", md: "none" } },
        }}
      >
        {virtualItems.map(({ project, position, virtualIndex }) => {
          const active = position === 0;
          const visible = position >= -1 && position <= 2;

          return (
            <MobileSlideHalo
              key={`mobile-halo-${virtualIndex}`}
              project={project}
              position={position}
              active={active}
              visible={visible}
              dragging={dragging}
            />
          );
        })}
        {virtualItems.map(({ project, position, virtualIndex }) => {
          const active = position === 0;
          const visible = position >= -1 && position <= 2;

          return (
            <SlideHalo
              key={`halo-${virtualIndex}`}
              project={project}
              position={position}
              active={active}
              visible={visible}
              dragging={dragging}
            />
          );
        })}
        {virtualItems.map(({ project, position, virtualIndex }) => {
          const active = position === 0;
          const visible = position >= -1 && position <= 2;
          const meta = [project.sector, project.projectLocation].filter(Boolean).join(" — ");

          return (
            <Box
              key={virtualIndex}
              component={Link}
              href={`${portfolioHref}/${project.slug}`}
              data-link-variant="plain"
              aria-label={`${project.title}${meta ? ` — ${meta}` : ""}`}
              aria-current={active ? "true" : undefined}
              aria-hidden={!visible}
              tabIndex={visible ? 0 : -1}
              draggable={false}
              onDragStart={(event) => event.preventDefault()}
              sx={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: cardLeft(position),
                width: active
                  ? "var(--carousel-active-width)"
                  : "var(--carousel-side-width)",
                display: "block",
                overflow: "hidden",
                borderRadius: { xs: 2, md: 3 },
                color: colors.white,
                textDecoration: "none",
                cursor: { xs: "grab", md: "none" },
                "&:active": { cursor: { xs: "grabbing", md: "none" } },
                bgcolor: colors.mutedBlack,
                opacity: visible ? 1 : 0,
                pointerEvents: visible ? "auto" : "none",
                transform: "translate3d(var(--carousel-drag-offset), 0, 0)",
                zIndex: active ? 3 : Math.max(0, 2 - Math.abs(position)),
                transition: dragging
                  ? "none"
                  : {
                      xs: MOBILE_CAROUSEL_CARD_TRANSITION,
                      md: CAROUSEL_CARD_TRANSITION,
                    },
                "@media (prefers-reduced-motion: reduce)": {
                  transition: "none",
                },
                "&:focus-visible": {
                  outline: `3px solid ${colors.white}`,
                  outlineOffset: -5,
                },
                "&:hover img, &:hover video": { transform: "scale(1.025)" },
              }}
            >
              {visible && <ProjectCoverMedia project={project} />}
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(180deg, rgba(10, 16, 15, 0.02) 35%, rgba(10, 16, 15, 0.82) 100%)",
                }}
              />
              {([true, false] as const).map((activeCopy) => {
                const shown = activeCopy === active;
                return (
                  <Box
                    key={activeCopy ? "active-copy" : "compact-copy"}
                    aria-hidden
                    sx={{
                      position: "absolute",
                      left: activeCopy
                        ? { xs: "30px", md: "42px" }
                        : { xs: "24px", md: "28px" },
                      bottom: activeCopy
                        ? { xs: "34px", md: "42px" }
                        : { xs: "28px", md: "32px" },
                      width: activeCopy
                        ? {
                            xs: "calc(var(--carousel-active-width) - 50px)",
                            md: "calc(var(--carousel-active-width) - 74px)",
                          }
                        : {
                            xs: "calc(var(--carousel-side-width) - 40px)",
                            md: "calc(var(--carousel-side-width) - 48px)",
                          },
                      opacity: shown ? 1 : 0,
                      transform: `translate3d(0, ${shown ? 0 : 8}px, 0)`,
                      pointerEvents: "none",
                      transition: shown
                        ? "opacity 300ms ease 180ms, transform 420ms cubic-bezier(0.22, 1, 0.36, 1) 180ms"
                        : "opacity 160ms ease, transform 220ms ease",
                      "@media (prefers-reduced-motion: reduce)": {
                        transition: "none",
                      },
                    }}
                  >
                    <Typography
                      component="h3"
                      sx={{
                        fontFamily: typography.fontFamilyDisplay,
                        fontSize: activeCopy
                          ? {
                              xs: "clamp(2.5rem, 13vw, 4.8rem)",
                              md: "clamp(4rem, 7vw, 6.5rem)",
                            }
                          : {
                              xs: "clamp(1.8rem, 8vw, 3rem)",
                              md: "clamp(2rem, 3.6vw, 3.6rem)",
                            },
                        fontWeight: 200,
                        lineHeight: 0.95,
                        letterSpacing: "0.01em",
                        color: colors.white,
                        textWrap: "balance",
                      }}
                    >
                      {project.title}
                    </Typography>
                    {meta && (
                      <Typography
                        component="p"
                        sx={{
                          mt: activeCopy ? { xs: 1, md: 1.5 } : 1,
                          color: colors.white,
                          opacity: 0.82,
                          fontSize: activeCopy
                            ? { xs: "0.85rem", md: "1rem" }
                            : { xs: "0.7rem", md: "0.78rem" },
                          lineHeight: 1.4,
                        }}
                      >
                        {meta}
                      </Typography>
                    )}
                  </Box>
                );
              })}
            </Box>
          );
        })}

        <Box
          aria-hidden
          style={
            {
              left: cursor.x,
              top: cursor.y,
              "--carousel-cursor-scale": cursor.visible ? 1 : 0.65,
              "--carousel-cursor-opacity": cursor.visible ? 1 : 0,
            } as CSSProperties
          }
          sx={{
            display: { xs: "none", md: "grid" },
            position: "absolute",
            width: 62,
            height: 62,
            placeItems: "center",
            borderRadius: "50%",
            border: `3px solid ${colors.white}`,
            color: colors.white,
            bgcolor: "rgba(20, 28, 27, 0.12)",
            backdropFilter: "blur(5px)",
            transform: "translate(-50%, -50%) scale(var(--carousel-cursor-scale))",
            opacity: "var(--carousel-cursor-opacity)",
            transition: dragging ? "opacity 120ms ease" : "opacity 180ms ease, transform 180ms ease",
            pointerEvents: "none",
            zIndex: 10,
            fontSize: "1.15rem",
            fontWeight: 700,
          }}
        >
          {dragging ? (dragOffset < 0 ? "→" : "←") : "↔"}
        </Box>
      </Box>
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          justifyContent: "center",
          px: 2,
          mt: { xs: 4, md: 6 },
        }}
      >
        <Button variant="liquidGlass" component={Link} href={portfolioHref}>
          {t("portfolio.cta.viewAll", "Voir tout")}
        </Button>
      </Box>
    </Box>
  );
};

export default FeaturedProjectsCarousel;
