import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  CalendarToday,
  ColorLens,
  Edit,
  Favorite,
  LocationOn,
  Pets,
  Scale,
  Share,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import type { AppDispatch, RootState } from "../../app/store";
import { clearCurrentPet, fetchPetById } from "../../features/pets/petSlice";
import type { Pet } from "../../features/pets/petSlice";
import api from "../../services/api";
import { getSocket } from "../../services/socket";

type MedicalSummary = {
  vaccinated?: boolean;
};

const statusColorMap: Record<
  Pet["status"],
  "default" | "primary" | "success" | "warning" | "info"
> = {
  intake: "default",
  medical_hold: "warning",
  available: "success",
  adoption_pending: "info",
  adopted: "primary",
  foster_placed: "info",
};

const formatStatus = (status: Pet["status"]) => status.replace(/_/g, " ");

const PetDetail = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const { currentPet, loading, error } = useSelector((state: RootState) => state.pets);
  const [medicalSummary, setMedicalSummary] = useState<MedicalSummary | null>(null);
  const [actionMessage, setActionMessage] = useState<
    { type: "success" | "error" | "info"; text: string } | null
  >(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [relatedPets, setRelatedPets] = useState<Pet[]>([]);
  const [extrasLoading, setExtrasLoading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(0);
  const pet = currentPet;

  useEffect(() => {
    if (!id) {
      return;
    }

    let active = true;
    setActionMessage(null);
    dispatch(fetchPetById(id));
    setExtrasLoading(true);

    const medicalRequest = api
      .get(`/medical/${id}/summary`)
      .then((response) => {
        if (active) {
          setMedicalSummary(response.data.data ?? null);
        }
      })
      .catch(() => {
        if (active) {
          setMedicalSummary(null);
        }
      });

    const favoritesRequest = isAuthenticated
      ? api
          .get("/favorites")
          .then((response) => {
            if (!active) {
              return;
            }

            const favorites = response.data.data as Array<{ pet: { _id: string } | null }>;
            setIsFavorited(favorites.some((favorite) => favorite.pet?._id === id));
          })
          .catch(() => {
            if (active) {
              setIsFavorited(false);
            }
          })
      : Promise.resolve().then(() => {
          if (active) {
            setIsFavorited(false);
          }
        });

    void Promise.allSettled([medicalRequest, favoritesRequest]).finally(() => {
      if (active) {
        setExtrasLoading(false);
      }
    });

    return () => {
      active = false;
      dispatch(clearCurrentPet());
    };
  }, [dispatch, id, isAuthenticated]);

  useEffect(() => {
    setSelectedPhoto(0);
  }, [pet?._id]);

  useEffect(() => {
    if (!pet?._id) {
      setRelatedPets([]);
      return;
    }

    let active = true;

    api
      .get("/pets", {
        params: {
          species: pet.species,
          status: "available",
          limit: 4,
        },
      })
      .then((response) => {
        if (!active) {
          return;
        }

        const candidates = (response.data.data as Pet[]).filter(
          (candidate) => candidate._id !== pet._id
        );
        setRelatedPets(candidates.slice(0, 3));
      })
      .catch(() => {
        if (active) {
          setRelatedPets([]);
        }
      });

    return () => {
      active = false;
    };
  }, [pet?._id, pet?.species]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket || !id) {
      return;
    }

    const handlePetUpdated = (payload: {
      type?: string;
      pet?: { _id?: string; status?: Pet["status"] };
      petId?: string;
    }) => {
      const updatedPetId = payload.pet?._id || payload.petId;

      if (updatedPetId !== id) {
        return;
      }

      if (payload.type === "deleted") {
        setActionMessage({
          type: "info",
          text: "This pet profile was removed while you were viewing it.",
        });
        navigate("/pets", { replace: true });
        return;
      }

      dispatch(fetchPetById(id));
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
  }, [dispatch, id, navigate]);

  const galleryPhotos = (() => {
    if (!pet?.photos?.length) {
      return [];
    }

    const primaryIndex = pet.photos.findIndex((photo) => photo.isPrimary);

    if (primaryIndex <= 0) {
      return pet.photos;
    }

    return [pet.photos[primaryIndex], ...pet.photos.filter((_, index) => index !== primaryIndex)];
  })();

  const selectedPhotoUrl = galleryPhotos[selectedPhoto]?.url || "https://via.placeholder.com/800x600";
  const temperament = pet?.temperament?.filter(Boolean) ?? [];
  const canApply = pet?.status === "available";

  const petDetails = pet
    ? [
        { label: "Breed", value: pet.breed, icon: <Pets /> },
        {
          label: "Age",
          value: `${pet.age.years} years ${pet.age.months} months`,
          icon: <CalendarToday />,
        },
        { label: "Size", value: pet.size.replace("_", " "), icon: <Scale /> },
        { label: "Color", value: pet.color || "Unknown", icon: <ColorLens /> },
        { label: "Gender", value: pet.gender, icon: <Pets /> },
        { label: "Weight", value: pet.weight ? `${pet.weight} kg` : "Unknown", icon: <Scale /> },
      ]
    : [];

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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {(loading || extrasLoading) && (
          <Box sx={{ display: "grid", placeItems: "center", mb: 3 }}>
            <CircularProgress />
          </Box>
        )}
        {actionMessage && (
          <Alert severity={actionMessage.type} sx={{ mb: 3 }}>
            {actionMessage.text}
          </Alert>
        )}

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              component="img"
              src={selectedPhotoUrl}
              alt={pet.name}
              sx={{
                width: "100%",
                height: { xs: 280, md: 420 },
                objectFit: "cover",
                borderRadius: 4,
                boxShadow: "0 20px 50px rgba(0,0,0,0.1)",
              }}
            />
            {galleryPhotos.length > 1 && (
              <Stack direction="row" spacing={1.25} sx={{ mt: 2, overflowX: "auto", pb: 1 }}>
                {galleryPhotos.map((photo, index) => (
                  <Box
                    key={photo.publicId}
                    component="button"
                    type="button"
                    onClick={() => setSelectedPhoto(index)}
                    sx={{
                      p: 0,
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      borderRadius: 2,
                      overflow: "hidden",
                      boxShadow:
                        index === selectedPhoto
                          ? "0 0 0 3px rgba(25, 118, 210, 0.35)"
                          : "0 6px 18px rgba(0,0,0,0.08)",
                    }}
                  >
                    <Box
                      component="img"
                      src={photo.url}
                      alt={`${pet.name} ${index + 1}`}
                      sx={{
                        width: 88,
                        height: 88,
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  </Box>
                ))}
              </Stack>
            )}
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ mb: 3 }}>
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap sx={{ mb: 1 }}>
                <Typography variant="h3" sx={{ fontWeight: 700 }}>
                  {pet.name}
                </Typography>
                <Chip
                  label={formatStatus(pet.status)}
                  color={statusColorMap[pet.status]}
                  sx={{ textTransform: "capitalize" }}
                />
              </Stack>
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
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, textTransform: "capitalize" }}
                          >
                            {detail.value}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
                {medicalSummary && (
                  <Chip
                    label={
                      medicalSummary.vaccinated
                        ? "Vaccinations on file"
                        : "Vaccination records pending"
                    }
                    color={medicalSummary.vaccinated ? "success" : "warning"}
                    sx={{ mt: 2 }}
                  />
                )}
              </CardContent>
            </Card>

            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Shelter Info
                </Typography>
                <Stack spacing={1}>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {pet.shelter.name}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
                    <LocationOn color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {pet.shelter.address}
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    <Chip label={pet.isNeutered ? "Neutered" : "Not neutered"} variant="outlined" />
                    <Chip
                      label={pet.isMicrochipped ? "Microchipped" : "Microchip pending"}
                      variant="outlined"
                    />
                    <Chip label={`Intake: ${pet.intakeType}`} variant="outlined" sx={{ textTransform: "capitalize" }} />
                  </Stack>
                </Stack>
              </CardContent>
            </Card>

            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Temperament
                </Typography>
                {temperament.length > 0 ? (
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {temperament.map((trait) => (
                      <Chip key={trait} label={trait} color="primary" variant="outlined" />
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Staff has not added temperament notes for {pet.name} yet.
                  </Typography>
                )}
              </CardContent>
            </Card>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Button
                component={Link}
                to={isAuthenticated && user?.role === "Adopter" ? `/pets/${pet._id}/apply` : "/login"}
                variant="contained"
                size="large"
                fullWidth
                disabled={isAuthenticated && user?.role === "Adopter" && !canApply}
              >
                {canApply ? `Adopt ${pet.name}` : `${pet.name} is not accepting applications`}
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
            </Stack>

            {!canApply && (
              <Alert severity="info" sx={{ mt: 2 }}>
                Applications are only open while a pet is marked available.
              </Alert>
            )}

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

        {relatedPets.length > 0 && (
          <Box sx={{ mt: 6 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              More Pets You Might Like
            </Typography>
            <Grid container spacing={3}>
              {relatedPets.map((relatedPet) => (
                <Grid key={relatedPet._id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Card sx={{ height: "100%" }}>
                    <CardActionArea component={Link} to={`/pets/${relatedPet._id}`}>
                      <CardMedia
                        component="img"
                        height="220"
                        image={relatedPet.photos?.find((photo) => photo.isPrimary)?.url || relatedPet.photos?.[0]?.url || "https://via.placeholder.com/500x350"}
                        alt={relatedPet.name}
                      />
                      <CardContent>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            {relatedPet.name}
                          </Typography>
                          <Chip
                            label={formatStatus(relatedPet.status)}
                            color={statusColorMap[relatedPet.status]}
                            size="small"
                          />
                        </Stack>
                        <Typography variant="body2" color="text.secondary">
                          {relatedPet.breed} • {relatedPet.age.years}y {relatedPet.age.months}m
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </motion.div>
    </Container>
  );
};

export default PetDetail;
