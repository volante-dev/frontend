"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { DockMenuItem } from "./DockMenuProvider";

type ActivePillState = {
  mounted: boolean;
  visible: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  offsetY: number;
};

const hiddenPill: ActivePillState = {
  mounted: false,
  visible: false,
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  offsetY: -6,
};

export const useDockActivePill = (items: DockMenuItem[]) => {
  const containerRef = useRef<HTMLElement | null>(null);
  const itemRefs = useRef(new Map<string, HTMLElement>());
  const previousActiveIdRef = useRef<string | null>(null);
  const frameRef = useRef<number | null>(null);
  const hideTimeoutRef = useRef<number | null>(null);
  const [pill, setPill] = useState<ActivePillState>(hiddenPill);

  const activeId = useMemo(
    () => items.find((item) => item.active)?.id ?? null,
    [items],
  );

  const setContainerNode = useCallback((node: HTMLElement | null) => {
    containerRef.current = node;
  }, []);

  const clearTimers = useCallback(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
    if (hideTimeoutRef.current !== null) {
      window.clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  }, []);

  const measureActiveItem = useCallback(() => {
    if (!activeId || !containerRef.current) return null;
    const item = itemRefs.current.get(activeId);
    if (!item) return null;

    const containerRect = containerRef.current.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();

    return {
      x: itemRect.left - containerRect.left,
      y: itemRect.top - containerRect.top,
      width: itemRect.width,
      height: itemRect.height,
    };
  }, [activeId]);

  const positionPill = useCallback(
    (animateEntry: boolean) => {
      const rect = measureActiveItem();
      if (!rect) return;

      clearTimers();

      if (animateEntry) {
        setPill({
          mounted: true,
          visible: false,
          ...rect,
          offsetY: -6,
        });
        frameRef.current = requestAnimationFrame(() => {
          setPill((current) => ({
            ...current,
            visible: true,
            offsetY: 0,
          }));
        });
        return;
      }

      setPill({
        mounted: true,
        visible: true,
        ...rect,
        offsetY: 0,
      });
    },
    [clearTimers, measureActiveItem],
  );

  useLayoutEffect(() => {
    const previousActiveId = previousActiveIdRef.current;

    if (!activeId) {
      clearTimers();
      if (previousActiveId) {
        frameRef.current = requestAnimationFrame(() => {
          setPill((current) => ({
            ...current,
            visible: false,
            offsetY: -6,
          }));
          hideTimeoutRef.current = window.setTimeout(() => {
            setPill(hiddenPill);
          }, 240);
        });
      } else {
        frameRef.current = requestAnimationFrame(() => {
          setPill(hiddenPill);
        });
      }
      previousActiveIdRef.current = null;
      return;
    }

    positionPill(previousActiveId === null);
    previousActiveIdRef.current = activeId;
  }, [activeId, clearTimers, positionPill]);

  useEffect(() => {
    if (!activeId) return;

    const updatePosition = () => positionPill(false);
    window.addEventListener("resize", updatePosition);

    const container = containerRef.current;
    const item = itemRefs.current.get(activeId);
    const observer =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(updatePosition);
    if (observer && container) observer.observe(container);
    if (observer && item) observer.observe(item);

    return () => {
      window.removeEventListener("resize", updatePosition);
      observer?.disconnect();
    };
  }, [activeId, positionPill]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const registerItem = useCallback(
    (id: string) => (node: HTMLElement | null) => {
      if (node) {
        itemRefs.current.set(id, node);
      } else {
        itemRefs.current.delete(id);
      }
    },
    [],
  );

  return {
    activeId,
    setContainerNode,
    registerItem,
    pill,
  };
};
