"use client";

import Box, { type BoxProps } from "@mui/material/Box";
import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ForwardedRef,
  type PointerEvent as ReactPointerEvent,
  type PointerEventHandler,
  type ReactNode,
} from "react";

type AppleTvCardStyle = CSSProperties & {
  "--apple-tv-card-rx": string;
  "--apple-tv-card-ry": string;
  "--apple-tv-card-sx": string;
  "--apple-tv-card-sy": string;
  "--apple-tv-card-shadow-opacity": number;
  "--apple-tv-card-scale": number;
  "--apple-tv-card-shine-x": string;
  "--apple-tv-card-shine-y": string;
  "--apple-tv-card-shine-rotate": string;
  "--apple-tv-card-shine-opacity": number;
  "--apple-tv-card-parallax-x": string;
  "--apple-tv-card-parallax-y": string;
};

type BaseRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

type PointerCoordinates = {
  clientX: number;
  clientY: number;
};

type AppleTvCardProps = Omit<
  BoxProps,
  "children" | "onPointerEnter" | "onPointerMove" | "onPointerLeave"
> & {
  children: ReactNode;
  component?: ElementType;
  href?: string;
  overlay?: ReactNode;
  parallaxLayer?: ReactNode;
  tilt?: number;
  shine?: number;
  shadow?: number;
  parallax?: number;
  onPointerEnter?: PointerEventHandler<HTMLElement>;
  onPointerMove?: PointerEventHandler<HTMLElement>;
  onPointerLeave?: PointerEventHandler<HTMLElement>;
};

const DEFAULT_STYLE: AppleTvCardStyle = {
  "--apple-tv-card-rx": "0deg",
  "--apple-tv-card-ry": "0deg",
  "--apple-tv-card-sx": "0px",
  "--apple-tv-card-sy": "26px",
  "--apple-tv-card-shadow-opacity": 0,
  "--apple-tv-card-scale": 1,
  "--apple-tv-card-shine-x": "50%",
  "--apple-tv-card-shine-y": "-26%",
  "--apple-tv-card-shine-rotate": "0deg",
  "--apple-tv-card-shine-opacity": 0,
  "--apple-tv-card-parallax-x": "0px",
  "--apple-tv-card-parallax-y": "0px",
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const getShinePosition = (x: number, y: number) => {
  const centerX = x - 0.5;
  const centerY = y - 0.5;
  const maxAxis = Math.max(Math.abs(centerX), Math.abs(centerY), 0.001);
  const scale = 0.5 / maxAxis;
  const edgeX = clamp(0.5 + centerX * scale, 0, 1);
  const edgeY = clamp(0.5 + centerY * scale, 0, 1);
  const normalLength = Math.hypot(centerX, centerY) || 1;
  const normalX = centerX / normalLength;
  const normalY = centerY / normalLength;
  const outsideOffset = 18;
  const shineX = edgeX * 100 + normalX * outsideOffset;
  const shineY = edgeY * 100 + normalY * outsideOffset;
  const rotation = Math.atan2(normalY, normalX) * (180 / Math.PI) + 90;

  return {
    x: `${clamp(shineX, -28, 128)}%`,
    y: `${clamp(shineY, -28, 128)}%`,
    rotate: `${rotation}deg`,
  };
};

const setForwardedRef = (
  ref: ForwardedRef<HTMLElement>,
  node: HTMLElement | null,
) => {
  if (typeof ref === "function") ref(node);
  else if (ref) ref.current = node;
};

const isFinePointer = () =>
  window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const HOVER_TRANSITION_EASING = "cubic-bezier(0.16, 1, 0.3, 1)";

const AppleTvCard = forwardRef<HTMLElement, AppleTvCardProps>(
  (
    {
      children,
      component = "div",
      overlay,
      parallaxLayer,
      tilt = 6,
      shine = 0.44,
      shadow = 1,
      parallax = 12,
      style,
      sx,
      onPointerMove,
      onPointerLeave,
      onPointerEnter,
      ...props
    },
    forwardedRef,
  ) => {
    const rootRef = useRef<HTMLElement | null>(null);
    const baseRectRef = useRef<BaseRect | null>(null);
    const frameRef = useRef<number | null>(null);
    const isInteractionActiveRef = useRef(false);
    const latestPointerRef = useRef<PointerCoordinates | null>(null);
    const pendingStyleRef = useRef<AppleTvCardStyle>(DEFAULT_STYLE);
    const [enabled, setEnabled] = useState(false);
    const [cardStyle, setCardStyle] = useState<AppleTvCardStyle>(DEFAULT_STYLE);

    const ref = useCallback(
      (node: HTMLElement | null) => {
        rootRef.current = node;
        setForwardedRef(forwardedRef, node);
      },
      [forwardedRef],
    );

    const flushFrame = useCallback(() => {
      frameRef.current = null;
      setCardStyle(pendingStyleRef.current);
    }, []);

    const scheduleStyle = useCallback(
      (nextStyle: AppleTvCardStyle) => {
        pendingStyleRef.current = nextStyle;
        if (frameRef.current !== null) return;
        frameRef.current = window.requestAnimationFrame(flushFrame);
      },
      [flushFrame],
    );

    useEffect(() => {
      const hoverMedia = window.matchMedia("(hover: hover) and (pointer: fine)");
      const motionMedia = window.matchMedia("(prefers-reduced-motion: reduce)");
      const update = () => setEnabled(hoverMedia.matches && !motionMedia.matches);
      update();
      hoverMedia.addEventListener("change", update);
      motionMedia.addEventListener("change", update);
      return () => {
        hoverMedia.removeEventListener("change", update);
        motionMedia.removeEventListener("change", update);
        if (frameRef.current !== null) {
          window.cancelAnimationFrame(frameRef.current);
        }
      };
    }, []);

    const reset = useCallback(() => {
      scheduleStyle({
        ...pendingStyleRef.current,
        "--apple-tv-card-rx": DEFAULT_STYLE["--apple-tv-card-rx"],
        "--apple-tv-card-ry": DEFAULT_STYLE["--apple-tv-card-ry"],
        "--apple-tv-card-scale": DEFAULT_STYLE["--apple-tv-card-scale"],
        "--apple-tv-card-shadow-opacity":
          DEFAULT_STYLE["--apple-tv-card-shadow-opacity"],
        "--apple-tv-card-shine-opacity": DEFAULT_STYLE["--apple-tv-card-shine-opacity"],
        "--apple-tv-card-parallax-x": DEFAULT_STYLE["--apple-tv-card-parallax-x"],
        "--apple-tv-card-parallax-y": DEFAULT_STYLE["--apple-tv-card-parallax-y"],
      });
    }, [scheduleStyle]);

    const updateBaseRect = useCallback(() => {
      if (!rootRef.current) return null;

      const rect = rootRef.current.getBoundingClientRect();
      const nextRect = {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
      };
      baseRectRef.current = nextRect;

      return nextRect;
    }, []);

    const scheduleInteractiveStyle = useCallback(
      (clientX: number, clientY: number) => {
        if (!rootRef.current) return;

        const rect = baseRectRef.current ?? rootRef.current.getBoundingClientRect();
        const x = clamp((clientX - rect.left) / rect.width, 0, 1);
        const y = clamp((clientY - rect.top) / rect.height, 0, 1);
        const centeredX = Math.max(-1, Math.min(1, x * 2 - 1));
        const centeredY = Math.max(-1, Math.min(1, y * 2 - 1));
        const shinePosition = getShinePosition(x, y);

        scheduleStyle({
          "--apple-tv-card-rx": `${-centeredY * tilt}deg`,
          "--apple-tv-card-ry": `${centeredX * tilt}deg`,
          "--apple-tv-card-sx": `${-centeredX * 34 * shadow}px`,
          "--apple-tv-card-sy": `${(50 - centeredY * 22) * shadow}px`,
          "--apple-tv-card-shadow-opacity": 0.9,
          "--apple-tv-card-scale": 1.026,
          "--apple-tv-card-shine-x": shinePosition.x,
          "--apple-tv-card-shine-y": shinePosition.y,
          "--apple-tv-card-shine-rotate": shinePosition.rotate,
          "--apple-tv-card-shine-opacity": shine,
          "--apple-tv-card-parallax-x": `${centeredX * parallax}px`,
          "--apple-tv-card-parallax-y": `${centeredY * parallax}px`,
        });
      },
      [parallax, scheduleStyle, shadow, shine, tilt],
    );

    useEffect(() => {
      const handleViewportChange = () => {
        const pointer = latestPointerRef.current;
        if (!isInteractionActiveRef.current || !pointer || !rootRef.current) return;

        const rect = updateBaseRect();
        if (!rect) return;

        const isPointerInside =
          pointer.clientX >= rect.left &&
          pointer.clientX <= rect.left + rect.width &&
          pointer.clientY >= rect.top &&
          pointer.clientY <= rect.top + rect.height;

        if (!isPointerInside) {
          isInteractionActiveRef.current = false;
          latestPointerRef.current = null;
          baseRectRef.current = null;
          reset();
          return;
        }

        scheduleInteractiveStyle(pointer.clientX, pointer.clientY);
      };

      window.addEventListener("scroll", handleViewportChange, { capture: true, passive: true });
      window.addEventListener("resize", handleViewportChange);

      return () => {
        window.removeEventListener("scroll", handleViewportChange, true);
        window.removeEventListener("resize", handleViewportChange);
      };
    }, [reset, scheduleInteractiveStyle, updateBaseRect]);

    const handlePointerEnter = (event: ReactPointerEvent<HTMLElement>) => {
      onPointerEnter?.(event);
      if (event.defaultPrevented || event.pointerType !== "mouse" || !isFinePointer()) {
        return;
      }
      updateBaseRect();
      isInteractionActiveRef.current = true;
      latestPointerRef.current = {
        clientX: event.clientX,
        clientY: event.clientY,
      };
      setEnabled(true);
      scheduleInteractiveStyle(event.clientX, event.clientY);
    };

    const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
      onPointerMove?.(event);
      if (
        event.defaultPrevented ||
        event.pointerType !== "mouse" ||
        !enabled ||
        !rootRef.current
      ) {
        return;
      }

      latestPointerRef.current = {
        clientX: event.clientX,
        clientY: event.clientY,
      };
      scheduleInteractiveStyle(event.clientX, event.clientY);
    };

    const handlePointerLeave = (event: ReactPointerEvent<HTMLElement>) => {
      onPointerLeave?.(event);
      isInteractionActiveRef.current = false;
      latestPointerRef.current = null;
      baseRectRef.current = null;
      reset();
    };

    return (
      <Box
        ref={ref}
        component={component}
        onPointerEnter={handlePointerEnter}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        style={{ ...cardStyle, ...style }}
        sx={[
          {
            position: "relative",
            display: "block",
            isolation: "isolate",
            overflow: "visible",
            backgroundColor: "transparent",
            zIndex: 0,
            WebkitTapHighlightColor: "transparent",
            "&:hover, &:focus-visible": {
              zIndex: 5,
            },
            "&:focus-visible": {
              outline: "3px solid currentColor",
              outlineOffset: -5,
            },
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        {...props}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            overflow: "visible",
            borderRadius: "6px",
            transform:
              "perspective(900px) rotateX(var(--apple-tv-card-rx)) rotateY(var(--apple-tv-card-ry)) scale(var(--apple-tv-card-scale)) translateZ(0)",
            transformStyle: "preserve-3d",
            transition: `transform 360ms ${HOVER_TRANSITION_EASING}`,
            willChange: "transform",
            "&::before": {
              content: '""',
              position: "absolute",
              inset: 0,
              zIndex: 0,
              borderRadius: "inherit",
              pointerEvents: "none",
              boxShadow:
                "var(--apple-tv-card-sx) var(--apple-tv-card-sy) 168px rgba(0, 0, 0, 0.88)",
              opacity: "var(--apple-tv-card-shadow-opacity)",
              transition: `opacity 360ms ${HOVER_TRANSITION_EASING}`,
              willChange: "box-shadow, opacity",
            },
            "@media (hover: none), (pointer: coarse), (prefers-reduced-motion: reduce)": {
              transform: "none",
              "&::before": {
                boxShadow: "none",
                opacity: 0,
              },
            },
          }}
        >
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              zIndex: 0,
              overflow: "hidden",
              borderRadius: "6px",
              "&::before": {
                content: '""',
                position: "absolute",
                left: "var(--apple-tv-card-shine-x)",
                top: "var(--apple-tv-card-shine-y)",
                width: "145%",
                height: "145%",
                zIndex: 3,
                pointerEvents: "none",
                background:
                  "radial-gradient(ellipse at center, rgba(255, 255, 255, 0.68) 0%, rgba(255, 255, 255, 0.32) 38%, rgba(255, 255, 255, 0) 78%)",
                mixBlendMode: "screen",
                opacity: "var(--apple-tv-card-shine-opacity)",
                transform: "translate3d(-50%, -50%, 0) rotate(var(--apple-tv-card-shine-rotate))",
                transition: `opacity 260ms ${HOVER_TRANSITION_EASING}`,
                willChange: "transform, opacity",
              },
            }}
          >
            <Box
              aria-hidden={Boolean(parallaxLayer) || undefined}
              sx={{
                position: "absolute",
                inset: 0,
                zIndex: 0,
                transform:
                  "translate3d(calc(var(--apple-tv-card-parallax-x) * -0.35), calc(var(--apple-tv-card-parallax-y) * -0.35), 0)",
                transition: `transform 340ms ${HOVER_TRANSITION_EASING}`,
                willChange: "transform",
                "@media (hover: none), (pointer: coarse), (prefers-reduced-motion: reduce)": {
                  transform: "none",
                },
              }}
            >
              {children}
            </Box>
            {parallaxLayer && (
              <Box
                sx={{
                  position: "absolute",
                  inset: "-4%",
                  zIndex: 1,
                  pointerEvents: "none",
                  transform:
                    "translate3d(var(--apple-tv-card-parallax-x), var(--apple-tv-card-parallax-y), 0)",
                  transition: `transform 340ms ${HOVER_TRANSITION_EASING}`,
                  willChange: "transform",
                  "@media (hover: none), (pointer: coarse), (prefers-reduced-motion: reduce)": {
                    transform: "none",
                  },
                }}
              >
                {parallaxLayer}
              </Box>
            )}
            {overlay && (
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  zIndex: 2,
                  pointerEvents: "none",
                }}
              >
                {overlay}
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    );
  },
);

AppleTvCard.displayName = "AppleTvCard";

export default AppleTvCard;
