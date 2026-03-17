import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Alert,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import {
  Favorite,
  Share,
  CalendarToday,
  Pets,
  Scale,
  ColorLens,
  Edit,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import type { AppDispatch, RootState } from "../../app/store";
import { clearCurrentPet, fetchPetById } from "../../features/pets/petSlice";
import api from "../../services/api";
import { getSocket } from "../../services/socket";

const PetDetail = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const { currentPet, loading, error } = useSelector((state: RootState) => state.pets);
  const [medicalSummary, setMedicalSummary] = useState<{ vaccinated: boolean } | null>(null);
  const [actionMessage, setActionMessage] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const pet = currentPet;

  useEffect(() => {
    if (id) {
      dispatch(fetchPetById(id));
      api.get(`/medical/${id}/summary`).then((response) => {
        setMedicalSummary(response.data.data);
      }).catch(() => {
        setMedicalSummary(null);
      });

      if (isAuthenticated) {
        api.get("/favorites").then((response) => {
          const favorites = response.data.data as Array<{ pet: { _id: string } }>;
          setIsFavorited(favorites.some((favorite) => favorite.pet?._id === id));
        }).catch(() => {
          setIsFavorited(false);
        });
      }
    }
    return () => {
      dispatch(clearCurrentPet());
    };
  }, [dispatch, id, isAuthenticated]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket || !id) return;

    const handlePetUpdated = (payload: { pet?: { _id?: string }; petId?: string }) => {
      const updatedPetId = payload.pet?._id || payload.petId;
      if (updatedPetId === id) {
        dispatch(fetchPetById(id));
      }
    };

    const handleFavoriteUpdated = (payload: { petId: string; favorited: boolean }) => {
      if (payload.petId === id) {
        setIsFavorited(payload.favorited);
      }
    };

    socket.on("pet:updated", handlePetUpdated);
    socket.on("favorite:updated", handleFavoriteUpdated);

    return () => {
      socket.off("pet:updated", handlePetUpdated);
      socket.off("favorite:updated", handleFavoriteUpdated);
    };
  }, [dispatch, id]);

  if (!pet && loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: "grid", placeItems: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!pet) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Alert severity="error">{error || "Pet not found."}</Alert>
      </Container>
    );
  }

  const petDetails = [
    { label: "Breed", value: pet.breed, icon: <Pets /> },
    { label: "Age", value: `${pet.age.years} years ${pet.age.months} months`, icon: <CalendarToday /> },
    { label: "Size", value: pet.size, icon: <Scale /> },
    { label: "Color", value: pet.color || "Unknown", icon: <ColorLens /> },
    { label: "Gender", value: pet.gender, icon: <Pets /> },
    { label: "Weight", value: pet.weight ? `${pet.weight} kg` : "Unknown", icon: <Scale /> },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {loading && pet && (
          <Box sx={{ display: "grid", placeItems: "center", mb: 3 }}>
            <CircularProgress />
          </Box>
        )}
        {actionMessage && <Alert severity={actionMessage.type} sx={{ mb: 3 }}>{actionMessage.text}</Alert>}
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              component="img"
              src={pet.photos[0]?.url || "https://via.placeholder.com/600x500"}
              alt={pet.name}
              sx={{
                width: "100%",
                height: 400,
                objectFit: "cover",
                borderRadius: 4,
                boxShadow: "0 20px 50px rgba(0,0,0,0.1)",
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <Typography variant="h3" sx={{ fontWeight: 700 }}>
                  {pet.name}
                </Typography>
                <Chip
                  label={pet.status.replace("_", " ")}
                  color="success"
                  sx={{ textTransform: "capitalize" }}
                />
              </Box>
              <Typography variant="h6" color="text.secondary">
                {pet.species} • {pet.breed}
              </Typography>
            </Box>

            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
              {pet.description}
            </Typography>

            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Details
                </Typography>
                <Grid container spacing={2}>
                  {petDetails.map((detail) => (
                    <Grid size={{ xs: 6 }} key={detail.label}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box sx={{ color: "primary.main" }}>{detail.icon}</Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            {detail.label}
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, textTransform: "capitalize" }}>
                            {detail.value}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
                {medicalSummary && (
                  <Chip
                    label={medicalSummary.vaccinated ? "Vaccinations on file" : "Vaccination records pending"}
                    color={medicalSummary.vaccinated ? "success" : "warning"}
                    sx={{ mt: 2 }}
                  />
                )}
              </CardContent>
            </Card>

            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Temperament
                </Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {pet.temperament.map((trait) => (
                    <Chip key={trait} label={trait} color="primary" variant="outlined" />
                  ))}
                </Box>
              </CardContent>
            </Card>

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                component={Link}
                to={isAuthenticated && user?.role === "Adopter" ? `/pets/${pet._id}/apply` : "/login"}
                variant="contained"
                size="large"
                fullWidth
              >
                Adopt {pet.name}
              </Button>
              <Tooltip title={isFavorited ? "Remove from favorites" : "Save to favorites"}>
                <Button
                  variant={isFavorited ? "contained" : "outlined"}
                  color={isFavorited ? "error" : "primary"}
                  size="large"
                  onClick={async () => {
                    setActionMessage(null);

                    if (!isAuthenticated) {
                      navigate("/login");
                      return;
                    }

                    try {
                      const response = await api.post(`/favorites/${pet._id}`);
                      const favorited = response.data.data?.favorited as boolean;
                      setIsFavorited(favorited);
                      setActionMessage({
                        type: "success",
                        text: favorited
                          ? `${pet.name} was added to your favorites.`
                          : `${pet.name} was removed from your favorites.`,
                      });
                    } catch (favoriteError) {
                      const err = favoriteError as { response?: { data?: { message?: string } } };
                      setActionMessage({
                        type: "error",
                        text: err.response?.data?.message || "Unable to update favorites right now.",
                      });
                    }
                  }}
                >
                  <Favorite />
                </Button>
              </Tooltip>
              <Button
                variant="outlined"
                size="large"
                onClick={async () => {
                  setActionMessage(null);
                  const shareUrl = window.location.href;

                  try {
                    if (navigator.share) {
                      await navigator.share({
                        title: `Meet ${pet.name} on PetAdopt`,
                        text: `Check out ${pet.name}, a ${pet.breed} looking for a home.`,
                        url: shareUrl,
                      });
                      setActionMessage({
                        type: "success",
                        text: `Shared ${pet.name}'s profile successfully.`,
                      });
                      return;
                    }

                    await navigator.clipboard.writeText(shareUrl);
                    setActionMessage({
                      type: "success",
                      text: `${pet.name}'s profile link was copied to your clipboard.`,
                    });
                  } catch {
                    setActionMessage({
                      type: "error",
                      text: "Sharing is not available in this browser right now.",
                    });
                  }
                }}
              >
                <Share />
              </Button>
            </Box>
            {(user?.role === "Admin" || user?.role === "Staff") && (
              <Box sx={{ mt: 2 }}>
                <Button
                  component={Link}
                  to={user.role === "Admin" ? `/admin/pets/${pet._id}/edit` : `/staff/pets/${pet._id}/edit`}
                  variant="outlined"
                  startIcon={<Edit />}
                >
                  Edit Pet
                </Button>
              </Box>
            )}
          </Grid>
        </Grid>
      </motion.div>
    </Container>
  );
};

export default PetDetail;
