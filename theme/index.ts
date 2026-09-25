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
      50: "#eef2ff",
      100: "#e0e7ff",
      200: "#c7d2fe",
      300: "#a5b4fc",
      400: "#818cf8",
      500: "#6366f1",
      600: "#4f46e5",
      700: "#4338ca",
      800: "#3730a3",
      900: "#312e81",
    },
    secondary: {
      50: "#f5f3ff",
      100: "#ede9fe",
      200: "#ddd6fe",
      300: "#c4b5fd",
      400: "#a78bfa",
      500: "#8b5cf6",
      600: "#7c3aed",
      700: "#6d28d9",
      800: "#5b21b6",
      900: "#4c1d95",
      A100: "#ede9fe",
      A200: "#c4b5fd",
      A400: "#a78bfa",
      A700: "#7c3aed",
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
      50: "#fffbeb",
      100: "#fef3c7",
      200: "#fde68a",
      300: "#fcd34d",
      400: "#fbbf24",
      500: "#f59e0b",
      600: "#d97706",
      700: "#b45309",
      800: "#92400e",
      900: "#78350f",
    },
    success: {
      50: "#ecfdf5",
      100: "#d1fae5",
      200: "#a7f3d0",
      300: "#6ee7b7",
      400: "#34d399",
      500: "#10b981",
      600: "#059669",
      700: "#047857",
      800: "#065f46",
      900: "#064e3b",
    },
    background: {
      default: "#ffffff",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
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
