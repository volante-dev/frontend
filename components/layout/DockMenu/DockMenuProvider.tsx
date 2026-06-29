"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";

export type DockMenuItem = {
  id: string;
  label: string;
  icon: ReactNode;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
};

export type DockMenuConfig = {
  items: DockMenuItem[];
  ariaLabel?: string;
  enabled?: boolean;
};

type ActiveDockMenu = Required<Pick<DockMenuConfig, "items">> &
  Omit<DockMenuConfig, "items">;

type DockMenuContextValue = {
  renderedConfig: ActiveDockMenu | null;
  visible: boolean;
  setDockMenu: (sourceId: string, config: DockMenuConfig | null) => void;
  clearDockMenu: (sourceId: string) => void;
};

const EXIT_DURATION = 300;

const DockMenuContext = createContext<DockMenuContextValue | null>(null);

const normalizeConfig = (config: DockMenuConfig | null): ActiveDockMenu | null => {
  if (!config || config.enabled === false || config.items.length === 0) return null;
  return config;
};

export const useDockMenu = (config: DockMenuConfig | null) => {
  const context = useContext(DockMenuContext);
  const sourceId = useId();

  if (!context) {
    throw new Error("useDockMenu must be used inside DockMenuProvider.");
  }

  const { setDockMenu, clearDockMenu } = context;

  useEffect(() => {
    setDockMenu(sourceId, config);
    return () => clearDockMenu(sourceId);
  }, [clearDockMenu, config, setDockMenu, sourceId]);
};

const DockMenuProvider = ({ children }: { children: ReactNode }) => {
  const activeSourceRef = useRef<string | null>(null);
  const exitTimeoutRef = useRef<number | null>(null);
  const entryFrameRef = useRef<number | null>(null);
  const visibleRef = useRef(false);
  const [renderedConfig, setRenderedConfig] = useState<ActiveDockMenu | null>(null);
  const [visible, setVisible] = useState(false);

  const clearExitTimeout = useCallback(() => {
    if (exitTimeoutRef.current === null) return;
    window.clearTimeout(exitTimeoutRef.current);
    exitTimeoutRef.current = null;
  }, []);

  const clearEntryFrame = useCallback(() => {
    if (entryFrameRef.current === null) return;
    cancelAnimationFrame(entryFrameRef.current);
    entryFrameRef.current = null;
  }, []);

  const hideDock = useCallback(() => {
    visibleRef.current = false;
    setVisible(false);
    clearEntryFrame();
    clearExitTimeout();
    exitTimeoutRef.current = window.setTimeout(() => {
      setRenderedConfig(null);
      exitTimeoutRef.current = null;
    }, EXIT_DURATION);
  }, [clearEntryFrame, clearExitTimeout]);

  const setDockMenu = useCallback(
    (sourceId: string, config: DockMenuConfig | null) => {
      const nextConfig = normalizeConfig(config);

      if (!nextConfig) {
        if (activeSourceRef.current === sourceId) {
          activeSourceRef.current = null;
          hideDock();
        }
        return;
      }

      activeSourceRef.current = sourceId;
      const shouldAnimateEntry = !visibleRef.current;
      clearExitTimeout();
      setRenderedConfig(nextConfig);
      if (shouldAnimateEntry) {
        clearEntryFrame();
        setVisible(false);
        entryFrameRef.current = requestAnimationFrame(() => {
          entryFrameRef.current = null;
          visibleRef.current = true;
          setVisible(true);
        });
        return;
      }

      visibleRef.current = true;
      setVisible(true);
    },
    [clearEntryFrame, clearExitTimeout, hideDock],
  );

  const clearDockMenu = useCallback(
    (sourceId: string) => {
      if (activeSourceRef.current !== sourceId) return;
      activeSourceRef.current = null;
      hideDock();
    },
    [hideDock],
  );

  useEffect(() => () => {
    clearEntryFrame();
    clearExitTimeout();
  }, [clearEntryFrame, clearExitTimeout]);

  const value = useMemo(
    () => ({
      renderedConfig,
      visible,
      setDockMenu,
      clearDockMenu,
    }),
    [clearDockMenu, renderedConfig, setDockMenu, visible],
  );

  return (
    <DockMenuContext.Provider value={value}>{children}</DockMenuContext.Provider>
  );
};

export const useDockMenuState = () => {
  const context = useContext(DockMenuContext);
  if (!context) {
    throw new Error("useDockMenuState must be used inside DockMenuProvider.");
  }
  return context;
};

export default DockMenuProvider;
