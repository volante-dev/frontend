import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { locales, defaultLocale, parseLocaleFromHeader } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import { slugs, getRouteKeyFromSlug } from "@/lib/i18n-routes";
import { PREVIEW_PARAM, PREVIEW_COOKIE, PREVIEW_COOKIE_MAX_AGE } from "@/lib/preview";

// Évite de répéter le cast (locales as string[]) à chaque fois
const localeValues = locales as string[];

export const proxy = (request: NextRequest) => {
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

  // --- Forçage de locale via ?lang= (sélecteur de langue) ---
  const langParam = request.nextUrl.searchParams.get("lang");
  if (langParam && localeValues.includes(langParam)) {
    const cleanUrl = new URL(request.url);
    cleanUrl.searchParams.delete("lang");
    const response = NextResponse.redirect(cleanUrl, 307);
    response.cookies.set("locale", langParam, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
    return response;
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

  // Locale finale : URL > cookie > Accept-Language > défaut
  const cookieLocale = request.cookies.get("locale")?.value;
  const locale: Locale =
    urlLocale ??
    (localeValues.includes(cookieLocale ?? "")
      ? (cookieLocale as Locale)
      : parseLocaleFromHeader(request.headers.get("accept-language")));

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
    return response;
  }

  // --- Rewrite pour les locales non-défaut (/en/...) ---
  let rewritePath = pathname;

  if (urlLocale && urlLocale !== defaultLocale) {
    const slugPart = parts.slice(1).join("/");

    if (!slugPart) {
      // /en → homepage
      rewritePath = "/";
    } else {
      const routeKey = getRouteKeyFromSlug(urlLocale, slugPart);
      // Slug connu → slug canonique FR ; slug inconnu → utiliser tel quel
      rewritePath = routeKey ? `/${slugs[defaultLocale][routeKey]}` : `/${slugPart}`;
    }
  }

  const response =
    rewritePath !== pathname
      ? NextResponse.rewrite(new URL(rewritePath, request.url), {
          request: { headers: requestHeaders },
        })
      : NextResponse.next({ request: { headers: requestHeaders } });

  // Persister la locale en cookie si elle a changé
  if (cookieLocale !== locale) {
    response.cookies.set("locale", locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }

  return response;
};

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
