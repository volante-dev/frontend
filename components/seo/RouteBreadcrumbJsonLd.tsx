import type { Locale } from "@/lib/i18n-config";
import type { RouteKey } from "@/lib/i18n-routes";
import { getLocalizedHref } from "@/lib/i18n-routes";
import { getBreadcrumbJsonLd } from "@/lib/seo";
import JsonLd from "./JsonLd";

type RouteBreadcrumbJsonLdProps = {
  locale: Locale;
  route: Exclude<RouteKey, "home">;
  label: string;
};

const RouteBreadcrumbJsonLd = ({
  locale,
  route,
  label,
}: RouteBreadcrumbJsonLdProps) => (
  <JsonLd
    data={getBreadcrumbJsonLd(locale, [
      {
        name: locale === "en" ? "Home" : "Accueil",
        path: getLocalizedHref(locale, "home"),
      },
      { name: label, path: getLocalizedHref(locale, route) },
    ])}
  />
);

export default RouteBreadcrumbJsonLd;
