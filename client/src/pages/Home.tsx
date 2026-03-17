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
  Stack,
} from "@mui/material";
import { Favorite, ArrowForward, Pets, VolunteerActivism, Home as HomeIcon, Diversity3, HealthAndSafety, CheckCircle } from "@mui/icons-material";
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
  const availablePets = pets.filter((pet) => pet.status === "available").length;
  const adoptedPets = pets.filter((pet) => pet.status === "adopted").length;
  const spotlightPets = pets.slice(0, 3);
  const trustSignals = [
    { icon: <HealthAndSafety />, label: "Medical screening" },
    { icon: <Diversity3 />, label: "Match-focused adoption" },
    { icon: <CheckCircle />, label: "Staff-reviewed applications" },
  ];

  return (
    <Box>
      <Box
        sx={{
          background: "linear-gradient(135deg, #19474f 0%, #1f6f78 45%, #d97706 100%)",
          color: "white",
          py: { xs: 7, md: 10 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 10% 20%, rgba(255,255,255,0.16), transparent 20%), radial-gradient(circle at 80% 15%, rgba(255,255,255,0.14), transparent 18%), linear-gradient(transparent, rgba(0,0,0,0.08))",
          }}
        />
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <Chip
                  label="Trusted by shelters, staff, and adopters"
                  sx={{
                    mb: 2,
                    bgcolor: "rgba(255,255,255,0.18)",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}
                />
                <Typography variant="h2" sx={{ fontWeight: 700, mb: 2 }}>
                  Find Your Perfect
                  <Box component="span" sx={{ color: "#ffd700" }}> Companion</Box>
                </Typography>
                <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                  Browse hundreds of loving pets waiting for their forever homes. 
                  Start your adoption journey today!
                </Typography>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25} sx={{ mb: 4 }}>
                  {trustSignals.map((signal) => (
                    <Chip
                      key={signal.label}
                      icon={signal.icon}
                      label={signal.label}
                      sx={{
                        bgcolor: "rgba(255,255,255,0.12)",
                        color: "#fff",
                        justifyContent: "flex-start",
                        "& .MuiChip-icon": { color: "#ffe7b0" },
                      }}
                    />
                  ))}
                </Stack>
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <Button
                    component={Link}
                    to="/pets"
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForward />}
                    sx={{ bgcolor: "black", border: "1px solid #fff", color: "white", "&:hover": { bgcolor: "red.100" } }}
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
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 7 }}>
                    <Box
                      component="img"
                      src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=900"
                      alt="Happy pets"
                      sx={{ width: "100%", height: { xs: 260, sm: 420 }, objectFit: "cover", borderRadius: 6, boxShadow: "0 24px 70px rgba(0,0,0,0.28)" }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 5 }}>
                    <Stack spacing={2}>
                      <Card sx={{ bgcolor: "rgba(255,255,255,0.14)", color: "#000000", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.18)" }}>
                        <CardContent>
                          <Typography variant="overline" sx={{ opacity: 0.8 }}>
                            Available Pets
                          </Typography>
                          <Typography variant="h3">{availablePets}</Typography>
                        </CardContent>
                      </Card>
                      <Card sx={{ bgcolor: "rgba(255,255,255,0.14)", color: "#000000", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.18)" }}>
                        <CardContent>
                          <Typography variant="overline" sx={{ opacity: 0.8 }}>
                            Adopted Through Platform
                          </Typography>
                          <Typography variant="h3">{adoptedPets}</Typography>
                        </CardContent>
                      </Card>
                    </Stack>
                  </Grid>
                </Grid>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        {spotlightPets.length > 0 && (
          <Box sx={{ mb: 7 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              This Week's Spotlights
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              A quick look at a few standout pets ready for a conversation with the shelter team.
            </Typography>
            <Grid container spacing={3}>
              {spotlightPets.map((pet, index) => (
                <Grid size={{ xs: 12, md: 4 }} key={pet._id}>
                  <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: index * 0.08 }} viewport={{ once: true }}>
                    <Card sx={{ overflow: "hidden" }}>
                      <CardMedia component="img" height="220" image={pet.photos[0]?.url || "https://via.placeholder.com/400x300"} alt={pet.name} />
                      <CardContent>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 700 }}>{pet.name}</Typography>
                          <Chip label={pet.status.replace("_", " ")} color={pet.status === "available" ? "success" : "warning"} size="small" />
                        </Stack>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {pet.breed} • {pet.shelter.name}
                        </Typography>
                        <Button component={Link} to={`/pets/${pet._id}`} variant="outlined" fullWidth>
                          Meet {pet.name}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
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

      <Box sx={{ py: 8 }}>
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
