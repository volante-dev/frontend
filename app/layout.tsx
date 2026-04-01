import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from "./theme/ThemeProvider";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";

export const metadata: Metadata = {
  title: "Studio Volante — Agence de communication",
  description: "Studio Volante, agence de communication créative.",
};

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => (
  <html lang="fr">
    <body>
      <AppRouterCacheProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </AppRouterCacheProvider>
    </body>
  </html>
);

export default RootLayout;
