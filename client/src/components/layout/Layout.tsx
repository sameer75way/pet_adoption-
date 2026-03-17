import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(31,111,120,0.08), transparent 28%), linear-gradient(180deg, #faf6ef 0%, #f4ede2 100%)",
      }}
    >
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1, position: "relative" }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;
