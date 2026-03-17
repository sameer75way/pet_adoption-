import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  MenuItem,
  Switch,
  Paper,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import type { RootState } from "../../app/store";
import type { AppDispatch } from "../../app/store";
import { clearCurrentPet, fetchPetById } from "../../features/pets/petSlice";
import { submitApplication } from "../../features/applications/applicationSlice";

const AdoptionApplicationPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const { currentPet: pet, loading } = useSelector((state: RootState) => state.pets);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    housingType: "House",
    hasYard: true,
    householdAdults: "2",
    householdChildren: "0",
    hoursAlonePerDay: "4",
    otherPets: "",
    previousPets: "",
    reasonForAdoption: "",
  });

  useEffect(() => {
    if (id) {
      dispatch(fetchPetById(id));
    }

    return () => {
      dispatch(clearCurrentPet());
    };
  }, [dispatch, id]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (loading && !pet) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: "grid", placeItems: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!pet) {
    return <Navigate to="/pets" replace />;
  }

  if (user?.role !== "Adopter") {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Adopt {pet.name}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Share a few details about your home so the shelter team can review the match quickly.
        </Typography>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Paper sx={{ p: 3, borderRadius: 4 }}>
              {submitted && (
                <Alert severity="success" sx={{ mb: 3 }}>
                  Your application for {pet.name} has been submitted successfully.
                </Alert>
              )}
              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              <Box
                component="form"
                onSubmit={async (event) => {
                  event.preventDefault();
                  setError(null);

                  try {
                    await dispatch(
                      submitApplication({
                        petId: pet._id,
                        questionnaire: {
                          housingType: form.housingType,
                          hasYard: form.hasYard,
                          householdAdults: Number(form.householdAdults),
                          householdChildren: Number(form.householdChildren),
                          otherPets: form.otherPets,
                          previousPets: form.previousPets,
                          hoursAlonePerDay: Number(form.hoursAlonePerDay),
                          reasonForAdoption: form.reasonForAdoption,
                        },
                      })
                    ).unwrap();

                    setSubmitted(true);
                    setTimeout(() => navigate("/adopter/applications"), 1200);
                  } catch (submitError) {
                    setError(submitError as string);
                  }
                }}
              >
                <TextField
                  select
                  fullWidth
                  label="Housing Type"
                  value={form.housingType}
                  onChange={(event) => setForm({ ...form, housingType: event.target.value })}
                  sx={{ mb: 2 }}
                >
                  <MenuItem value="House">House</MenuItem>
                  <MenuItem value="Apartment">Apartment</MenuItem>
                  <MenuItem value="Townhome">Townhome</MenuItem>
                </TextField>
                <FormControlLabel
                  control={
                    <Switch
                      checked={form.hasYard}
                      onChange={(event) => setForm({ ...form, hasYard: event.target.checked })}
                    />
                  }
                  label="I have a yard or dedicated outdoor exercise space"
                  sx={{ mb: 2 }}
                />
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Adults in Household"
                      value={form.householdAdults}
                      onChange={(event) => setForm({ ...form, householdAdults: event.target.value })}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Children in Household"
                      value={form.householdChildren}
                      onChange={(event) => setForm({ ...form, householdChildren: event.target.value })}
                    />
                  </Grid>
                </Grid>
                <TextField
                  fullWidth
                  label="Hours Pet Will Be Alone Per Day"
                  value={form.hoursAlonePerDay}
                  onChange={(event) => setForm({ ...form, hoursAlonePerDay: event.target.value })}
                  sx={{ my: 2 }}
                />
                <TextField
                  fullWidth
                  label="Current Pets in the Home"
                  value={form.otherPets}
                  onChange={(event) => setForm({ ...form, otherPets: event.target.value })}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  multiline
                  minRows={3}
                  label="Previous Pet Experience"
                  value={form.previousPets}
                  onChange={(event) => setForm({ ...form, previousPets: event.target.value })}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  multiline
                  minRows={4}
                  label={`Why is ${pet.name} a good fit for your home?`}
                  value={form.reasonForAdoption}
                  onChange={(event) => setForm({ ...form, reasonForAdoption: event.target.value })}
                  sx={{ mb: 3 }}
                />
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <Button type="submit" variant="contained" size="large">
                    Submit Application
                  </Button>
                  <Button component={Link} to={`/pets/${pet._id}`} variant="outlined" size="large">
                    Back to Pet Profile
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <Card>
              <Box
                component="img"
                src={pet.photos[0]?.url}
                alt={pet.name}
                sx={{ width: "100%", height: 240, objectFit: "cover" }}
              />
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                  {pet.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {pet.species} • {pet.breed} • {pet.age.years}y {pet.age.months}m
                </Typography>
                <Typography variant="body2">{pet.description}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </motion.div>
    </Container>
  );
};

export default AdoptionApplicationPage;
