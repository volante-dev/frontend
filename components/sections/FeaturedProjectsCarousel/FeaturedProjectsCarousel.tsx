"use client";

import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
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

type MeshPoint = {
  x: number;
  y: number;
  opacity: number;
};

const FALLBACK_PALETTE = [
  colors.green,
  colors.greenLight,
  colors.champagne,
  colors.blueGrayDark,
];
const DRAG_CLICK_THRESHOLD_TOUCH = 6;
const DRAG_CLICK_THRESHOLD_MOUSE = 14;
const DIRECTION_LOCK_THRESHOLD = 10;
const BASE_MESH_POINTS: MeshPoint[] = [
  { x: 12, y: 10, opacity: 0.78 },
  { x: 88, y: 12, opacity: 0.68 },
  { x: 24, y: 88, opacity: 0.68 },
  { x: 80, y: 84, opacity: 0.68 },
];

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

const hexToRgb = (color: string) => ({
  r: Number.parseInt(color.slice(1, 3), 16),
  g: Number.parseInt(color.slice(3, 5), 16),
  b: Number.parseInt(color.slice(5, 7), 16),
});

const mixHex = (from: string, to: string, progress: number) => {
  const start = hexToRgb(normalizeHex(from));
  const end = hexToRgb(normalizeHex(to));
  const amount = Math.max(0, Math.min(1, progress));
  const channel = (a: number, b: number) =>
    Math.round(a + (b - a) * amount)
      .toString(16)
      .padStart(2, "0");
  return `#${channel(start.r, end.r)}${channel(start.g, end.g)}${channel(start.b, end.b)}`;
};

const mixPalettes = (from: string[], to: string[], progress: number) =>
  from.map((color, index) => mixHex(color, to[index], progress));

const seededRandom = (value: string) => {
  let state = Array.from(value).reduce(
    (hash, character) => Math.imul(hash ^ character.charCodeAt(0), 16777619),
    2166136261,
  );
  return () => {
    state += 0x6d2b79f5;
    let result = state;
    result = Math.imul(result ^ (result >>> 15), result | 1);
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
};

const createMeshLayout = (project: Project): MeshPoint[] => {
  const random = seededRandom(project.id || project.slug);
  return BASE_MESH_POINTS.map((point) => ({
    x: point.x + (random() * 2 - 1) * 8,
    y: point.y + (random() * 2 - 1) * 6,
    opacity: point.opacity + (random() * 2 - 1) * 0.035,
  }));
};

const mixMeshLayouts = (
  from: MeshPoint[],
  to: MeshPoint[],
  progress: number,
) => {
  const amount = Math.max(0, Math.min(1, progress));
  return from.map((point, index) => ({
    x: point.x + (to[index].x - point.x) * amount,
    y: point.y + (to[index].y - point.y) * amount,
    opacity:
      point.opacity + (to[index].opacity - point.opacity) * amount,
  }));
};

const readableForeground = (palette: string[]) => {
  const luminance =
    palette.reduce((total, color) => {
      const { r, g, b } = hexToRgb(normalizeHex(color));
      return total + (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    }, 0) / palette.length;
  return luminance > 0.62 ? colors.mutedBlack : colors.white;
};

const MeshGradient = ({
  palette,
  points,
  dragging,
}: {
  palette: string[];
  points: MeshPoint[];
  dragging: boolean;
}) => (
  <Box
    aria-hidden
    sx={{
      position: "absolute",
      inset: "-22% -12%",
      overflow: "hidden",
      pointerEvents: "none",
      zIndex: 0,
      "@keyframes meshFloatOne": {
        from: { transform: "translate3d(-2%, -1%, 0) scale(1)" },
        to: { transform: "translate3d(4%, 3%, 0) scale(1.06)" },
      },
      "@keyframes meshFloatTwo": {
        from: { transform: "translate3d(3%, -2%, 0) scale(1.04)" },
        to: { transform: "translate3d(-3%, 4%, 0) scale(0.99)" },
      },
    }}
  >
    {palette.map((color, index) => (
      <Box
        key={index}
        sx={{
          position: "absolute",
          left: `${points[index].x}%`,
          top: `${points[index].y}%`,
          width: { xs: "90vw", md: "65vw" },
          aspectRatio: "1",
          transform: "translate(-50%, -50%)",
          transition: dragging
            ? "none"
            : "left 920ms cubic-bezier(0.22, 1, 0.36, 1), top 920ms cubic-bezier(0.22, 1, 0.36, 1)",
          "@media (prefers-reduced-motion: reduce)": { transition: "none" },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            backgroundColor: color,
            filter: { xs: "blur(55px)", md: "blur(90px)" },
            opacity: points[index].opacity,
            willChange: "transform",
            transition: dragging
              ? "none"
              : "background-color 720ms cubic-bezier(0.22, 1, 0.36, 1), opacity 720ms ease",
            animation: `${index % 2 === 0 ? "meshFloatOne" : "meshFloatTwo"} ${
              24 + index * 2
            }s ease-in-out infinite alternate`,
            "@media (prefers-reduced-motion: reduce)": {
              animation: "none",
              transition: "none",
            },
          }}
        />
      </Box>
    ))}
  </Box>
);

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
  const [trackWidth, setTrackWidth] = useState(900);
  const [cursor, setCursor] = useState({ x: 0, y: 0, visible: false });
  const trackRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const suppressClickRef = useRef(false);

  const goTo = useCallback(
    (delta: number) => {
      setActiveStep((current) => current + delta);
      setDragOffset(0);
    },
    [],
  );

  const projectVisual = useCallback(
    (index: number) => {
      const project = projects[modulo(index, projects.length)];
      return {
        palette: normalizePalette(project.heroPaletteComputed),
        points: createMeshLayout(project),
      };
    },
    [projects],
  );

  const backgroundVisual = useMemo(() => {
    const current = projectVisual(activeStep);
    if (!dragOffset) return current;

    const direction = dragOffset < 0 ? 1 : -1;
    const distance = Math.min(
      1,
      Math.abs(dragOffset) / Math.max(160, trackWidth * 0.28),
    );
    const next = projectVisual(activeStep + direction);
    return {
      palette: mixPalettes(current.palette, next.palette, distance),
      points: mixMeshLayouts(current.points, next.points, distance),
    };
  }, [activeStep, dragOffset, projectVisual, trackWidth]);
  const backgroundPalette = backgroundVisual.palette;
  const foreground = readableForeground(backgroundPalette);
  const virtualItems = useMemo(
    () =>
      [-2, -1, 0, 1, 2, 3].map((position) => {
        const virtualIndex = activeStep + position;
        return {
          position,
          virtualIndex,
          project: projects[modulo(virtualIndex, projects.length)],
        };
      }),
    [activeStep, projects],
  );

  const updateCursor = (event: ReactPointerEvent<HTMLDivElement>) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return;
    setCursor({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      visible: event.pointerType === "mouse",
    });
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    if ((event.target as HTMLElement).closest("button")) return;

    event.currentTarget.setPointerCapture(event.pointerId);
    setTrackWidth(event.currentTarget.clientWidth);
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
          setDragOffset(0);
          return;
        }
        if (drag.directionLocked === "horizontal" && drag.pointerType !== "mouse") {
          try { event.currentTarget.releasePointerCapture(event.pointerId); } catch {}
          dragRef.current = null;
          setDragOffset(0);
          goTo(deltaX < 0 ? 1 : -1);
          return;
        }
      }
    }

    if (drag.directionLocked === "vertical") return;

    const rawOffset = event.clientX - drag.startX;
    const maximum = Math.max(180, (trackRef.current?.clientWidth ?? 900) * 0.32);
    const nextOffset = Math.max(-maximum, Math.min(maximum, rawOffset));
    const clickThreshold = drag.pointerType === "mouse"
      ? DRAG_CLICK_THRESHOLD_MOUSE
      : DRAG_CLICK_THRESHOLD_TOUCH;
    if (Math.abs(nextOffset) > clickThreshold) drag.moved = true;
    setDragOffset(nextOffset);
  };

  const finishDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const elapsed = Math.max(1, performance.now() - drag.startedAt);
    const velocity = dragOffset / elapsed;
    const threshold = Math.min(
      120,
      Math.max(64, (trackRef.current?.clientWidth ?? 900) * 0.1),
    );
    const shouldMove = Math.abs(dragOffset) >= threshold || Math.abs(velocity) > 0.5;

    suppressClickRef.current = drag.moved;

    // Pointer capture redirects click to the track, bypassing the Link cards.
    // For mouse clicks without drag, find the link under the cursor and navigate.
    if (!drag.moved && drag.pointerType === "mouse") {
      const target = document.elementFromPoint(event.clientX, event.clientY);
      const link = target?.closest("a") as HTMLAnchorElement | null;
      if (link) {
        dragRef.current = null;
        setDragging(false);
        setDragOffset(0);
        link.click();
        return;
      }
    }

    dragRef.current = null;
    setDragging(false);
    if (shouldMove) goTo(dragOffset < 0 ? 1 : -1);
    else setDragOffset(0);

    window.setTimeout(() => {
      suppressClickRef.current = false;
    }, 0);
  };

  const handlePointerCancel = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;
    setDragging(false);
    setDragOffset(0);
  };

  if (projects.length < 2) return null;

  return (
    <Box
      component="section"
      data-testid="featured-projects-carousel"
      aria-roledescription="carousel"
      aria-label={t("portfolio.heading", "Portfolio")}
      sx={{
        width: "100%",
        position: "relative",
        isolation: "isolate",
        color: foreground,
        backgroundColor: backgroundPalette[0],
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
      <MeshGradient
        palette={backgroundPalette}
        points={backgroundVisual.points}
        dragging={dragging}
      />
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
          <IconButton
            aria-label={t("carousel.previous", "Réalisation précédente")}
            onClick={() => goTo(-1)}
            sx={{ color: "inherit", border: "1px solid currentColor" }}
          >
            <ArrowBackIcon fontSize="small" />
          </IconButton>
          <IconButton
            aria-label={t("carousel.next", "Réalisation suivante")}
            onClick={() => goTo(1)}
            sx={{ color: "inherit", border: "1px solid currentColor" }}
          >
            <ArrowForwardIcon fontSize="small" />
          </IconButton>
          <Button
            variant="outlined"
            component={Link}
            href={portfolioHref}
            sx={{ ml: 1, color: "inherit", borderColor: "currentColor" }}
          >
            {t("portfolio.cta.viewAll", "Voir tout")}
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
          if (!dragRef.current) setCursor((current) => ({ ...current, visible: false }));
        }}
        onClickCapture={(event) => {
          if (!suppressClickRef.current) return;
          event.preventDefault();
          event.stopPropagation();
        }}
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
          const meta = [project.sector, project.projectLocation].filter(Boolean).join(" — ");

          return (
            <Box
              key={virtualIndex}
              component={Link}
              href={`${portfolioHref}/${project.slug}`}
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
                transform: `translate3d(${dragOffset}px, 0, 0)`,
                zIndex: active ? 3 : Math.max(0, 2 - Math.abs(position)),
                boxShadow: active
                  ? "0 28px 70px rgba(20, 28, 27, 0.24)"
                  : "0 18px 45px rgba(20, 28, 27, 0.16)",
                transition: dragging
                  ? "none"
                  : "left 820ms cubic-bezier(0.22, 1, 0.36, 1), width 820ms cubic-bezier(0.22, 1, 0.36, 1), transform 820ms cubic-bezier(0.22, 1, 0.36, 1), opacity 300ms ease, box-shadow 500ms ease",
                "@media (prefers-reduced-motion: reduce)": {
                  transition: "none",
                },
                "&:focus-visible": {
                  outline: `3px solid ${colors.white}`,
                  outlineOffset: -5,
                },
                "&:hover img": { transform: "scale(1.025)" },
              }}
            >
              <Box
                component="img"
                src={project.imageUrl}
                alt=""
                width={1600}
                height={1200}
                loading="lazy"
                sx={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  pointerEvents: "none",
                  transition: "transform 900ms cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              />
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
          sx={{
            display: { xs: "none", md: "grid" },
            position: "absolute",
            left: cursor.x,
            top: cursor.y,
            width: 62,
            height: 62,
            placeItems: "center",
            borderRadius: "50%",
            border: `3px solid ${colors.white}`,
            color: colors.white,
            bgcolor: "rgba(20, 28, 27, 0.12)",
            backdropFilter: "blur(5px)",
            transform: `translate(-50%, -50%) scale(${cursor.visible ? 1 : 0.65})`,
            opacity: cursor.visible ? 1 : 0,
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
    </Box>
  );
};

export default FeaturedProjectsCarousel;
