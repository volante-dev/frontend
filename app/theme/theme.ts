"use client";

import { createTheme } from "@mui/material/styles";
import { colors, typography, borderRadius } from "./tokens";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: colors.green,
      light: colors.greenLight,
      dark: colors.greenDark,
      contrastText: colors.offWhite,
    },
    background: {
      default: colors.offWhite,
      paper: colors.white,
    },
    text: {
      primary: colors.mutedBlack,
      secondary: colors.mutedBlackLight,
    },
    divider: colors.blueGray,
    grey: {
      100: colors.blueGray,
      200: colors.blueGrayDark,
    },
  },

  typography: {
    fontFamily: typography.fontFamily,
    h1: {
      fontSize: "clamp(2.5rem, 5vw, 4rem)",
      fontWeight: 600,
      letterSpacing: "-0.03em",
      lineHeight: 1.1,
      color: colors.mutedBlack,
    },
    h2: {
      fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)",
      fontWeight: 600,
      letterSpacing: "-0.02em",
      lineHeight: 1.2,
      color: colors.mutedBlack,
    },
    h3: {
      fontSize: "clamp(1.25rem, 2.5vw, 1.875rem)",
      fontWeight: 500,
      letterSpacing: "-0.01em",
      lineHeight: 1.3,
      color: colors.mutedBlack,
    },
    h4: {
      fontSize: "1.25rem",
      fontWeight: 500,
      letterSpacing: "-0.01em",
      lineHeight: 1.4,
      color: colors.mutedBlack,
    },
    h5: {
      fontSize: "1rem",
      fontWeight: 500,
      lineHeight: 1.5,
      color: colors.mutedBlack,
    },
    h6: {
      fontSize: "0.875rem",
      fontWeight: 600,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      lineHeight: 1.5,
      color: colors.mutedBlackLight,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.7,
      color: colors.mutedBlack,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.6,
      color: colors.mutedBlackLight,
    },
    subtitle1: {
      fontSize: "1.125rem",
      fontWeight: 400,
      lineHeight: 1.6,
      color: colors.mutedBlackLight,
    },
    subtitle2: {
      fontSize: "0.875rem",
      fontWeight: 500,
      letterSpacing: "0.04em",
      textTransform: "uppercase",
      color: colors.mutedBlackLight,
    },
    button: {
      fontSize: "0.875rem",
      fontWeight: 500,
      letterSpacing: "0.02em",
      textTransform: "none",
    },
    caption: {
      fontSize: "0.75rem",
      lineHeight: 1.5,
      color: colors.mutedBlackLight,
    },
  },

  shape: {
    borderRadius: borderRadius.md,
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.sm,
          padding: "10px 24px",
          fontWeight: 500,
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
        contained: {
          "&:hover": {
            backgroundColor: colors.greenLight,
          },
        },
        outlined: {
          borderColor: colors.blueGrayDark,
          color: colors.mutedBlack,
          "&:hover": {
            borderColor: colors.green,
            color: colors.green,
            backgroundColor: "transparent",
          },
        },
        text: {
          color: colors.mutedBlack,
          "&:hover": {
            color: colors.green,
            backgroundColor: "transparent",
          },
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          border: `1px solid ${colors.blueGray}`,
          boxShadow: "none",
          borderRadius: borderRadius.lg,
          backgroundColor: colors.white,
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.sm,
          fontWeight: 500,
          fontSize: "0.75rem",
          letterSpacing: "0.02em",
        },
      },
    },

    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: borderRadius.sm,
            "& fieldset": {
              borderColor: colors.blueGrayDark,
            },
            "&:hover fieldset": {
              borderColor: colors.mutedBlackLight,
            },
            "&.Mui-focused fieldset": {
              borderColor: colors.green,
              borderWidth: 1,
            },
          },
        },
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: colors.blueGray,
        },
      },
    },

    MuiLink: {
      styleOverrides: {
        root: {
          color: colors.green,
          textDecoration: "none",
          "&:hover": {
            textDecoration: "underline",
          },
        },
      },
    },

    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: colors.offWhite,
          color: colors.mutedBlack,
        },
        "::selection": {
          backgroundColor: colors.green,
          color: colors.white,
        },
      },
    },
  },
});

export default theme;
