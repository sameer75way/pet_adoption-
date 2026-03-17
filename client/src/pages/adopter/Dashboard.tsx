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
  Favorite,
  Assignment,
  Pets,
  ArrowForward,
  Chat,
  VolunteerActivism,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import type { RootState } from "../../app/store";

const AdopterDashboard = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const stats = [
    { title: "Saved Pets", value: "5", icon: <Favorite />, color: "#ec4899" },
    { title: "Applications", value: "2", icon: <Assignment />, color: "#6366f1" },
    { title: "Foster Status", value: "Active", icon: <Pets />, color: "#22c55e" },
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
            My Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome back, {user?.name}! Find your perfect companion today.
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

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Browse Pets
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Discover your perfect companion from our available pets.
                </Typography>
                <Button
                  component={Link}
                  to="/pets"
                  variant="contained"
                  endIcon={<ArrowForward />}
                >
                  Browse Now
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  My Applications
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Track the status of your adoption applications.
                </Typography>
                <Button
                  component={Link}
                  to="/adopter/applications"
                  variant="outlined"
                  endIcon={<ArrowForward />}
                >
                  View Applications
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Favorites
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Revisit the pets you have saved while deciding on your next step.
                </Typography>
                <Button component={Link} to="/adopter/favorites" variant="outlined" endIcon={<Favorite />}>
                  View Favorites
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Foster & Messages
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Register for foster care or message the shelter team about a pet.
                </Typography>
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <Button component={Link} to="/adopter/foster" variant="contained" endIcon={<VolunteerActivism />}>
                    Foster Care
                  </Button>
                  <Button component={Link} to="/messages" variant="outlined" endIcon={<Chat />}>
                    Messages
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            Recommended for You
          </Typography>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Browse our available pets to see personalized recommendations based on your preferences.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </motion.div>
    </Container>
  );
};

export default AdopterDashboard;
