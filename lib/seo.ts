import type { Metadata } from "next";
import type { Locale } from "./i18n-config";
import {
  defaultSiteRoutes,
  getLocalizedRouteHref,
  type SiteRoute,
  type SiteRouteId,
} from "./site-route-config";

export const siteName = "Studio Volante";
export const siteDescription =
  "Studio Volante accompagne galeries, artistes, institutions culturelles, lieux de patrimoine et marques pour révéler leurs récits, images et prises de parole.";
export const siteDescriptionEn =
  "Studio Volante helps galleries, artists, cultural institutions, heritage venues and brands shape their stories, images and public presence.";
export const siteUrl = new URL(
  process.env.NEXT_PUBLIC_APP_URL ?? "https://studio-volante.fr",
);

const absoluteUrl = (pathname: string) => new URL(pathname, siteUrl).toString();

export const projectPath = (
  locale: Locale,
  slug: string,
  siteRoutes: SiteRoute[] = defaultSiteRoutes,
) => {
  const portfolio = getLocalizedRouteHref(siteRoutes, locale, "portfolio");
  return `${portfolio}/${slug}`;
};

export const blogPostPath = (
  locale: Locale,
  slug: string,
  siteRoutes: SiteRoute[] = defaultSiteRoutes,
) => {
  const trailblaze = getLocalizedRouteHref(siteRoutes, locale, "trailblaze");
  return `${trailblaze}/${slug}`;
};

type PageMetadataInput = {
  locale: Locale;
  route?: SiteRouteId;
  siteRoutes?: SiteRoute[];
  pathname?: string;
  alternatePathname?: string;
  title: string;
  description: string;
  image?: string | null;
  noIndex?: boolean;
  type?: "website" | "article";
};

export const createPageMetadata = ({
  locale,
  route,
  siteRoutes = defaultSiteRoutes,
  pathname,
  alternatePathname,
  title,
  description,
  image,
  noIndex = false,
  type = "website",
}: PageMetadataInput): Metadata => {
  const currentPath = route
    ? getLocalizedRouteHref(siteRoutes, locale, route)
    : pathname ?? "/";
  const otherLocale: Locale = locale === "fr" ? "en" : "fr";
  const otherPath = route
    ? getLocalizedRouteHref(siteRoutes, otherLocale, route)
    : alternatePathname ?? currentPath;
  const frPath = locale === "fr" ? currentPath : otherPath;
  const enPath = locale === "en" ? currentPath : otherPath;
  const canonical = absoluteUrl(currentPath);
  const imageUrl = image ? absoluteUrl(image) : absoluteUrl("/opengraph-image");

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        fr: absoluteUrl(frPath),
        en: absoluteUrl(enPath),
        "x-default": absoluteUrl(frPath),
      },
    },
    robots: noIndex
      ? { index: false, follow: false, noarchive: true }
      : { index: true, follow: true },
    openGraph: {
      type,
      locale: locale === "fr" ? "fr_FR" : "en_GB",
      alternateLocale: locale === "fr" ? ["en_GB"] : ["fr_FR"],
      siteName,
      title,
      description,
      url: canonical,
      images: [{ url: imageUrl, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
};

const compact = <T extends Record<string, unknown>>(value: T): T =>
  Object.fromEntries(
    Object.entries(value).filter(([, entry]) => {
      if (entry === undefined || entry === null || entry === "") return false;
      if (Array.isArray(entry)) return entry.length > 0;
      return true;
    }),
  ) as T;

export const getOrganizationJsonLd = () => {
  const sameAs = (process.env.NEXT_PUBLIC_SOCIAL_PROFILES ?? "")
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean);
  const streetAddress = process.env.NEXT_PUBLIC_STUDIO_STREET_ADDRESS;
  const postalCode = process.env.NEXT_PUBLIC_STUDIO_POSTAL_CODE;
  const addressLocality = process.env.NEXT_PUBLIC_STUDIO_CITY ?? "Paris";
  const legalName = process.env.NEXT_PUBLIC_STUDIO_LEGAL_NAME;
  const telephone = process.env.NEXT_PUBLIC_STUDIO_PHONE;

  return compact({
    "@context": "https://schema.org",
    "@type": ["Organization", "ProfessionalService"],
    "@id": `${siteUrl.origin}/#organization`,
    name: siteName,
    legalName,
    url: siteUrl.origin,
    logo: absoluteUrl("/favicon.ico"),
    email: "yasmine@studio-volante.fr",
    telephone,
    description: siteDescription,
    areaServed: [
      { "@type": "City", name: "Paris" },
      { "@type": "Country", name: "France" },
    ],
    address:
      streetAddress || postalCode
        ? compact({
            "@type": "PostalAddress",
            streetAddress,
            postalCode,
            addressLocality,
            addressCountry: "FR",
          })
        : undefined,
    sameAs,
  });
};

export const getWebsiteJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl.origin}/#website`,
  url: siteUrl.origin,
  name: siteName,
  description: siteDescription,
  inLanguage: ["fr-FR", "en-GB"],
  publisher: { "@id": `${siteUrl.origin}/#organization` },
});

export const getBreadcrumbJsonLd = (
  locale: Locale,
  items: Array<{ name: string; path: string }>,
) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: absoluteUrl(item.path),
  })),
  inLanguage: locale === "fr" ? "fr-FR" : "en-GB",
});

export const toAbsoluteUrl = absoluteUrl;
