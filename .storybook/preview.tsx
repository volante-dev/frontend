import type { Preview } from "@storybook/nextjs-vite";
import { ThemeProvider as MUIThemeProvider, CssBaseline } from "@mui/material";
import theme from "../app/theme/theme";
import React from "react";
import I18nProvider from "../components/providers/I18nProvider/I18nProvider";
import { localTranslations } from "../lib/i18n-messages";

const preview: Preview = {
  decorators: [
    (Story) => (
      <I18nProvider translationsByLocale={localTranslations}>
        <MUIThemeProvider theme={theme}>
          <CssBaseline />
          <Story />
        </MUIThemeProvider>
      </I18nProvider>
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
