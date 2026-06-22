"use client";

import { createTheme } from "@mui/material/styles";
import { keyframes } from "@emotion/react";
import { colors, typography, borderRadius } from "./tokens";

const pulseGlow = keyframes`
  0%, 100% {
    box-shadow: 0 10px 32px rgba(63, 94, 90, 0.50), 0 4px 16px rgba(216, 202, 170, 0.40);
  }
  50% {
    box-shadow: 0 14px 44px rgba(63, 94, 90, 0.68), 0 6px 22px rgba(216, 202, 170, 0.52);
  }
`;

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
      fontFamily: typography.fontFamilyDisplay,
      fontSize: "clamp(2.5rem, 5vw, 4rem)",
      fontWeight: 200,
      letterSpacing: "0.01em",
      lineHeight: 1.05,
      color: colors.mutedBlack,
    },
    h2: {
      fontFamily: typography.fontFamilyDisplay,
      fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)",
      fontWeight: 200,
      letterSpacing: "0.01em",
      lineHeight: 1.1,
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
        },
        contained: {
          backgroundColor: colors.offWhite,
          color: colors.green,
          position: "relative",
          isolation: "isolate",
          border: "none",
          boxShadow: "0 6px 20px rgba(63, 94, 90, 0.20)",
          transition: "box-shadow 0.45s ease, transform 0.45s ease",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            borderRadius: "inherit",
            padding: "1px",
            background: `linear-gradient(135deg, ${colors.green}, ${colors.champagne})`,
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            pointerEvents: "none",
          },
          "&::after": {
            content: '""',
            position: "absolute",
            inset: 0,
            borderRadius: "inherit",
            boxShadow:
              "0 10px 32px rgba(63, 94, 90, 0.50), 0 4px 16px rgba(216, 202, 170, 0.40)",
            opacity: 0,
            transition: "opacity 0.45s ease",
            animation: `${pulseGlow} 2s ease-in-out infinite`,
            pointerEvents: "none",
            zIndex: -1,
          },
          "&:hover": {
            backgroundColor: colors.offWhite,
            boxShadow: "0 8px 24px rgba(63, 94, 90, 0.24)",
            transform: "translateY(-1px)",
          },
          "&:hover::after": {
            opacity: 1,
          },
        },
        outlined: {
          boxShadow: "none",
          borderColor: colors.blueGrayDark,
          color: colors.mutedBlack,
          "&:hover": {
            boxShadow: "none",
            borderColor: colors.green,
            color: colors.green,
            backgroundColor: "transparent",
          },
        },
        text: {
          boxShadow: "none",
          color: colors.mutedBlack,
          "&:hover": {
            boxShadow: "none",
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
