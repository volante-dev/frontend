"use client";

import { usePathname } from "next/navigation";

const isPortfolioPath = (pathname: string) =>
  pathname === "/portfolio" ||
  pathname.startsWith("/portfolio/") ||
  pathname === "/en/portfolio" ||
  pathname.startsWith("/en/portfolio/");

const SiteMain = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  return (
    <main style={{ paddingTop: isPortfolioPath(pathname) ? 0 : "var(--header-height)" }}>
      {children}
    </main>
  );
};

export default SiteMain;
