"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Link from "next/link";
import Button from "@/components/ui/Button/Button";
import { useI18n } from "@/components/providers/I18nProvider/I18nProvider";
import type { Project } from "@/components/sections/ProjectGrid/project-types";
import {
  carouselSurfaceStyle,
  controlButtonSx,
  controlsSx,
  coverMediaSx,
  cursorStyle,
  cursorSx,
  desktopHaloAccentSx,
  desktopHaloPrimarySx,
  desktopHaloSecondarySx,
  desktopHaloSx,
  eyebrowSx,
  footerActionsSx,
  headerSx,
  headingSx,
  mobileHaloPrimarySx,
  mobileHaloSecondarySx,
  mobileHaloSx,
  normalizePalette,
  projectCardOverlaySx,
  projectCardSx,
  projectCopySx,
  projectMetaSx,
  projectTitleSx,
  sectionSx,
  slideHaloVars,
  trackStyle,
  trackSx,
} from "./FeaturedProjectsCarousel.styles";

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

const DRAG_CLICK_THRESHOLD_TOUCH = 6;
const DRAG_CLICK_THRESHOLD_MOUSE = 14;
const DRAG_SUPPRESS_CLICK_THRESHOLD = 2;
const DIRECTION_LOCK_THRESHOLD = 10;

const modulo = (value: number, length: number) =>
  ((value % length) + length) % length;

const inferMediaTypeFromUrl = (value: string) =>
  /\.(mp4|mov|webm)(?:[?#].*)?$/i.test(value) ? "VIDEO" : "IMAGE";

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
      style={slideHaloVars(palette)}
      sx={desktopHaloSx({ position, active, opacity, dragging })}
    >
      <Box sx={desktopHaloPrimarySx(active)} />
      <Box sx={desktopHaloSecondarySx(active)} />
      <Box sx={desktopHaloAccentSx(active)} />
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
      style={slideHaloVars(palette)}
      sx={mobileHaloSx({ position, active, opacity, dragging })}
    >
      <Box sx={mobileHaloPrimarySx} />
      <Box sx={mobileHaloSecondarySx} />
    </Box>
  );
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
      style={carouselSurfaceStyle}
      sx={sectionSx(dragging)}
    >
      <Box sx={headerSx}>
        <Box>
          <Typography
            variant="subtitle2"
            sx={eyebrowSx}
          >
            {t("portfolio.eyebrow", "Nos réalisations")}
          </Typography>
          <Typography variant="h2" sx={headingSx}>
            {t("portfolio.heading", "Portfolio")}
          </Typography>
        </Box>
        <Box sx={controlsSx}>
          <Button
            variant="liquidGlass"
            aria-label={t("carousel.previous", "Réalisation précédente")}
            onClick={() => goTo(-1)}
            sx={controlButtonSx}
          >
            <ArrowBackIcon fontSize="small" />
          </Button>
          <Button
            variant="liquidGlass"
            aria-label={t("carousel.next", "Réalisation suivante")}
            onClick={() => goTo(1)}
            sx={controlButtonSx}
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
        style={trackStyle(dragOffset)}
        sx={trackSx}
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
              sx={projectCardSx({ position, active, visible, dragging })}
            >
              {visible && <ProjectCoverMedia project={project} />}
              <Box sx={projectCardOverlaySx} />
              {([true, false] as const).map((activeCopy) => {
                const shown = activeCopy === active;
                return (
                  <Box
                    key={activeCopy ? "active-copy" : "compact-copy"}
                    aria-hidden
                    sx={projectCopySx({ activeCopy, shown })}
                  >
                    <Typography
                      component="h3"
                      sx={projectTitleSx(activeCopy)}
                    >
                      {project.title}
                    </Typography>
                    {meta && (
                      <Typography
                        component="p"
                        sx={projectMetaSx(activeCopy)}
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
          style={cursorStyle(cursor)}
          sx={cursorSx(dragging)}
        >
          {dragging ? (dragOffset < 0 ? "→" : "←") : "↔"}
        </Box>
      </Box>
      <Box sx={footerActionsSx}>
        <Button variant="liquidGlass" component={Link} href={portfolioHref}>
          {t("portfolio.cta.viewAll", "Voir tout")}
        </Button>
      </Box>
    </Box>
  );
};

export default FeaturedProjectsCarousel;
