"use client";

import { usePathname } from "next/navigation";
import { useCallback } from "react";
import { useDockMenuBoundary } from "@/components/layout/DockMenu/DockMenuProvider";

const isPortfolioPath = (pathname: string) =>
  pathname === "/portfolio" ||
  pathname.startsWith("/portfolio/") ||
  pathname === "/en/portfolio" ||
  pathname.startsWith("/en/portfolio/");

const SiteMain = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const setDockMenuBoundary = useDockMenuBoundary();
  const mainRef = useCallback(
    (node: HTMLElement | null) => {
      setDockMenuBoundary(node);
    },
    [setDockMenuBoundary],
  );

  return (
    <main
      ref={mainRef}
      style={{ paddingTop: isPortfolioPath(pathname) ? 0 : "var(--header-height)" }}
    >
      {children}
    </main>
  );
};

export default SiteMain;
