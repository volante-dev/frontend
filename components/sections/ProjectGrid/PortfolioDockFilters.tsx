"use client";

import AppsIcon from "@mui/icons-material/Apps";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useDockMenu } from "@/components/layout/DockMenu/DockMenuProvider";
import { getDockMenuIcon } from "@/components/layout/DockMenu/dockMenuIcons";
import { useI18n } from "@/components/providers/I18nProvider/I18nProvider";
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
  const { siteRoutes } = useI18n();
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
          onClick: () => router.push(portfolioPath(locale, siteRoutes)),
        },
        ...sectors.map((sector) => ({
          id: sector.id,
          label: sector.label,
          icon: getDockMenuIcon(sector.icon),
          active: activeSectorSlug === sector.slug,
          onClick: () =>
            router.push(portfolioSectorPath(locale, sector.slug, siteRoutes)),
        })),
      ],
    }),
    [activeSectorSlug, locale, router, sectors, siteRoutes],
  );

  useDockMenu(sectors.length > 0 ? config : null);

  return null;
};

export default PortfolioDockFilters;
