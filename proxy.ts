import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { locales, defaultLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import {
  getAlternateRouteHref,
  getRouteFromPublicSlug,
  getSiteRouteById,
} from "@/lib/site-route-config";
import { getSiteRoutes } from "@/lib/site-routes";
import { PREVIEW_PARAM, PREVIEW_COOKIE, PREVIEW_COOKIE_MAX_AGE } from "@/lib/preview";

// Évite de répéter le cast (locales as string[]) à chaque fois
const localeValues = locales as string[];

export const proxy = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  // --- Passthrough : assets, API, coming-soon, fichiers statiques ---
  if (
    pathname === "/coming-soon" ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // --- Preview access via ?goProd=true ---
  const previewParam = request.nextUrl.searchParams.get(PREVIEW_PARAM);
  if (previewParam === "true") {
    const cleanUrl = new URL(request.nextUrl.pathname, request.url);
    const res = NextResponse.redirect(cleanUrl, 307);
    res.cookies.set(PREVIEW_COOKIE, "true", {
      path: "/",
      maxAge: PREVIEW_COOKIE_MAX_AGE,
      sameSite: "lax",
    });
    return res;
  }

  // --- Compatibilité avec les anciens liens ?lang= ---
  const langParam = request.nextUrl.searchParams.get("lang");
  if (langParam && localeValues.includes(langParam)) {
    const routes = await getSiteRoutes();
    const cleanPath = request.nextUrl.pathname;
    const targetPath = getAlternateRouteHref(routes, cleanPath, langParam as Locale);
    return NextResponse.redirect(new URL(targetPath, request.url), 307);
  }

  // --- Détection locale depuis l'URL (priorité sur cookie) ---
  const parts = pathname.split("/").filter(Boolean);
  const firstSegment = parts[0] ?? "";
  const urlLocale = localeValues.includes(firstSegment) ? (firstSegment as Locale) : null;

  // /fr ou /fr/... → redirect sans préfixe (le FR n'a pas de préfixe)
  if (urlLocale === defaultLocale) {
    const rest = parts.slice(1).join("/");
    return NextResponse.redirect(new URL(rest ? `/${rest}` : "/", request.url), 308);
  }

  // L'URL est l'unique source de vérité : sans préfixe, la page est française.
  const locale: Locale = urlLocale ?? defaultLocale;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-locale", locale);
  requestHeaders.set("x-initial-pathname", pathname);

  // --- Coming Soon ---
  const hasPreviewAccess = request.cookies.get(PREVIEW_COOKIE)?.value === "true";
  if (process.env.COMING_SOON === "true" && !hasPreviewAccess) {
    requestHeaders.set("x-coming-soon", "true");
    const response = NextResponse.rewrite(new URL("/coming-soon", request.url), {
      request: { headers: requestHeaders },
    });
    response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
    return response;
  }

  const siteRoutes = await getSiteRoutes();

  // Chaque locale possède désormais son propre segment interne afin que le
  // cache App Router ne puisse plus confondre les payloads français et anglais.
  const visibleParts = urlLocale ? parts.slice(1) : parts;
  const visibleSlug = visibleParts[0] ?? "";
  const route = visibleSlug
    ? getRouteFromPublicSlug(siteRoutes, locale, visibleSlug)
    : getSiteRouteById(siteRoutes, "home");

  if (visibleSlug && !route) {
    return NextResponse.rewrite(new URL(`/${locale}/__not-found`, request.url), {
      request: { headers: requestHeaders },
    });
  }

  const activeRoute = route ?? getSiteRouteById(siteRoutes, "home");
  const internalParts = activeRoute.internalSegment
    ? [activeRoute.internalSegment, ...visibleParts.slice(1)]
    : [];
  const rewritePath = internalParts.length
    ? `/${locale}/${internalParts.join("/")}`
    : `/${locale}`;

  const response =
    rewritePath !== pathname
      ? NextResponse.rewrite(new URL(rewritePath, request.url), {
          request: { headers: requestHeaders },
        })
      : NextResponse.next({ request: { headers: requestHeaders } });

  return response;
};

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
