import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1f6f78",
      light: "#5aa6af",
      dark: "#124f56",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#d97706",
      light: "#f3a73d",
      dark: "#a85b00",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f4efe7",
      paper: "#fffdf9",
    },
    error: {
      main: "#ef4444",
    },
    warning: {
      main: "#f59e0b",
    },
    success: {
      main: "#22c55e",
    },
    info: {
      main: "#3b82f6",
    },
    text: {
      primary: "#1b2b34",
      secondary: "#5f6c72",
    },
  },
  typography: {
    fontFamily: '"Avenir Next", "Segoe UI", "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: "3rem",
      letterSpacing: "-0.04em",
    },
    h2: {
      fontWeight: 700,
      fontSize: "2.35rem",
      letterSpacing: "-0.04em",
    },
    h3: {
      fontWeight: 600,
      fontSize: "1.7rem",
    },
    h4: {
      fontWeight: 600,
      fontSize: "1.35rem",
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.125rem",
    },
    h6: {
      fontWeight: 600,
      fontSize: "1rem",
    },
    button: {
      fontWeight: 600,
      textTransform: "none",
    },
  },
  shape: {
    borderRadius: 18,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background:
            "radial-gradient(circle at top left, rgba(31,111,120,0.12), transparent 28%), radial-gradient(circle at top right, rgba(217,119,6,0.12), transparent 24%), linear-gradient(180deg, #f8f4ee 0%, #f3ede2 100%)",
        },
        "::selection": {
          backgroundColor: "rgba(31,111,120,0.18)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          padding: "10px 22px",
          boxShadow: "none",
          letterSpacing: "0.01em",
          "&:hover": {
            boxShadow: "0 10px 20px rgba(18, 79, 86, 0.18)",
          },
        },
        containedPrimary: {
          background: "linear-gradient(135deg, #1f6f78 0%, #165c64 100%)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          boxShadow: "0 18px 45px rgba(45, 57, 61, 0.08)",
          border: "1px solid rgba(194, 182, 166, 0.35)",
          backgroundImage:
            "linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(255,251,246,0.98) 100%)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 24,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontWeight: 500,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 16,
            backgroundColor: "rgba(255,255,255,0.72)",
          },
        },
      },
    },
  },
});

export const gradients = {
  primary: "linear-gradient(135deg, #1f6f78 0%, #2f8c95 100%)",
  secondary: "linear-gradient(135deg, #d97706 0%, #f0a43a 100%)",
  success: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
  info: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
  warning: "linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)",
  hero: "linear-gradient(135deg, #19474f 0%, #1f6f78 45%, #d97706 100%)",
};
