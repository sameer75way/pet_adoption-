import { Outlet, useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { gradients } from "../../theme";
import ChatbotWidget from "../chat/ChatbotWidget";

const Layout = () => {
  const location = useLocation();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(23,92,99,0.12), transparent 26%), radial-gradient(circle at 88% 12%, rgba(201,110,22,0.12), transparent 20%), linear-gradient(180deg, #fbf7ef 0%, #f1e8da 100%)",
        overflowX: "clip",
      }}
    >
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(circle at 16% 16%, rgba(23,92,99,0.12), transparent 18%), radial-gradient(circle at 84% 10%, rgba(201,110,22,0.1), transparent 16%), radial-gradient(circle at 72% 68%, rgba(23,92,99,0.08), transparent 22%)",
        }}
      />
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          opacity: 0.4,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)",
          backgroundSize: "34px 34px",
          maskImage: "linear-gradient(180deg, rgba(0,0,0,0.4), transparent 88%)",
        }}
      />
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1, position: "relative", zIndex: 1 }}>
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background: gradients.shell,
            opacity: 0.55,
          }}
        />
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            style={{ position: "relative", zIndex: 1 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </Box>
      <ChatbotWidget />
      <Footer />
    </Box>
  );
};

export default Layout;
