import type { Locale } from "@/lib/i18n-config";
import {
  getLocalizedRouteHref,
  type SiteRouteId,
} from "@/lib/site-route-config";
import { getSiteRoutes } from "@/lib/site-routes";
import { getBreadcrumbJsonLd } from "@/lib/seo";
import JsonLd from "./JsonLd";

type RouteBreadcrumbJsonLdProps = {
  locale: Locale;
  route: Exclude<SiteRouteId, "home">;
  label: string;
};

const RouteBreadcrumbJsonLd = async ({
  locale,
  route,
  label,
}: RouteBreadcrumbJsonLdProps) => {
  const siteRoutes = await getSiteRoutes();

  return (
    <JsonLd
      data={getBreadcrumbJsonLd(locale, [
        {
          name: locale === "en" ? "Home" : "Accueil",
          path: getLocalizedRouteHref(siteRoutes, locale, "home"),
        },
        {
          name: label,
          path: getLocalizedRouteHref(siteRoutes, locale, route),
        },
      ])}
    />
  );
};

export default RouteBreadcrumbJsonLd;
