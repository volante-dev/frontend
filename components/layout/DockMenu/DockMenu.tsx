"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useEffect, useRef, useState } from "react";
import { colors } from "@/app/theme/tokens";
import LiquidGlassFilter from "@/components/ui/LiquidGlass/LiquidGlassFilter";
import { useLiquidGlass } from "@/components/ui/LiquidGlass/useLiquidGlass";
import { useDockMenuState } from "./DockMenuProvider";
import { useDockActivePill } from "./useDockActivePill";

const dockTint = "205, 205, 205";
const SCROLL_DELTA = 8;
const COMPACT_AFTER_Y = 80;
const DOCK_ITEM_EXPANDED_HEIGHT = 54;
const DOCK_ITEM_COMPACT_HEIGHT = 36;
const DOCK_ENTER_TRANSITION =
  "opacity 260ms ease-out, transform 640ms cubic-bezier(0.16, 1.32, 0.28, 1), width 320ms cubic-bezier(0.22, 1, 0.36, 1), height 320ms cubic-bezier(0.22, 1, 0.36, 1)";
const DOCK_EXIT_TRANSITION =
  "opacity 180ms ease-in, transform 260ms cubic-bezier(0.4, 0, 1, 1), width 240ms ease, height 240ms ease";

const getButtonLabel = (label: string) => label.toUpperCase();

const DockMenu = () => {
  const { renderedConfig, visible } = useDockMenuState();
  const measureRef = useRef<HTMLDivElement | null>(null);
  const lastScrollYRef = useRef(0);
  const frameRef = useRef<number | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [compactByScroll, setCompactByScroll] = useState(false);
  const [interactionExpanded, setInteractionExpanded] = useState(false);
  const [labelsVisible, setLabelsVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const expanded = !compactByScroll || interactionExpanded;
  const items = renderedConfig?.items ?? [];
  const {
    setContainerNode: setPillContainer,
    registerItem,
    pill,
  } = useDockActivePill(items);
  const { filterId, displacementUrl, specularUrl, isSupported, scale } =
    useLiquidGlass({
      width: size.width,
      height: size.height,
      radius: size.height > 0 ? Math.round(size.height / 2) : 28,
    });
  const glassActive = isSupported && displacementUrl && specularUrl;

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(
      () => setLabelsVisible(expanded),
      expanded && !reducedMotion ? 170 : 0,
    );
    return () => window.clearTimeout(timeout);
  }, [expanded, reducedMotion]);

  useEffect(() => {
    if (!visible) {
      const frame = requestAnimationFrame(() => setCompactByScroll(false));
      return () => cancelAnimationFrame(frame);
    }

    lastScrollYRef.current = window.scrollY;
    const updateScrollState = () => {
      frameRef.current = null;
      const nextY = window.scrollY;
      const previousY = lastScrollYRef.current;
      const delta = nextY - previousY;

      if (nextY <= 24) {
        setCompactByScroll(false);
      } else if (delta > SCROLL_DELTA && nextY > COMPACT_AFTER_Y) {
        setCompactByScroll(true);
      } else if (delta < -SCROLL_DELTA) {
        setCompactByScroll(false);
      }

      lastScrollYRef.current = nextY;
    };
    const onScroll = () => {
      if (frameRef.current !== null) return;
      frameRef.current = requestAnimationFrame(updateScrollState);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [visible]);

  useEffect(() => {
    const element = measureRef.current;
    if (!element) return;

    const measure = () => {
      const rect = element.getBoundingClientRect();
      const next = {
        width: Math.ceil(rect.width),
        height: Math.ceil(rect.height),
      };
      setSize((current) =>
        current.width === next.width && current.height === next.height
          ? current
          : next,
      );
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [expanded, items.length, renderedConfig]);

  if (!renderedConfig) return null;

  const transition = reducedMotion
    ? "opacity 120ms ease"
    : visible
      ? DOCK_ENTER_TRANSITION
      : DOCK_EXIT_TRANSITION;

  const glassSx = glassActive
    ? {
        backdropFilter: `url(#${filterId})`,
        WebkitBackdropFilter: `url(#${filterId})`,
        backgroundColor: `rgba(${dockTint}, 0.35)`,
        border: "none",
        boxShadow: "0 4px 18px rgba(0, 0, 0, 0.16)",
        transform: "translateZ(0)",
      }
    : {
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      };

  const activePill = pill.mounted ? (
    <Box
      aria-hidden
      sx={{
        position: "absolute",
        left: 0,
        top: 0,
        width: pill.width,
        height: expanded
          ? pill.height
          : Math.min(pill.height, DOCK_ITEM_COMPACT_HEIGHT),
        borderRadius: "999px",
        backgroundColor: `rgba(${dockTint}, 0.15)`,
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        border: `1px solid rgba(${dockTint}, 0.28)`,
        opacity: pill.visible ? 1 : 0,
        pointerEvents: "none",
        transform: `translate3d(${pill.x}px, ${pill.y + pill.offsetY}px, 0)`,
        transition: reducedMotion
          ? "opacity 120ms ease"
          : "opacity 220ms ease, transform 320ms cubic-bezier(0.22, 1, 0.36, 1), width 320ms cubic-bezier(0.22, 1, 0.36, 1), height 320ms cubic-bezier(0.22, 1, 0.36, 1)",
        zIndex: 0,
      }}
    />
  ) : null;

  return (
    <Box
      sx={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: { xs: 16, md: 24 },
        zIndex: 1190,
        display: "flex",
        justifyContent: "center",
        px: 2,
        pointerEvents: "none",
      }}
    >
      <Box
        component="nav"
        aria-label={renderedConfig.ariaLabel ?? "Dock menu"}
        onMouseEnter={() => setInteractionExpanded(true)}
        onMouseLeave={() => setInteractionExpanded(false)}
        onFocus={() => setInteractionExpanded(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setInteractionExpanded(false);
          }
        }}
        sx={{
          position: "relative",
          width: size.width || "auto",
          height: size.height || "auto",
          maxWidth: "100%",
          opacity: visible ? 1 : 0,
          transform: visible
            ? "translate3d(0, 0, 0) scale(1)"
            : "translate3d(0, 72px, 0) scale(0.94)",
          transformOrigin: "bottom center",
          transition,
          pointerEvents: visible ? "auto" : "none",
        }}
      >
        {glassActive && (
          <LiquidGlassFilter
            filterId={filterId}
            displacementUrl={displacementUrl}
            specularUrl={specularUrl}
            width={size.width}
            height={size.height}
            scale={scale}
          />
        )}
        <Box
          ref={measureRef}
          sx={{
            position: "relative",
            display: "inline-flex",
            alignItems: "center",
            gap: 0.5,
            p: expanded ? "7px 9px" : "5px 7px",
            borderRadius: "999px",
            isolation: "isolate",
            backgroundColor: `rgba(${dockTint}, 0.65)`,
            border: `1px solid rgba(${dockTint}, 0.8)`,
            boxShadow: "0 4px 22px rgba(0, 0, 0, 0.12)",
            ...glassSx,
            transition: reducedMotion
              ? undefined
              : "padding 260ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <Box
            ref={setPillContainer}
            sx={{
              position: "absolute",
              inset: expanded ? "7px 9px" : "5px 7px",
              zIndex: 0,
              pointerEvents: "none",
              transition: reducedMotion
                ? undefined
                : "inset 260ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            {activePill}
          </Box>
          {items.map((item) => {
            const label = getButtonLabel(item.label);
            return (
              <Box
                key={item.id}
                ref={registerItem(item.id)}
                component="button"
                type="button"
                disabled={item.disabled}
                aria-label={item.ariaLabel ?? label}
                aria-pressed={item.active || undefined}
                onClick={item.onClick}
                sx={{
                  appearance: "none",
                  border: 0,
                  m: 0,
                  p: 0,
                  width: 64,
                  height: expanded ? DOCK_ITEM_EXPANDED_HEIGHT : DOCK_ITEM_COMPACT_HEIGHT,
                  display: "inline-flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: expanded ? 0.35 : 0,
                  borderRadius: "999px",
                  backgroundColor: "transparent",
                  color: item.active ? colors.greenDark : colors.mutedBlack,
                  cursor: item.disabled ? "default" : "pointer",
                  opacity: item.disabled ? 0.42 : 1,
                  position: "relative",
                  zIndex: 1,
                  transition: reducedMotion
                    ? undefined
                    : "height 260ms cubic-bezier(0.22, 1, 0.36, 1), color 180ms ease",
                  WebkitTapHighlightColor: "transparent",
                  "&:hover": {
                    backgroundColor: "transparent",
                  },
                  "&:focus-visible": {
                    outline: `2px solid ${colors.green}`,
                    outlineOffset: 2,
                  },
                }}
              >
                <Box
                  aria-hidden
                  sx={{
                    width: 22,
                    height: 22,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    "& svg": {
                      fontSize: 22,
                    },
                  }}
                >
                  {item.icon}
                </Box>
                <Typography
                  component="span"
                  sx={{
                    width: "100%",
                    px: 0.5,
                    color: "inherit",
                    fontSize: "0.56rem",
                    fontWeight: 700,
                    lineHeight: 1,
                    letterSpacing: "0.08em",
                    textAlign: "center",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    opacity: labelsVisible ? 1 : 0,
                    maxHeight: expanded ? 12 : 0,
                    transform: labelsVisible ? "translateY(0)" : "translateY(-2px)",
                    transition: reducedMotion
                      ? undefined
                      : "opacity 180ms ease, max-height 220ms ease, transform 220ms ease",
                  }}
                >
                  {label}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default DockMenu;
