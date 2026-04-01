import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const proxy = (request: NextRequest) => {
  if (process.env.COMING_SOON !== "true") {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  // Laisser passer : la page elle-même, assets Next.js, routes API, fichiers statiques
  if (
    pathname === "/coming-soon" ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  return NextResponse.rewrite(new URL("/coming-soon", request.url));
};

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
