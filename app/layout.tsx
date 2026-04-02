import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";
import ThemeProvider from "./theme/ThemeProvider";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { defaultLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Studio Volante — Agence de communication",
  description: "Studio Volante, agence de communication créative.",
};

const RootLayout = async ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const headersList = await headers();
  const locale = (headersList.get("x-locale") ?? defaultLocale) as Locale;

  return (
    <html lang={locale}>
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
};

export default RootLayout;
