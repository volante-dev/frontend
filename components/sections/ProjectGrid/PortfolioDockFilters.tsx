"use client";

import AppsIcon from "@mui/icons-material/Apps";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useDockMenu } from "@/components/layout/DockMenu/DockMenuProvider";
import { getDockMenuIcon } from "@/components/layout/DockMenu/dockMenuIcons";
import type { Locale } from "@/lib/i18n-config";
import { portfolioPath, portfolioSectorPath } from "@/lib/portfolio-routes";

export type PortfolioSectorFilter = {
  id: string;
  label: string;
  slug: string;
  icon?: string | null;
};

type PortfolioDockFiltersProps = {
  locale: Locale;
  sectors: PortfolioSectorFilter[];
  activeSectorSlug?: string | null;
};

const PortfolioDockFilters = ({
  locale,
  sectors,
  activeSectorSlug,
}: PortfolioDockFiltersProps) => {
  const router = useRouter();
  const config = useMemo(
    () => ({
      ariaLabel:
        locale === "en" ? "Portfolio sector filters" : "Filtres des réalisations",
      items: [
        {
          id: "all",
          label: locale === "en" ? "All" : "Tous",
          icon: <AppsIcon />,
          active: !activeSectorSlug,
          onClick: () => router.push(portfolioPath(locale)),
        },
        ...sectors.map((sector) => ({
          id: sector.id,
          label: sector.label,
          icon: getDockMenuIcon(sector.icon),
          active: activeSectorSlug === sector.slug,
          onClick: () => router.push(portfolioSectorPath(locale, sector.slug)),
        })),
      ],
    }),
    [activeSectorSlug, locale, router, sectors],
  );

  useDockMenu(sectors.length > 0 ? config : null);

  return null;
};

export default PortfolioDockFilters;
