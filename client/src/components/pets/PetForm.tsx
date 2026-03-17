import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Grid,
  MenuItem,
  Paper,
  Switch,
  TextField,
  Typography,
  FormControlLabel,
} from "@mui/material";
import type { Pet } from "../../features/pets/petSlice";

type PetFormValues = {
  name: string;
  species: string;
  breed: string;
  mixedBreed: boolean;
  years: string;
  months: string;
  size: string;
  gender: string;
  color: string;
  weight: string;
  temperament: string;
  description: string;
  photoUrl: string;
  status: string;
  intakeType: string;
  intakeNotes: string;
  shelterName: string;
  shelterAddress: string;
  lng: string;
  lat: string;
  isNeutered: boolean;
  isMicrochipped: boolean;
};

const buildInitialValues = (pet?: Partial<Pet>): PetFormValues => ({
  name: pet?.name || "",
  species: pet?.species || "dog",
  breed: pet?.breed || "",
  mixedBreed: pet?.mixedBreed || false,
  years: String(pet?.age?.years ?? 1),
  months: String(pet?.age?.months ?? 0),
  size: pet?.size || "medium",
  gender: pet?.gender || "unknown",
  color: pet?.color || "",
  weight: pet?.weight ? String(pet.weight) : "",
  temperament: pet?.temperament?.join(", ") || "",
  description: pet?.description || "",
  photoUrl: pet?.photos?.[0]?.url || "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=1200",
  status: pet?.status || "intake",
  intakeType: pet?.intakeType || "rescued",
  intakeNotes: pet?.intakeNotes || "",
  shelterName: pet?.shelter?.name || "Main Street Shelter",
  shelterAddress: pet?.shelter?.address || "123 Main St",
  lng: String(pet?.shelter?.location?.coordinates?.[0] ?? -74.006),
  lat: String(pet?.shelter?.location?.coordinates?.[1] ?? 40.7128),
  isNeutered: pet?.isNeutered || false,
  isMicrochipped: pet?.isMicrochipped || false,
});

interface PetFormProps {
  title: string;
  subtitle: string;
  submitLabel: string;
  initialPet?: Partial<Pet>;
  onSubmit: (data: Partial<Pet>) => Promise<void>;
}

const PetForm = ({ title, subtitle, submitLabel, initialPet, onSubmit }: PetFormProps) => {
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<PetFormValues>(buildInitialValues(initialPet));

  useEffect(() => {
    setForm(buildInitialValues(initialPet));
  }, [initialPet]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    try {
      await onSubmit({
        name: form.name,
        species: form.species as Pet["species"],
        breed: form.breed,
        mixedBreed: form.mixedBreed,
        age: {
          years: Number(form.years),
          months: Number(form.months),
        },
        size: form.size as Pet["size"],
        gender: form.gender as Pet["gender"],
        color: form.color || undefined,
        weight: form.weight ? Number(form.weight) : undefined,
        temperament: form.temperament
          .split(",")
          .map((value) => value.trim())
          .filter(Boolean),
        description: form.description,
        photos: form.photoUrl
          ? [{ url: form.photoUrl, publicId: `manual-${Date.now()}`, isPrimary: true }]
          : [],
        status: form.status as Pet["status"],
        intakeType: form.intakeType as Pet["intakeType"],
        intakeNotes: form.intakeNotes || undefined,
        shelter: {
          name: form.shelterName,
          address: form.shelterAddress,
          location: {
            type: "Point",
            coordinates: [Number(form.lng), Number(form.lat)] as [number, number],
          },
        },
        isNeutered: form.isNeutered,
        isMicrochipped: form.isMicrochipped,
      });
    } catch (submitError) {
      setError(submitError as string);
    }
  };

  return (
    <>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        {title}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        {subtitle}
      </Typography>

      <Paper sx={{ p: 4, borderRadius: 4 }}>
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField fullWidth label="Pet Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField select fullWidth label="Species" value={form.species} onChange={(e) => setForm({ ...form, species: e.target.value })}>
                <MenuItem value="dog">Dog</MenuItem>
                <MenuItem value="cat">Cat</MenuItem>
                <MenuItem value="rabbit">Rabbit</MenuItem>
                <MenuItem value="bird">Bird</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField select fullWidth label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <MenuItem value="intake">Intake</MenuItem>
                <MenuItem value="medical_hold">Medical Hold</MenuItem>
                <MenuItem value="available">Available</MenuItem>
                <MenuItem value="adoption_pending">Adoption Pending</MenuItem>
                <MenuItem value="adopted">Adopted</MenuItem>
                <MenuItem value="foster_placed">Foster Placed</MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField fullWidth label="Breed" value={form.breed} onChange={(e) => setForm({ ...form, breed: e.target.value })} />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField select fullWidth label="Size" value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })}>
                <MenuItem value="small">Small</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="large">Large</MenuItem>
                <MenuItem value="extra_large">Extra Large</MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField select fullWidth label="Gender" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="unknown">Unknown</MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField fullWidth type="number" label="Age Years" value={form.years} onChange={(e) => setForm({ ...form, years: e.target.value })} />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField fullWidth type="number" label="Age Months" value={form.months} onChange={(e) => setForm({ ...form, months: e.target.value })} />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField fullWidth label="Color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField fullWidth type="number" label="Weight (kg)" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Temperament"
                helperText="Separate traits with commas"
                value={form.temperament}
                onChange={(e) => setForm({ ...form, temperament: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                minRows={4}
                label="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField fullWidth label="Primary Photo URL" value={form.photoUrl} onChange={(e) => setForm({ ...form, photoUrl: e.target.value })} />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField select fullWidth label="Intake Type" value={form.intakeType} onChange={(e) => setForm({ ...form, intakeType: e.target.value })}>
                <MenuItem value="stray">Stray</MenuItem>
                <MenuItem value="surrendered">Surrendered</MenuItem>
                <MenuItem value="rescued">Rescued</MenuItem>
                <MenuItem value="transferred">Transferred</MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <FormControlLabel
                control={<Switch checked={form.mixedBreed} onChange={(e) => setForm({ ...form, mixedBreed: e.target.checked })} />}
                label="Mixed Breed"
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                minRows={2}
                label="Intake Notes"
                value={form.intakeNotes}
                onChange={(e) => setForm({ ...form, intakeNotes: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField fullWidth label="Shelter Name" value={form.shelterName} onChange={(e) => setForm({ ...form, shelterName: e.target.value })} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField fullWidth label="Shelter Address" value={form.shelterAddress} onChange={(e) => setForm({ ...form, shelterAddress: e.target.value })} />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField fullWidth label="Longitude" value={form.lng} onChange={(e) => setForm({ ...form, lng: e.target.value })} />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField fullWidth label="Latitude" value={form.lat} onChange={(e) => setForm({ ...form, lat: e.target.value })} />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <FormControlLabel
                control={<Switch checked={form.isNeutered} onChange={(e) => setForm({ ...form, isNeutered: e.target.checked })} />}
                label="Neutered"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <FormControlLabel
                control={<Switch checked={form.isMicrochipped} onChange={(e) => setForm({ ...form, isMicrochipped: e.target.checked })} />}
                label="Microchipped"
              />
            </Grid>
          </Grid>

          <Box sx={{ display: "flex", gap: 2, mt: 4, flexWrap: "wrap" }}>
            <Button type="submit" variant="contained" size="large">
              {submitLabel}
            </Button>
          </Box>
        </Box>
      </Paper>
    </>
  );
};

export default PetForm;
