import { useSelector } from "react-redux";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
} from "@mui/material";
import {
  Pets,
  Assignment,
  MedicalServices,
  Add,
  ArrowForward,
  Healing,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import type { RootState } from "../../app/store";

const StaffDashboard = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const stats = [
    { title: "Under Your Care", value: "23", icon: <Pets />, color: "#6366f1" },
    { title: "Pending Applications", value: "8", icon: <Assignment />, color: "#ec4899" },
    { title: "Medical Updates", value: "5", icon: <MedicalServices />, color: "#22c55e" },
  ];

  const quickActions = [
    { title: "Add New Pet", icon: <Add />, link: "/staff/pets/new", color: "primary" },
    { title: "Review Applications", icon: <Assignment />, link: "/staff/applications", color: "secondary" },
    { title: "Medical Records", icon: <Healing />, link: "/staff/medical", color: "info" },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Staff Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome back, {user?.name}! Manage pets and process applications.
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat, index) => (
            <Grid size={{ xs: 12, md: 4 }} key={stat.title}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card sx={{ height: "100%" }}>
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Avatar sx={{ bgcolor: stat.color, mr: 2 }}>
                        {stat.icon}
                      </Avatar>
                      <Typography variant="h4" sx={{ fontWeight: 700 }}>
                        {stat.value}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
          Quick Actions
        </Typography>
        <Grid container spacing={3}>
          {quickActions.map((action, index) => (
            <Grid size={{ xs: 12, sm: 4 }} key={action.title}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
              >
                <Button
                  component={Link}
                  to={action.link}
                  variant="contained"
                  color={action.color as "primary" | "secondary" | "info"}
                  fullWidth
                  size="large"
                  startIcon={action.icon}
                  endIcon={<ArrowForward />}
                  sx={{ height: 80, justifyContent: "space-between" }}
                >
                  {action.title}
                </Button>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            Recent Activity
          </Typography>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                No recent activity to display.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </motion.div>
    </Container>
  );
};

export default StaffDashboard;
