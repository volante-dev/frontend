import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";
import ThemeProvider from "./theme/ThemeProvider";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { defaultLocale, locales } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Studio Volante - Agence créative de la Petite Ceinture",
  description: "Studio Volante, Agence créative de la Petite Ceinture",
};

const RootLayout = async ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const headersList = await headers();
  const locale = (headersList.get("x-locale") ?? defaultLocale) as Locale;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";

  // Calcule l'URL canonique pour chaque locale (pour les balises hreflang)
  const hrefLangLinks = locales.map((l) => ({
    locale: l,
    href: l === defaultLocale ? appUrl || "/" : `${appUrl}/${l}`,
  }));

  return (
    <html lang={locale}>
      <head>
        {hrefLangLinks.map(({ locale: l, href }) => (
          <link key={l} rel="alternate" hrefLang={l} href={href} />
        ))}
        <link rel="alternate" hrefLang="x-default" href={appUrl || "/"} />
        <link rel="stylesheet" href="https://use.typekit.net/mah7tat.css" />
      </head>
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
};

export default RootLayout;
