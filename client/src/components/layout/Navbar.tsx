import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  useScrollTrigger,
  Slide,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Pets,
  Dashboard,
  Logout,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import type { RootState } from "../../app/store";
import type { AppDispatch } from "../../app/store";
import { logout } from "../../features/auth/authSlice";

const HideOnScroll = ({ children }: { children: React.ReactElement }) => {
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
};

const Navbar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleClose();
    navigate("/");
  };

  const getDashboardLink = () => {
    switch (user?.role) {
      case "Admin":
        return "/admin";
      case "Staff":
        return "/staff";
      case "Adopter":
        return "/adopter";
      default:
        return "/";
    }
  };

  return (
    <HideOnScroll>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(226, 232, 240, 0.6)",
        }}
      >
        <Toolbar sx={{ px: { xs: 2, md: 4 } }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box component={Link} to="/" sx={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 1 }}>
              <Pets sx={{ color: "primary.main", fontSize: 32 }} />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                PetAdopt
              </Typography>
            </Box>
          </motion.div>

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1, alignItems: "center" }}>
            <Button component={Link} to="/pets" sx={{ color: "text.primary" }}>
              Browse Pets
            </Button>
            
            {isAuthenticated ? (
              <>
                <Button
                  component={Link}
                  to={getDashboardLink()}
                  startIcon={<Dashboard />}
                  sx={{ color: "text.primary" }}
                >
                  Dashboard
                </Button>
                <IconButton onClick={handleMenu} sx={{ ml: 1 }}>
                  <Avatar sx={{ bgcolor: "primary.main" }}>
                    {user?.name?.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  PaperProps={{
                    sx: { mt: 1.5, minWidth: 200, borderRadius: 2 },
                  }}
                >
                  <MenuItem disabled>
                    <Typography variant="body2" color="text.secondary">
                      {user?.name} ({user?.role})
                    </Typography>
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <Logout sx={{ mr: 1, fontSize: 20 }} />
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button component={Link} to="/login" variant="outlined" sx={{ ml: 1 }}>
                  Login
                </Button>
                <Button component={Link} to="/register" variant="contained" sx={{ ml: 1 }}>
                  Register
                </Button>
              </>
            )}
          </Box>

          <IconButton
            sx={{ display: { md: "none" } }}
            onClick={(e) => setMobileMenuAnchor(e.currentTarget)}
          >
            <MenuIcon />
          </IconButton>

          <Menu
            anchorEl={mobileMenuAnchor}
            open={Boolean(mobileMenuAnchor)}
            onClose={() => setMobileMenuAnchor(null)}
            PaperProps={{ sx: { mt: 1.5, minWidth: 200 } }}
          >
            <MenuItem component={Link} to="/pets" onClick={() => setMobileMenuAnchor(null)}>
              Browse Pets
            </MenuItem>
            {isAuthenticated ? (
              <>
                <MenuItem component={Link} to={getDashboardLink()} onClick={() => setMobileMenuAnchor(null)}>
                  Dashboard
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </>
            ) : (
              <>
                <MenuItem component={Link} to="/login" onClick={() => setMobileMenuAnchor(null)}>
                  Login
                </MenuItem>
                <MenuItem component={Link} to="/register" onClick={() => setMobileMenuAnchor(null)}>
                  Register
                </MenuItem>
              </>
            )}
          </Menu>
        </Toolbar>
      </AppBar>
    </HideOnScroll>
  );
};

export default Navbar;
