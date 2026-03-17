import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Provider } from "react-redux";
import { SnackbarProvider } from "notistack";
import { BrowserRouter } from "react-router-dom";
import { useEffect, useState } from "react";
import { store } from "./app/store";
import { theme } from "./theme";
import AppRoutes from "./routes";
import { fetchCurrentUser } from "./features/auth/authSlice";
import SplashLoader from "./components/ui/SplashLoader";

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isSplashExiting, setIsSplashExiting] = useState(false);
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      store.dispatch(fetchCurrentUser());
    }

    const exitTimer = window.setTimeout(() => {
      setIsSplashExiting(true);
    }, 1900);

    const hideTimer = window.setTimeout(() => {
      setShowSplash(false);
      setIsAppReady(true);
    }, 2550);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          autoHideDuration={3000}
        >
          <BrowserRouter>
            {showSplash && <SplashLoader isExiting={isSplashExiting} />}
            {isAppReady && <AppRoutes />}
          </BrowserRouter>
        </SnackbarProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
