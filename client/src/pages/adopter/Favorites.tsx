import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Alert,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import api from "../../services/api";
import type { Pet } from "../../features/pets/petSlice";

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState<Pet[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const response = await api.get("/favorites");
        setFavorites(response.data.data.map((favorite: { pet: Pet }) => favorite.pet));
      } catch (loadError) {
        const err = loadError as { response?: { data?: { message?: string } } };
        setError(err.response?.data?.message || "Failed to load favorites");
      }
    };

    loadFavorites();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Favorite Pets
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Keep an eye on the pets you may want to adopt or revisit later.
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Grid container spacing={3}>
          {favorites.map((pet) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={pet._id}>
              <Card sx={{ height: "100%" }}>
                <CardMedia component="img" height="220" image={pet.photos[0]?.url} alt={pet.name} />
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {pet.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {pet.breed} • {pet.age.years} years
                  </Typography>
                  <Button component={Link} to={`/pets/${pet._id}`} fullWidth variant="contained">
                    View Pet
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </motion.div>
    </Container>
  );
};

export default FavoritesPage;
