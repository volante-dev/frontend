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
  startX: number;
  startedAt: number;
  moved: boolean;
};

const FALLBACK_PALETTE = [
  colors.green,
  colors.greenLight,
  colors.champagne,
  colors.blueGrayDark,
];
const DRAG_CLICK_THRESHOLD = 6;

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

const readableForeground = (palette: string[]) => {
  const luminance =
    palette.reduce((total, color) => {
      const { r, g, b } = hexToRgb(normalizeHex(color));
      return total + (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    }, 0) / palette.length;
  return luminance > 0.62 ? colors.mutedBlack : colors.white;
};

const MeshGradient = ({ palette, dragging }: { palette: string[]; dragging: boolean }) => (
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
    {palette.map((color, index) => {
      const positions = [
        { left: "-8%", top: "-18%" },
        { right: "-10%", top: "-10%" },
        { left: "10%", bottom: "-28%" },
        { right: "5%", bottom: "-25%" },
      ];

      return (
        <Box
          key={index}
          sx={{
            position: "absolute",
            ...positions[index],
            width: { xs: "90vw", md: "65vw" },
            aspectRatio: "1",
            borderRadius: "50%",
            backgroundColor: color,
            filter: { xs: "blur(55px)", md: "blur(90px)" },
            opacity: index === 0 ? 0.78 : 0.68,
            willChange: "transform",
            transition: dragging
              ? "none"
              : "background-color 720ms cubic-bezier(0.22, 1, 0.36, 1)",
            animation: `${index % 2 === 0 ? "meshFloatOne" : "meshFloatTwo"} ${
              24 + index * 2
            }s ease-in-out infinite alternate`,
            "@media (prefers-reduced-motion: reduce)": {
              animation: "none",
              transition: "none",
            },
          }}
        />
      );
    })}
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

  const projectPalette = useCallback(
    (index: number) => {
      const project = projects[modulo(index, projects.length)];
      return normalizePalette(project.heroPaletteComputed);
    },
    [projects],
  );

  const backgroundPalette = useMemo(() => {
    const current = projectPalette(activeStep);
    if (!dragOffset) return current;

    const direction = dragOffset < 0 ? 1 : -1;
    const distance = Math.min(
      1,
      Math.abs(dragOffset) / Math.max(160, trackWidth * 0.28),
    );
    return mixPalettes(
      current,
      projectPalette(activeStep + direction),
      distance,
    );
  }, [activeStep, dragOffset, projectPalette, trackWidth]);
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
      startX: event.clientX,
      startedAt: performance.now(),
      moved: false,
    };
    setDragging(true);
    updateCursor(event);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    updateCursor(event);
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const rawOffset = event.clientX - drag.startX;
    const maximum = Math.max(180, (trackRef.current?.clientWidth ?? 900) * 0.32);
    const nextOffset = Math.max(-maximum, Math.min(maximum, rawOffset));
    if (Math.abs(nextOffset) > DRAG_CLICK_THRESHOLD) drag.moved = true;
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
    dragRef.current = null;
    setDragging(false);
    if (shouldMove) goTo(dragOffset < 0 ? 1 : -1);
    else setDragOffset(0);

    window.setTimeout(() => {
      suppressClickRef.current = false;
    }, 0);
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
      <MeshGradient palette={backgroundPalette} dragging={dragging} />
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
          <Typography variant="subtitle2" sx={{ mb: 1.5, color: "inherit", opacity: 0.76 }}>
            {t("portfolio.eyebrow", "Nos réalisations")}
          </Typography>
          <Typography variant="h2" sx={{ color: "inherit" }}>
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
        onPointerCancel={finishDrag}
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
              <Box
                sx={{
                  position: "absolute",
                  left: { xs: active ? 2.5 : 2, md: active ? 4 : 2.5 },
                  right: { xs: active ? 2.5 : 2, md: active ? 4 : 2.5 },
                  bottom: { xs: active ? 3 : 2.5, md: active ? 4 : 3 },
                  transition:
                    "left 820ms cubic-bezier(0.22, 1, 0.36, 1), right 820ms cubic-bezier(0.22, 1, 0.36, 1), bottom 820ms cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              >
                <Typography
                  component="h3"
                  sx={{
                    fontFamily: typography.fontFamilyDisplay,
                    fontSize: active
                      ? { xs: "clamp(2.5rem, 13vw, 4.8rem)", md: "clamp(4rem, 7vw, 6.5rem)" }
                      : { xs: "clamp(1.8rem, 8vw, 3rem)", md: "clamp(2rem, 3.6vw, 3.6rem)" },
                    fontWeight: 200,
                    lineHeight: 0.95,
                    letterSpacing: "0.01em",
                    color: colors.white,
                    textWrap: "balance",
                    transition: "font-size 820ms cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                >
                  {project.title}
                </Typography>
                {meta && (
                  <Typography
                    component="p"
                    sx={{
                      mt: { xs: 1, md: 1.5 },
                      color: colors.white,
                      opacity: 0.82,
                      fontSize: active
                        ? { xs: "0.85rem", md: "1rem" }
                        : { xs: "0.7rem", md: "0.78rem" },
                      lineHeight: 1.4,
                      transition: "font-size 820ms cubic-bezier(0.22, 1, 0.36, 1)",
                    }}
                  >
                    {meta}
                  </Typography>
                )}
              </Box>
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
