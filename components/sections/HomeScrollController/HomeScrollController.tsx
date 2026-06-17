"use client";

import { useEffect, useRef } from "react";

const HERO_SELECTOR = '[data-scroll-anchor="hero-video"]';
const NEXT_SECTION_SELECTOR = '[data-scroll-anchor="post-hero"]';
const POSITION_TOLERANCE = 4;
const WHEEL_DELTA_THRESHOLD = 8;
const TOUCH_DELTA_THRESHOLD = 12;
const LOCK_TIMEOUT_MS = 900;

type ScrollDirection = "up" | "down";

const getAbsoluteTop = (element: Element): number =>
  element.getBoundingClientRect().top + window.scrollY;

const getScrollBehavior = (): ScrollBehavior =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";

const isEditableTarget = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) return false;

  return (
    target.isContentEditable ||
    ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)
  );
};

const normalizeWheelDelta = (event: WheelEvent): number => {
  if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) {
    return event.deltaY * 16;
  }

  if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
    return event.deltaY * window.innerHeight;
  }

  return event.deltaY;
};

const isDownKey = (event: KeyboardEvent): boolean =>
  event.key === "ArrowDown" || event.key === "PageDown" || event.key === " ";

const isUpKey = (event: KeyboardEvent): boolean =>
  event.key === "ArrowUp" ||
  event.key === "PageUp" ||
  (event.key === " " && event.shiftKey);

const getKeyboardDelta = (event: KeyboardEvent): number => {
  if (event.key === "PageDown" || event.key === "PageUp" || event.key === " ") {
    return window.innerHeight * (isDownKey(event) && !event.shiftKey ? 1 : -1);
  }

  return event.key === "ArrowDown" ? 48 : -48;
};

const HomeScrollController = () => {
  const lockedRef = useRef(false);
  const unlockAnimationFrameRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  useEffect(() => {
    const hero = document.querySelector(HERO_SELECTOR);
    const nextSection = document.querySelector(NEXT_SECTION_SELECTOR);

    if (!hero || !nextSection) return;

    const unlockWhenSettled = (targetTop: number) => {
      const startedAt = performance.now();

      const tick = () => {
        const reachedTarget = Math.abs(window.scrollY - targetTop) <= POSITION_TOLERANCE;
        const timedOut = performance.now() - startedAt > LOCK_TIMEOUT_MS;

        if (reachedTarget || timedOut) {
          lockedRef.current = false;
          unlockAnimationFrameRef.current = null;
          return;
        }

        unlockAnimationFrameRef.current = window.requestAnimationFrame(tick);
      };

      unlockAnimationFrameRef.current = window.requestAnimationFrame(tick);
    };

    const scrollTo = (top: number, behavior: ScrollBehavior = getScrollBehavior()) => {
      lockedRef.current = true;
      window.scrollTo({ top, behavior });
      unlockWhenSettled(top);
    };

    const handleScrollIntent = (
      direction: ScrollDirection,
      projectedDelta: number,
      event: Event,
    ): boolean => {
      if (lockedRef.current) {
        event.preventDefault();
        return true;
      }

      const targetTop = getAbsoluteTop(nextSection);
      const currentY = window.scrollY;

      if (direction === "down" && currentY < targetTop - POSITION_TOLERANCE) {
        event.preventDefault();
        scrollTo(targetTop);
        return true;
      }

      if (direction === "up" && currentY <= targetTop + POSITION_TOLERANCE) {
        event.preventDefault();
        scrollTo(0);
        return true;
      }

      if (
        direction === "up" &&
        currentY > targetTop + POSITION_TOLERANCE &&
        currentY + projectedDelta < targetTop + POSITION_TOLERANCE
      ) {
        event.preventDefault();
        scrollTo(targetTop, "auto");
        return true;
      }

      return false;
    };

    const handleWheel = (event: WheelEvent) => {
      if (isEditableTarget(event.target)) return;

      const deltaY = normalizeWheelDelta(event);
      if (Math.abs(deltaY) < WHEEL_DELTA_THRESHOLD) return;

      handleScrollIntent(deltaY > 0 ? "down" : "up", deltaY, event);
    };

    const handleTouchStart = (event: TouchEvent) => {
      touchStartYRef.current = event.touches[0]?.clientY ?? null;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (isEditableTarget(event.target)) return;
      if (touchStartYRef.current === null) return;

      const currentY = event.touches[0]?.clientY;
      if (currentY === undefined) return;

      const deltaY = touchStartYRef.current - currentY;
      if (Math.abs(deltaY) < TOUCH_DELTA_THRESHOLD) return;

      const handled = handleScrollIntent(deltaY > 0 ? "down" : "up", deltaY, event);
      if (handled) {
        touchStartYRef.current = currentY;
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (isEditableTarget(event.target)) return;
      if (!isDownKey(event) && !isUpKey(event)) return;

      const delta = getKeyboardDelta(event);
      handleScrollIntent(delta > 0 ? "down" : "up", delta, event);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("keydown", handleKeyDown);
      if (unlockAnimationFrameRef.current !== null) {
        window.cancelAnimationFrame(unlockAnimationFrameRef.current);
      }
    };
  }, []);

  return null;
};

export default HomeScrollController;
