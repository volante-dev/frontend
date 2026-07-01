import Box, { type BoxProps } from "@mui/material/Box";
import {
  useCallback,
  useEffect,
  useRef,
  type CSSProperties,
  type FocusEvent,
  type PointerEvent,
} from "react";

export const depthHoverItemProps = {
  "data-depth-hover-item": "true",
} as const;

export const depthHoverTriggerProps = {
  ...depthHoverItemProps,
  "data-depth-hover-trigger": "true",
} as const;

export const depthHoverDirectionProps = (direction: "left" | "right" | "center") =>
  ({
    "data-depth-hover-direction": direction,
  }) as const;

export const depthHoverItemStyle = ({
  translateX,
  scale,
}: {
  translateX: number;
  scale: number;
}) =>
  ({
    "--depth-hover-translate-x-base": translateX,
    "--depth-hover-translate-x": `${translateX}px`,
    "--depth-hover-scale": scale,
  }) as CSSProperties;

const depthHoverTriggerSelector = '[data-depth-hover-trigger="true"]';
const depthHoverItemSelector = '[data-depth-hover-item="true"]';
const depthHoverWaveIntervalMs = 45;
const depthHoverClearDelayMs = 90;
const depthHoverDistanceBandTolerance = 4;
const depthHoverTransitionDurationMs = 520;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const depthHoverGroupSx = {
  "@media (hover: hover) and (pointer: fine)": {
    [`& ${depthHoverItemSelector}`]: {
      "--depth-hover-translate-x-base": 0,
      "--depth-hover-translate-x": "0px",
      "--depth-hover-translate-y": "0px",
      "--depth-hover-scale": 0.982,
      "--depth-hover-delay": "0ms",
      transformOrigin: "center center",
      transition:
        `filter ${depthHoverTransitionDurationMs}ms cubic-bezier(0.16, 1, 0.3, 1) var(--depth-hover-delay), transform ${depthHoverTransitionDurationMs}ms cubic-bezier(0.16, 1, 0.3, 1) var(--depth-hover-delay)`,
      willChange: "filter, transform",
    },
    [`& [data-depth-hover-direction="left"]`]: {
      "--depth-hover-translate-x-base": 6,
    },
    [`& [data-depth-hover-direction="right"]`]: {
      "--depth-hover-translate-x-base": -6,
    },
    [`&[data-depth-hover-active="true"] ${depthHoverItemSelector}[data-depth-hover-state="blurred"]`]: {
      filter: "brightness(0.64) blur(2px)",
      transform:
        "translate3d(var(--depth-hover-translate-x), var(--depth-hover-translate-y), 0) scale(var(--depth-hover-scale))",
    },
    [`&[data-depth-hover-active="true"] ${depthHoverItemSelector}[data-depth-hover-active-item="true"]`]: {
      filter: "none",
      transform: "translate3d(0, 0, 0) scale(1)",
      zIndex: 6,
    },
  },
  "@media (hover: none), (pointer: coarse), (prefers-reduced-motion: reduce)": {
    [`& ${depthHoverItemSelector}`]: {
      filter: "none",
      transform: "none",
      transition: "none",
      willChange: "auto",
    },
  },
};

const updateViewportDepthTranslations = (root: HTMLElement) => {
  const viewportCenterY = window.innerHeight / 2;
  const rootWidth = root.getBoundingClientRect().width;
  const referenceWidth = 1440;
  const widthScale = clamp(rootWidth / referenceWidth, 0.72, 1.28);
  const projectionStrengthY = 1.35;
  const items = Array.from(root.querySelectorAll<HTMLElement>(depthHoverItemSelector));

  items.forEach((item) => {
    const rect = item.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(item);
    const translateXBase = Number.parseFloat(
      computedStyle.getPropertyValue("--depth-hover-translate-x-base"),
    );
    const scale = Number.parseFloat(
      computedStyle.getPropertyValue("--depth-hover-scale"),
    );
    const itemCenterY = rect.top + rect.height / 2;
    const scaleDepth = Number.isFinite(scale) ? 1 - scale : 0;
    const translateX = Number.isFinite(translateXBase) ? translateXBase * widthScale : 0;
    const translateY = (viewportCenterY - itemCenterY) * scaleDepth * projectionStrengthY;

    item.style.setProperty("--depth-hover-translate-x", `${translateX.toFixed(2)}px`);
    item.style.setProperty("--depth-hover-translate-y", `${translateY.toFixed(2)}px`);
  });
};

const getRectDistance = (source: DOMRect, target: DOMRect) => {
  const horizontalGap = Math.max(source.left - target.right, target.left - source.right, 0);
  const verticalGap = Math.max(source.top - target.bottom, target.top - source.bottom, 0);

  return Math.hypot(horizontalGap, verticalGap);
};

const getDepthHoverTrigger = (target: EventTarget | null, root: HTMLElement) => {
  const element = target instanceof Element ? target : null;
  const trigger = element?.closest<HTMLElement>(depthHoverTriggerSelector) ?? null;

  return trigger && root.contains(trigger) ? trigger : null;
};

const clearDepthHoverState = (root: HTMLElement) => {
  root.removeAttribute("data-depth-hover-active");

  root.querySelectorAll<HTMLElement>(depthHoverItemSelector).forEach((item) => {
    item.removeAttribute("data-depth-hover-active-item");
    item.removeAttribute("data-depth-hover-state");
    item.style.removeProperty("--depth-hover-delay");
  });
};

const applyDepthHoverState = (root: HTMLElement, activeItem: HTMLElement) => {
  const items = Array.from(root.querySelectorAll<HTMLElement>(depthHoverItemSelector));
  const activeRect = activeItem.getBoundingClientRect();

  root.setAttribute("data-depth-hover-active", "true");
  activeItem.style.setProperty("--depth-hover-delay", "0ms");
  activeItem.setAttribute("data-depth-hover-active-item", "true");
  activeItem.removeAttribute("data-depth-hover-state");

  const entries = items
    .filter((item) => item !== activeItem)
    .map((item) => {
      const rect = item.getBoundingClientRect();

      return {
        item,
        rect,
        distance: getRectDistance(activeRect, rect),
      };
    })
    .sort((a, b) => {
      if (a.distance !== b.distance) return a.distance - b.distance;
      if (a.rect.top !== b.rect.top) return a.rect.top - b.rect.top;
      return a.rect.left - b.rect.left;
    });

  let waveStep = 0;
  let previousDistance: number | null = null;

  entries.forEach(({ item, distance }) => {
    const wasBlurred = item.getAttribute("data-depth-hover-state") === "blurred";

    if (
      previousDistance !== null &&
      distance > previousDistance + depthHoverDistanceBandTolerance
    ) {
      waveStep += 1;
    }

    item.removeAttribute("data-depth-hover-active-item");
    if (!wasBlurred) {
      item.style.setProperty(
        "--depth-hover-delay",
        `${waveStep * depthHoverWaveIntervalMs}ms`,
      );
    }
    item.setAttribute("data-depth-hover-state", "blurred");
    previousDistance = distance;
  });
};

const DepthHoverGroup = ({
  sx,
  onPointerEnter,
  onPointerOverCapture,
  onPointerOutCapture,
  onPointerLeave,
  onFocusCapture,
  onBlurCapture,
  ...props
}: BoxProps) => {
  const rootRef = useRef<HTMLElement | null>(null);
  const isDepthInteractionActiveRef = useRef(false);
  const activeDepthHoverItemRef = useRef<HTMLElement | null>(null);
  const depthTranslationFrameRef = useRef<number | null>(null);
  const clearDepthInteractionTimeoutRef = useRef<number | null>(null);

  const refreshDepthTranslations = useCallback(() => {
    const root = rootRef.current;
    if (!root || depthTranslationFrameRef.current !== null) return;

    depthTranslationFrameRef.current = window.requestAnimationFrame(() => {
      depthTranslationFrameRef.current = null;
      if (!rootRef.current) return;
      updateViewportDepthTranslations(rootRef.current);
    });
  }, []);

  useEffect(() => {
    const handleViewportChange = () => {
      if (!isDepthInteractionActiveRef.current) return;
      refreshDepthTranslations();
    };

    window.addEventListener("scroll", handleViewportChange, { capture: true, passive: true });
    window.addEventListener("resize", handleViewportChange);

    return () => {
      window.removeEventListener("scroll", handleViewportChange, true);
      window.removeEventListener("resize", handleViewportChange);

      if (depthTranslationFrameRef.current !== null) {
        window.cancelAnimationFrame(depthTranslationFrameRef.current);
        depthTranslationFrameRef.current = null;
      }

      if (clearDepthInteractionTimeoutRef.current !== null) {
        window.clearTimeout(clearDepthInteractionTimeoutRef.current);
        clearDepthInteractionTimeoutRef.current = null;
      }
    };
  }, [refreshDepthTranslations]);

  const cancelPendingClearDepthInteraction = useCallback(() => {
    if (clearDepthInteractionTimeoutRef.current === null) return;

    window.clearTimeout(clearDepthInteractionTimeoutRef.current);
    clearDepthInteractionTimeoutRef.current = null;
  }, []);

  const activateDepthHoverItem = useCallback(
    (activeItem: HTMLElement) => {
      const root = rootRef.current;
      if (!root) return;

      cancelPendingClearDepthInteraction();
      isDepthInteractionActiveRef.current = true;
      refreshDepthTranslations();

      if (activeDepthHoverItemRef.current === activeItem) return;

      activeDepthHoverItemRef.current = activeItem;
      updateViewportDepthTranslations(root);
      applyDepthHoverState(root, activeItem);
    },
    [cancelPendingClearDepthInteraction, refreshDepthTranslations],
  );

  const clearDepthInteraction = useCallback(() => {
    const root = rootRef.current;

    cancelPendingClearDepthInteraction();
    isDepthInteractionActiveRef.current = false;
    activeDepthHoverItemRef.current = null;
    if (root) clearDepthHoverState(root);
  }, [cancelPendingClearDepthInteraction]);

  const scheduleClearDepthInteraction = useCallback(() => {
    if (!activeDepthHoverItemRef.current || clearDepthInteractionTimeoutRef.current !== null) {
      return;
    }

    clearDepthInteractionTimeoutRef.current = window.setTimeout(() => {
      clearDepthInteractionTimeoutRef.current = null;
      clearDepthInteraction();
    }, depthHoverClearDelayMs);
  }, [clearDepthInteraction]);

  const handlePointerEnter = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      onPointerEnter?.(event);
      if (event.defaultPrevented || event.pointerType !== "mouse" || !rootRef.current) return;
      isDepthInteractionActiveRef.current = true;
      refreshDepthTranslations();
    },
    [onPointerEnter, refreshDepthTranslations],
  );

  const handlePointerOverCapture = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      onPointerOverCapture?.(event);
      const root = rootRef.current;
      if (event.defaultPrevented || event.pointerType !== "mouse" || !root) return;

      const trigger = getDepthHoverTrigger(event.target, root);
      const activeItem = trigger?.closest<HTMLElement>(depthHoverItemSelector);
      if (!activeItem) {
        scheduleClearDepthInteraction();
        return;
      }

      activateDepthHoverItem(activeItem);
    },
    [activateDepthHoverItem, onPointerOverCapture, scheduleClearDepthInteraction],
  );

  const handlePointerOutCapture = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      onPointerOutCapture?.(event);
      const root = rootRef.current;
      if (event.defaultPrevented || event.pointerType !== "mouse" || !root) return;

      const sourceTrigger = getDepthHoverTrigger(event.target, root);
      if (!sourceTrigger) return;

      const nextTrigger = getDepthHoverTrigger(event.relatedTarget, root);
      if (nextTrigger) return;

      scheduleClearDepthInteraction();
    },
    [onPointerOutCapture, scheduleClearDepthInteraction],
  );

  const handlePointerLeave = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      onPointerLeave?.(event);
      if (event.defaultPrevented || event.pointerType !== "mouse") return;
      clearDepthInteraction();
    },
    [clearDepthInteraction, onPointerLeave],
  );

  const handleFocusCapture = useCallback(
    (event: FocusEvent<HTMLDivElement>) => {
      onFocusCapture?.(event);
      const root = rootRef.current;
      if (event.defaultPrevented || !root) return;

      const trigger = getDepthHoverTrigger(event.target, root);
      const activeItem = trigger?.closest<HTMLElement>(depthHoverItemSelector);
      if (!activeItem) return;

      activateDepthHoverItem(activeItem);
    },
    [activateDepthHoverItem, onFocusCapture],
  );

  const handleBlurCapture = useCallback(
    (event: FocusEvent<HTMLDivElement>) => {
      onBlurCapture?.(event);
      const root = rootRef.current;
      if (event.defaultPrevented || !root) return;

      const nextFocusedElement = event.relatedTarget;
      if (
        nextFocusedElement instanceof Node &&
        root.contains(nextFocusedElement) &&
        getDepthHoverTrigger(nextFocusedElement, root)
      ) {
        return;
      }

      clearDepthInteraction();
    },
    [clearDepthInteraction, onBlurCapture],
  );

  return (
    <Box
      ref={rootRef}
      onPointerEnter={handlePointerEnter}
      onPointerOverCapture={handlePointerOverCapture}
      onPointerOutCapture={handlePointerOutCapture}
      onPointerLeave={handlePointerLeave}
      onFocusCapture={handleFocusCapture}
      onBlurCapture={handleBlurCapture}
      sx={[
        depthHoverGroupSx,
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...props}
    />
  );
};

export default DepthHoverGroup;
