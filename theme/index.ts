import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  colorSchemes: {
    dark: true,
    light: true,
  },
  defaultColorScheme: "light",
  cssVariables: {
    colorSchemeSelector: "data-mui-color-scheme",
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  palette: {
    primary: {
      50: "#f1f1ff",
      100: "#e1e1ff",
      200: "#c8c8ff",
      300: "#a8a8f5",
      400: "#7777e2",
      500: "#3737c4",
      600: "#2929a8",
      700: "#090979",
      800: "#070765",
      900: "#05054f",
    },
    secondary: {
      50: "#f1f1ff",
      100: "#e1e1ff",
      200: "#c8c8ff",
      300: "#a8a8f5",
      400: "#7777e2",
      500: "#3737c4",
      600: "#2929a8",
      700: "#090979",
      800: "#070765",
      900: "#05054f",
      A100: "#e1e1ff",
      A200: "#c8c8ff",
      A400: "#7777e2",
      A700: "#3737c4",
    },
    error: {
      50: "#fef2f2",
      100: "#fee2e2",
      200: "#fecaca",
      300: "#fca5a5",
      400: "#f87171",
      500: "#ef4444",
      600: "#dc2626",
      700: "#b91c1c",
      800: "#991b1b",
      900: "#7f1d1d",
    },
    warning: {
      50: "#f1f1ff",
      100: "#e1e1ff",
      200: "#c8c8ff",
      300: "#a8a8f5",
      400: "#7777e2",
      500: "#3737c4",
      600: "#2929a8",
      700: "#090979",
      800: "#070765",
      900: "#05054f",
    },
    success: {
      50: "#f1f1ff",
      100: "#e1e1ff",
      200: "#c8c8ff",
      300: "#a8a8f5",
      400: "#7777e2",
      500: "#3737c4",
      600: "#2929a8",
      700: "#090979",
      800: "#070765",
      900: "#05054f",
    },
    background: {
      default: "#f7f7fb",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: "sans-serif",
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: "-0.02em",
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: "-0.01em",
    },
    h3: {
      fontSize: "1.5rem",
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: "1.25rem",
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h5: {
      fontSize: "1.125rem",
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.5,
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
      letterSpacing: "0.01em",
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    "none",
    "0px 1px 2px rgba(0, 0, 0, 0.04), 0px 1px 3px rgba(0, 0, 0, 0.06)",
    "0px 1px 3px rgba(0, 0, 0, 0.04), 0px 2px 6px rgba(0, 0, 0, 0.08)",
    "0px 2px 6px rgba(0, 0, 0, 0.04), 0px 4px 12px rgba(0, 0, 0, 0.08)",
    "0px 4px 12px rgba(0, 0, 0, 0.04), 0px 6px 16px rgba(0, 0, 0, 0.1)",
    "0px 6px 16px rgba(0, 0, 0, 0.04), 0px 8px 24px rgba(0, 0, 0, 0.12)",
    "0px 8px 24px rgba(0, 0, 0, 0.04), 0px 12px 32px rgba(0, 0, 0, 0.14)",
    "0px 12px 32px rgba(0, 0, 0, 0.04), 0px 16px 48px rgba(0, 0, 0, 0.16)",
    "0px 16px 48px rgba(0, 0, 0, 0.04), 0px 20px 56px rgba(0, 0, 0, 0.18)",
    "0px 20px 56px rgba(0, 0, 0, 0.04), 0px 24px 64px rgba(0, 0, 0, 0.2)",
    "0px 24px 64px rgba(0, 0, 0, 0.04), 0px 28px 72px rgba(0, 0, 0, 0.22)",
    "0px 28px 72px rgba(0, 0, 0, 0.04), 0px 32px 80px rgba(0, 0, 0, 0.24)",
    "0px 32px 80px rgba(0, 0, 0, 0.04), 0px 36px 88px rgba(0, 0, 0, 0.26)",
    "0px 36px 88px rgba(0, 0, 0, 0.04), 0px 40px 96px rgba(0, 0, 0, 0.28)",
    "0px 40px 96px rgba(0, 0, 0, 0.04), 0px 44px 104px rgba(0, 0, 0, 0.3)",
    "0px 44px 104px rgba(0, 0, 0, 0.04), 0px 48px 112px rgba(0, 0, 0, 0.32)",
    "0px 48px 112px rgba(0, 0, 0, 0.04), 0px 52px 120px rgba(0, 0, 0, 0.34)",
    "0px 52px 120px rgba(0, 0, 0, 0.04), 0px 56px 128px rgba(0, 0, 0, 0.36)",
    "0px 56px 128px rgba(0, 0, 0, 0.04), 0px 60px 136px rgba(0, 0, 0, 0.38)",
    "0px 60px 136px rgba(0, 0, 0, 0.04), 0px 64px 144px rgba(0, 0, 0, 0.4)",
    "0px 64px 144px rgba(0, 0, 0, 0.04), 0px 68px 152px rgba(0, 0, 0, 0.42)",
    "0px 68px 152px rgba(0, 0, 0, 0.04), 0px 72px 160px rgba(0, 0, 0, 0.44)",
    "0px 72px 160px rgba(0, 0, 0, 0.04), 0px 76px 168px rgba(0, 0, 0, 0.46)",
    "0px 76px 168px rgba(0, 0, 0, 0.04), 0px 80px 176px rgba(0, 0, 0, 0.48)",
    "0px 80px 176px rgba(0, 0, 0, 0.04), 0px 84px 184px rgba(0, 0, 0, 0.5)",
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: "10px 20px",
          minHeight: 44,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow:
            "0px 1px 3px rgba(0, 0, 0, 0.04), 0px 2px 6px rgba(0, 0, 0, 0.08)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 12,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRadius: "0 16px 16px 0",
        },
      },
    },
  },
});
