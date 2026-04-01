"use client";

import { ThemeProvider as MUIThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";

const ThemeProvider = ({ children }: { children: React.ReactNode }) => (
  <MUIThemeProvider theme={theme}>
    <CssBaseline />
    {children}
  </MUIThemeProvider>
);

export default ThemeProvider;
