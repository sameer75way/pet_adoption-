import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Provider } from "react-redux";
import { SnackbarProvider } from "notistack";
import { BrowserRouter } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { store } from "./app/store";
import { theme } from "./theme";
import AppRoutes from "./routes";
import { fetchCurrentUser, refreshToken } from "./features/auth/authSlice";
import SplashLoader from "./components/ui/SplashLoader";
import type { RootState } from "./app/store";
import { connectSocket, disconnectSocket } from "./services/socket";

const RealtimeBridge = () => {
  const { isAuthenticated, accessToken } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      disconnectSocket();
      return;
    }

    const socket = connectSocket(accessToken);

    return () => {
      socket.disconnect();
      disconnectSocket();
    };
  }, [accessToken, isAuthenticated]);

  return null;
};

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isSplashExiting, setIsSplashExiting] = useState(false);
  const [isAppReady, setIsAppReady] = useState(false);
  const hasBootstrappedAuth = useRef(false);

  useEffect(() => {
    if (!hasBootstrappedAuth.current) {
      hasBootstrappedAuth.current = true;

      if (localStorage.getItem("accessToken")) {
        void store
          .dispatch(refreshToken())
          .unwrap()
          .then(() => store.dispatch(fetchCurrentUser()).unwrap())
          .catch(() => undefined);
      }
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
            <RealtimeBridge />
            {showSplash && <SplashLoader isExiting={isSplashExiting} />}
            {isAppReady && <AppRoutes />}
          </BrowserRouter>
        </SnackbarProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
