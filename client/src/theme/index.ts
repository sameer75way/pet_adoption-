import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#175c63",
      light: "#3d8b93",
      dark: "#103f44",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#c96e16",
      light: "#e49a4d",
      dark: "#8f4e0c",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f2ede4",
      paper: "#fffaf3",
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
      primary: "#18262d",
      secondary: "#5f6a6f",
    },
  },
  typography: {
    fontFamily: '"Avenir Next", "Trebuchet MS", "Segoe UI", "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: "3.3rem",
      lineHeight: 1.02,
      letterSpacing: "-0.05em",
    },
    h2: {
      fontWeight: 700,
      fontSize: "2.6rem",
      lineHeight: 1.05,
      letterSpacing: "-0.05em",
    },
    h3: {
      fontWeight: 700,
      fontSize: "1.85rem",
      lineHeight: 1.1,
    },
    h4: {
      fontWeight: 700,
      fontSize: "1.45rem",
      lineHeight: 1.14,
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.18rem",
    },
    h6: {
      fontWeight: 600,
      fontSize: "1.02rem",
    },
    body1: {
      lineHeight: 1.7,
    },
    body2: {
      lineHeight: 1.65,
    },
    button: {
      fontWeight: 600,
      textTransform: "none",
      letterSpacing: "0.01em",
    },
  },
  shape: {
    borderRadius: 22,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ":root": {
          colorScheme: "light",
        },
        body: {
          background:
            "radial-gradient(circle at top left, rgba(23,92,99,0.14), transparent 26%), radial-gradient(circle at top right, rgba(201,110,22,0.12), transparent 24%), linear-gradient(180deg, #f7f1e8 0%, #efe6d8 100%)",
          color: "#18262d",
        },
        a: {
          color: "inherit",
        },
        "::selection": {
          backgroundColor: "rgba(23,92,99,0.18)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          backgroundImage: "none",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          padding: "10px 24px",
          boxShadow: "none",
          fontSize: "0.96rem",
          "&:hover": {
            boxShadow: "0 16px 32px rgba(16, 63, 68, 0.16)",
            transform: "translateY(-1px)",
          },
        },
        containedPrimary: {
          background: "linear-gradient(135deg, #175c63 0%, #12484d 100%)",
        },
        containedSecondary: {
          background: "linear-gradient(135deg, #c96e16 0%, #aa5a11 100%)",
        },
        outlined: {
          borderWidth: 1.5,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 28,
          boxShadow: "0 22px 54px rgba(41, 50, 53, 0.08)",
          border: "1px solid rgba(194, 182, 166, 0.32)",
          backgroundImage:
            "linear-gradient(180deg, rgba(255,255,255,0.94) 0%, rgba(255,250,243,0.98) 100%)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 28,
          backgroundImage:
            "linear-gradient(180deg, rgba(255,255,255,0.94) 0%, rgba(255,250,243,0.98) 100%)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontWeight: 600,
          letterSpacing: "0.01em",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 30,
          boxShadow: "0 30px 80px rgba(28, 35, 38, 0.18)",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 700,
          color: "#415056",
          borderBottom: "1px solid rgba(188, 175, 156, 0.45)",
        },
        root: {
          borderBottom: "1px solid rgba(188, 175, 156, 0.24)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 18,
            backgroundColor: "rgba(255,255,255,0.78)",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
            "&:hover": {
              boxShadow: "0 10px 24px rgba(24, 38, 45, 0.06)",
            },
          },
          "& .MuiInputLabel-root": {
            fontWeight: 500,
          },
        },
      },
    },
  },
});

export const gradients = {
  primary: "linear-gradient(135deg, #175c63 0%, #2e858d 100%)",
  secondary: "linear-gradient(135deg, #c96e16 0%, #e29a4f 100%)",
  success: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
  info: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
  warning: "linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)",
  hero: "linear-gradient(135deg, #123d43 0%, #175c63 40%, #c96e16 100%)",
  shell: "linear-gradient(180deg, rgba(255,252,247,0.98) 0%, rgba(244,236,223,0.94) 100%)",
};
