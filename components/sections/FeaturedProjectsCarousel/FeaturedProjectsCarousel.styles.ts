import type { CSSProperties } from "react";
import { colors, typography } from "@/app/theme/tokens";

const CAROUSEL_CARD_TRANSITION =
  "left 820ms cubic-bezier(0.22, 1, 0.36, 1), width 820ms cubic-bezier(0.22, 1, 0.36, 1), transform 820ms cubic-bezier(0.22, 1, 0.36, 1), opacity 300ms ease";
const MOBILE_CAROUSEL_CARD_TRANSITION =
  "left 520ms cubic-bezier(0.22, 1, 0.36, 1), transform 520ms cubic-bezier(0.22, 1, 0.36, 1), opacity 220ms ease";
const SLIDE_HALO_TRANSITION =
  "left 820ms cubic-bezier(0.22, 1, 0.36, 1), width 820ms cubic-bezier(0.22, 1, 0.36, 1), transform 820ms cubic-bezier(0.22, 1, 0.36, 1), opacity 620ms ease";

export const FALLBACK_PALETTE = [
  colors.green,
  colors.greenLight,
  colors.champagne,
  colors.blueGrayDark,
];

const normalizeHex = (
  value: string | null | undefined,
  fallback = FALLBACK_PALETTE[0],
) => {
  const match = value?.trim().match(/^#([0-9a-f]{6})$/i);
  return match ? `#${match[1].toUpperCase()}` : fallback;
};

export const normalizePalette = (palette: string[] | undefined) =>
  FALLBACK_PALETTE.map((fallback, index) =>
    normalizeHex(palette?.[index], fallback),
  );

export const cardLeft = (position: number) => {
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

export const slideHaloVars = (palette: string[]) =>
  ({
    "--slide-halo-primary": palette[0],
    "--slide-halo-secondary": palette[1],
    "--slide-halo-accent": palette[2],
    "--slide-halo-muted": palette[3],
  }) as CSSProperties;

export const trackStyle = (dragOffset: number) =>
  ({
    "--carousel-drag-offset": `${dragOffset}px`,
  }) as CSSProperties;

export const cursorStyle = ({
  x,
  y,
  visible,
}: {
  x: number;
  y: number;
  visible: boolean;
}) =>
  ({
    left: x,
    top: y,
    "--carousel-cursor-scale": visible ? 1 : 0.65,
    "--carousel-cursor-opacity": visible ? 1 : 0,
  }) as CSSProperties;

export const carouselSurfaceStyle = {
  color: colors.mutedBlack,
  backgroundColor: colors.offWhite,
} satisfies CSSProperties;

export const coverMediaSx = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  pointerEvents: "none",
  transition: "transform 900ms cubic-bezier(0.22, 1, 0.36, 1)",
} as const;

export const sectionSx = (dragging: boolean) => ({
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
});

export const headerSx = {
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
};

export const eyebrowSx = {
  mb: 1.5,
  color: "inherit",
  opacity: 0.76,
  textShadow: "0 4px 30px rgba(0, 0, 0, 0.28)",
};

export const headingSx = {
  color: "inherit",
  textShadow: "0 4px 36px rgba(0, 0, 0, 0.25)",
};

export const controlsSx = {
  display: "flex",
  alignItems: "center",
  gap: 1,
};

export const controlButtonSx = {
  minWidth: 44,
  width: 44,
  height: 44,
  p: 0,
  borderRadius: "50%",
};

export const trackSx = {
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
};

export const desktopHaloSx = ({
  position,
  active,
  opacity,
  dragging,
}: {
  position: number;
  active: boolean;
  opacity: number;
  dragging: boolean;
}) => ({
  display: { xs: "none", md: "block" },
  position: "absolute",
  left: cardLeft(position),
  top: 0,
  bottom: 0,
  width: active ? "var(--carousel-active-width)" : "var(--carousel-side-width)",
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
});

export const desktopHaloPrimarySx = (active: boolean) => ({
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
});

export const desktopHaloSecondarySx = (active: boolean) => ({
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
});

export const desktopHaloAccentSx = (active: boolean) => ({
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
});

export const mobileHaloSx = ({
  position,
  active,
  opacity,
  dragging,
}: {
  position: number;
  active: boolean;
  opacity: number;
  dragging: boolean;
}) => ({
  display: { xs: "block", md: "none" },
  position: "absolute",
  left: cardLeft(position),
  top: "-6%",
  width: active ? "var(--carousel-active-width)" : "var(--carousel-side-width)",
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
});

export const mobileHaloPrimarySx = {
  position: "absolute",
  inset: "-10% -16%",
  borderRadius: "42%",
  background:
    "radial-gradient(ellipse at center, var(--slide-halo-primary) 0%, var(--slide-halo-secondary) 42%, rgba(255, 255, 255, 0) 74%)",
  filter: "blur(22px) saturate(1.18)",
  transform: "translateZ(0)",
};

export const mobileHaloSecondarySx = {
  position: "absolute",
  inset: "4% 0 0 10%",
  borderRadius: "42%",
  background:
    "radial-gradient(ellipse at center, var(--slide-halo-accent) 0%, var(--slide-halo-muted) 44%, rgba(255, 255, 255, 0) 72%)",
  filter: "blur(18px) saturate(1.16)",
  opacity: 0.5,
  transform: "translateZ(0)",
};

export const projectCardSx = ({
  position,
  active,
  visible,
  dragging,
}: {
  position: number;
  active: boolean;
  visible: boolean;
  dragging: boolean;
}) => ({
  position: "absolute",
  top: 0,
  bottom: 0,
  left: cardLeft(position),
  width: active ? "var(--carousel-active-width)" : "var(--carousel-side-width)",
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
});

export const projectCardOverlaySx = {
  position: "absolute",
  inset: 0,
  background:
    "linear-gradient(180deg, rgba(10, 16, 15, 0.02) 35%, rgba(10, 16, 15, 0.82) 100%)",
};

export const projectCopySx = ({
  activeCopy,
  shown,
}: {
  activeCopy: boolean;
  shown: boolean;
}) => ({
  position: "absolute",
  left: activeCopy ? { xs: "30px", md: "42px" } : { xs: "24px", md: "28px" },
  bottom: activeCopy ? { xs: "34px", md: "42px" } : { xs: "28px", md: "32px" },
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
});

export const projectTitleSx = (activeCopy: boolean) => ({
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
});

export const projectMetaSx = (activeCopy: boolean) => ({
  mt: activeCopy ? { xs: 1, md: 1.5 } : 1,
  color: colors.white,
  opacity: 0.82,
  fontSize: activeCopy ? { xs: "0.85rem", md: "1rem" } : { xs: "0.7rem", md: "0.78rem" },
  lineHeight: 1.4,
});

export const cursorSx = (dragging: boolean) => ({
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
});

export const footerActionsSx = {
  position: "relative",
  zIndex: 1,
  display: "flex",
  justifyContent: "center",
  px: 2,
  mt: { xs: 4, md: 6 },
};
