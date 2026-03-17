import { Outlet, useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = () => {
  const location = useLocation();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(31,111,120,0.08), transparent 28%), linear-gradient(180deg, #faf6ef 0%, #f4ede2 100%)",
        overflowX: "clip",
      }}
    >
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(circle at 20% 20%, rgba(31,111,120,0.08), transparent 18%), radial-gradient(circle at 82% 12%, rgba(217,119,6,0.08), transparent 16%), radial-gradient(circle at 72% 68%, rgba(31,111,120,0.06), transparent 22%)",
        }}
      />
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1, position: "relative" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;
