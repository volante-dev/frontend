"use client";

import { ThemeProvider as MUIThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  );
}
