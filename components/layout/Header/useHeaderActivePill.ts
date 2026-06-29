"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
type ActivePillItem = {
  key: string;
  href: string;
};

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
  offsetY: -8,
};

const getActiveKey = (pathname: string, items: ActivePillItem[]) =>
  items.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
    ?.key ?? null;

export const useHeaderActivePill = ({
  pathname,
  items,
  enabled = true,
}: {
  pathname: string;
  items: ActivePillItem[];
  enabled?: boolean;
}) => {
  const containerRef = useRef<HTMLElement | null>(null);
  const itemRefs = useRef(new Map<string, HTMLElement>());
  const previousActiveKeyRef = useRef<string | null>(null);
  const frameRef = useRef<number | null>(null);
  const hideTimeoutRef = useRef<number | null>(null);
  const [pill, setPill] = useState<ActivePillState>(hiddenPill);

  const activeKey = useMemo(() => getActiveKey(pathname, items), [items, pathname]);

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
    if (!enabled || !activeKey || !containerRef.current) return null;
    const item = itemRefs.current.get(activeKey);
    if (!item) return null;

    const containerRect = containerRef.current.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();

    return {
      x: itemRect.left - containerRect.left,
      y: itemRect.top - containerRect.top,
      width: itemRect.width,
      height: itemRect.height,
    };
  }, [activeKey, enabled]);

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
          offsetY: -8,
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
    if (!enabled) {
      clearTimers();
      frameRef.current = requestAnimationFrame(() => {
        setPill(hiddenPill);
      });
      previousActiveKeyRef.current = null;
      return;
    }

    const previousActiveKey = previousActiveKeyRef.current;

    if (!activeKey) {
      clearTimers();
      if (previousActiveKey) {
        frameRef.current = requestAnimationFrame(() => {
          setPill((current) => ({
            ...current,
            visible: false,
            offsetY: -8,
          }));
          hideTimeoutRef.current = window.setTimeout(() => {
            setPill(hiddenPill);
          }, 260);
        });
      } else {
        frameRef.current = requestAnimationFrame(() => {
          setPill(hiddenPill);
        });
      }
      previousActiveKeyRef.current = null;
      return;
    }

    positionPill(previousActiveKey === null);
    previousActiveKeyRef.current = activeKey;
  }, [activeKey, clearTimers, enabled, positionPill]);

  useEffect(() => {
    if (!enabled || !activeKey) return;

    const updatePosition = () => positionPill(false);
    window.addEventListener("resize", updatePosition);

    const container = containerRef.current;
    const item = itemRefs.current.get(activeKey);
    const observer =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(updatePosition);
    if (observer && container) observer.observe(container);
    if (observer && item) observer.observe(item);

    return () => {
      window.removeEventListener("resize", updatePosition);
      observer?.disconnect();
    };
  }, [activeKey, enabled, positionPill]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const registerItem = useCallback(
    (key: string) => (node: HTMLElement | null) => {
      if (node) {
        itemRefs.current.set(key, node);
      } else {
        itemRefs.current.delete(key);
      }
    },
    [],
  );

  return {
    activeKey,
    setContainerNode,
    registerItem,
    pill,
  };
};
