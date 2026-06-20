import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";
import ThemeProvider from "./theme/ThemeProvider";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { defaultLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import { siteName, siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: "Studio Volante — Studio de communication créative à Paris",
    template: `%s — ${siteName}`,
  },
  description:
    "Studio Volante accompagne les marques en identité visuelle, direction artistique et stratégie de contenu à Paris et partout en France.",
  applicationName: siteName,
  category: "design",
};

const RootLayout = async ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const headersList = await headers();
  const locale = (headersList.get("x-locale") ?? defaultLocale) as Locale;
  const comingSoon = headersList.get("x-coming-soon") === "true";

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var enabled=${JSON.stringify(!comingSoon)};var p=location.pathname;if(p.length>1&&p.endsWith('/'))p=p.slice(0,-1);var home=p==='/'||p==='/en';var reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;if(enabled&&home&&!reduced&&!sessionStorage.getItem('volante-intro-played'))document.documentElement.classList.add('volante-intro-enabled');}catch(e){}})();`,
          }}
        />
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
