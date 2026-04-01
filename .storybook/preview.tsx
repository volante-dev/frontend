import type { Preview } from "@storybook/nextjs-vite";
import { ThemeProvider as MUIThemeProvider, CssBaseline } from "@mui/material";
import theme from "../app/theme/theme";
import React from "react";

const preview: Preview = {
  decorators: [
    (Story) => (
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        <Story />
      </MUIThemeProvider>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: "padded",
    a11y: {
      test: "todo",
    },
  },
};

export default preview;
