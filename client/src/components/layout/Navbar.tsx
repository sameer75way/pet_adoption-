import { useEffect, useState } from "react";
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
  Chip,
  Badge,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Pets,
  Dashboard,
  Logout,
  AutoAwesome,
  NotificationsNone,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import type { RootState } from "../../app/store";
import type { AppDispatch } from "../../app/store";
import { logout } from "../../features/auth/authSlice";
import api from "../../services/api";
import { getSocket } from "../../services/socket";

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
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const loadNotifications = async () => {
      if (!isAuthenticated) {
        setNotificationCount(0);
        return;
      }

      try {
        const response = await api.get("/notifications");
        const notifications = response.data.data as Array<{ isRead: boolean }>;
        setNotificationCount(notifications.filter((notification) => !notification.isRead).length);
      } catch {
        setNotificationCount(0);
      }
    };

    void loadNotifications();
  }, [isAuthenticated]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket || !isAuthenticated) return;

    const handleNotificationNew = () => {
      setNotificationCount((current) => current + 1);
    };

    const handleNotificationUpdated = (notification: { isRead: boolean }) => {
      if (notification.isRead) {
        setNotificationCount((current) => Math.max(0, current - 1));
      }
    };

    socket.on("notification:new", handleNotificationNew);
    socket.on("notification:updated", handleNotificationUpdated);

    return () => {
      socket.off("notification:new", handleNotificationNew);
      socket.off("notification:updated", handleNotificationUpdated);
    };
  }, [isAuthenticated]);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    void dispatch(logout());
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
          background: "rgba(255, 251, 245, 0.76)",
          backdropFilter: "blur(18px)",
          borderBottom: "1px solid rgba(195, 180, 161, 0.35)",
          boxShadow: "0 12px 30px rgba(27, 43, 52, 0.06)",
        }}
      >
        <Toolbar sx={{ px: { xs: 2, md: 4 }, minHeight: 82 }}>
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
                  background: "linear-gradient(135deg, #1f6f78 0%, #d97706 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                PetAdopt
              </Typography>
            </Box>
          </motion.div>

          <Box sx={{ flexGrow: 1 }} />
          <Chip
            icon={<AutoAwesome />}
            label="Shelter-ready platform"
            size="small"
            sx={{
              display: { xs: "none", lg: "inline-flex" },
              mr: 2,
              bgcolor: "rgba(31,111,120,0.08)",
              color: "text.primary",
              border: "1px solid rgba(31,111,120,0.18)",
            }}
          />

          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1, alignItems: "center" }}>
            <Button component={Link} to="/" sx={{ color: "text.primary" }}>
              Home
            </Button>
            <Button component={Link} to="/pets" sx={{ color: "text.primary" }}>
              Browse Pets
            </Button>
            <Button component={Link} to="/stories" sx={{ color: "text.primary" }}>
              Stories
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
                <IconButton component={Link} to="/notifications" sx={{ color: "text.primary" }}>
                  <Badge badgeContent={notificationCount} color="secondary">
                    <NotificationsNone />
                  </Badge>
                </IconButton>
                <IconButton onClick={handleMenu} sx={{ ml: 1 }}>
                  <Avatar sx={{ bgcolor: "secondary.main", color: "#fff" }}>
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
            <MenuItem component={Link} to="/" onClick={() => setMobileMenuAnchor(null)}>
              Home
            </MenuItem>
            <MenuItem component={Link} to="/pets" onClick={() => setMobileMenuAnchor(null)}>
              Browse Pets
            </MenuItem>
            <MenuItem component={Link} to="/stories" onClick={() => setMobileMenuAnchor(null)}>
              Stories
            </MenuItem>
            {isAuthenticated ? (
              <>
                <MenuItem component={Link} to={getDashboardLink()} onClick={() => setMobileMenuAnchor(null)}>
                  Dashboard
                </MenuItem>
                <MenuItem component={Link} to="/notifications" onClick={() => setMobileMenuAnchor(null)}>
                  Notifications
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
