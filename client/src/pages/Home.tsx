import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
} from "@mui/material";
import { Favorite, ArrowForward, Pets, VolunteerActivism, Home as HomeIcon } from "@mui/icons-material";
import { motion } from "framer-motion";
import type { AppDispatch, RootState } from "../app/store";
import { fetchPets } from "../features/pets/petSlice";

import { useEffect } from "react";

const Home = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { pets } = useSelector((state: RootState) => state.pets);

  useEffect(() => {
    dispatch(fetchPets({ limit: 6 }));
  }, [dispatch]);

  const features = [
    { icon: <Pets sx={{ fontSize: 40 }} />, title: "Browse Pets", description: "Find your perfect companion from hundreds of available pets" },
    { icon: <Favorite sx={{ fontSize: 40 }} />, title: "Save Favorites", description: "Keep track of pets you're interested in" },
    { icon: <VolunteerActivism sx={{ fontSize: 40 }} />, title: "Easy Adoption", description: "Streamlined application process" },
    { icon: <HomeIcon sx={{ fontSize: 40 }} />, title: "Happy Endings", description: "Join thousands of successful adoptions" },
  ];

  return (
    <Box>
      <Box
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          py: 8,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <Typography variant="h2" sx={{ fontWeight: 700, mb: 2 }}>
                  Find Your Perfect
                  <Box component="span" sx={{ color: "#ffd700" }}> Companion</Box>
                </Typography>
                <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                  Browse hundreds of loving pets waiting for their forever homes. 
                  Start your adoption journey today!
                </Typography>
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <Button
                    component={Link}
                    to="/pets"
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForward />}
                    sx={{ bgcolor: "white", color: "primary.main", "&:hover": { bgcolor: "grey.100" } }}
                  >
                    Browse Pets
                  </Button>
                  <Button
                    component={Link}
                    to="/register"
                    variant="outlined"
                    size="large"
                    sx={{ borderColor: "white", color: "white" }}
                  >
                    Get Started
                  </Button>
                </Box>
              </motion.div>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }}>
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800"
                  alt="Happy pets"
                  sx={{ width: "100%", borderRadius: 4, boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}
                />
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" align="center" sx={{ fontWeight: 700, mb: 6 }}>
          Featured Pets
        </Typography>
        <Grid container spacing={3}>
          {pets.map((pet, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={pet._id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={pet.photos[0]?.url || "https://via.placeholder.com/400x300"}
                    alt={pet.name}
                    sx={{ objectFit: "cover" }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>{pet.name}</Typography>
                      <Chip label={pet.species} size="small" color="primary" variant="outlined" />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {pet.breed} • {pet.age.years}y {pet.age.months}m
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {pet.description}
                    </Typography>
                    <Button component={Link} to={`/pets/${pet._id}`} variant="outlined" fullWidth size="small">
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
        {pets.length === 0 && (
          <Typography align="center" color="text.secondary">
            No pets are available yet. Add pets from the staff or admin dashboard to populate this section.
          </Typography>
        )}
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Button component={Link} to="/pets" variant="contained" endIcon={<ArrowForward />}>
            View All Pets
          </Button>
        </Box>
      </Container>

      <Box sx={{ bgcolor: "grey.50", py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" align="center" sx={{ fontWeight: 700, mb: 6 }}>
            How It Works
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={feature.title}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card sx={{ textAlign: "center", p: 3, height: "100%" }}>
                    <Box sx={{ color: "primary.main", mb: 2 }}>{feature.icon}</Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>{feature.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{feature.description}</Typography>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
