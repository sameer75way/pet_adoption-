import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControlLabel,
  Grid,
  InputAdornment,
  MenuItem,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import {
  CalendarToday,
  FmdGood,
  Notes,
  Pets,
  PhotoCamera,
  Psychology,
  Scale,
  Vaccines,
} from "@mui/icons-material";
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

type FieldErrors = Partial<Record<keyof PetFormValues, string>>;

const quickTraits = [
  "Friendly",
  "Gentle",
  "Playful",
  "Calm",
  "Affectionate",
  "Curious",
  "Good with kids",
  "Good with dogs",
  "Good with cats",
  "House-trained",
];

const speciesOptions = [
  { value: "dog", label: "Dog" },
  { value: "cat", label: "Cat" },
  { value: "rabbit", label: "Rabbit" },
  { value: "bird", label: "Bird" },
  { value: "other", label: "Other" },
];

const statusOptions = [
  { value: "intake", label: "Intake" },
  { value: "medical_hold", label: "Medical Hold" },
  { value: "available", label: "Available" },
  { value: "adoption_pending", label: "Adoption Pending" },
  { value: "adopted", label: "Adopted" },
  { value: "foster_placed", label: "Foster Placed" },
];

const sizeOptions = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
  { value: "extra_large", label: "Extra Large" },
];

const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "unknown", label: "Unknown" },
];

const intakeOptions = [
  { value: "stray", label: "Stray" },
  { value: "surrendered", label: "Surrendered" },
  { value: "rescued", label: "Rescued" },
  { value: "transferred", label: "Transferred" },
];

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
  photoUrl:
    pet?.photos?.find((photo) => photo.isPrimary)?.url ||
    pet?.photos?.[0]?.url ||
    "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=1200",
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

const formatStatusLabel = (value: string) => value.replace(/_/g, " ");

const validateForm = (form: PetFormValues): FieldErrors => {
  const errors: FieldErrors = {};

  if (!form.name.trim()) errors.name = "Pet name is required.";
  if (!form.breed.trim()) errors.breed = "Breed is required.";
  if (!form.description.trim()) errors.description = "Description is required.";
  if (!form.shelterName.trim()) errors.shelterName = "Shelter name is required.";
  if (!form.shelterAddress.trim()) errors.shelterAddress = "Shelter address is required.";

  const years = Number(form.years);
  const months = Number(form.months);
  const weight = form.weight ? Number(form.weight) : null;
  const lng = Number(form.lng);
  const lat = Number(form.lat);

  if (!Number.isFinite(years) || years < 0) {
    errors.years = "Years must be 0 or greater.";
  }

  if (!Number.isFinite(months) || months < 0 || months > 11) {
    errors.months = "Months must be between 0 and 11.";
  }

  if (weight !== null && (!Number.isFinite(weight) || weight <= 0)) {
    errors.weight = "Weight must be a positive number.";
  }

  if (!Number.isFinite(lng) || lng < -180 || lng > 180) {
    errors.lng = "Longitude must be between -180 and 180.";
  }

  if (!Number.isFinite(lat) || lat < -90 || lat > 90) {
    errors.lat = "Latitude must be between -90 and 90.";
  }

  if (form.photoUrl && !/^https?:\/\//i.test(form.photoUrl.trim())) {
    errors.photoUrl = "Photo URL should start with http:// or https://";
  }

  return errors;
};

const PetFormSection = ({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) => (
  <Card sx={{ height: "100%" }}>
    <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
      <Typography
        variant="overline"
        sx={{ color: "secondary.main", letterSpacing: "0.12em", fontWeight: 700 }}
      >
        {eyebrow}
      </Typography>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.75 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
        {description}
      </Typography>
      {children}
    </CardContent>
  </Card>
);

interface PetFormProps {
  title: string;
  subtitle: string;
  submitLabel: string;
  initialPet?: Partial<Pet>;
  onSubmit: (data: Partial<Pet>) => Promise<void>;
}

const PetForm = ({ title, subtitle, submitLabel, initialPet, onSubmit }: PetFormProps) => {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [form, setForm] = useState<PetFormValues>(buildInitialValues(initialPet));

  useEffect(() => {
    setForm(buildInitialValues(initialPet));
  }, [initialPet]);

  const fieldErrors = useMemo(() => validateForm(form), [form]);
  const traits = useMemo(
    () =>
      form.temperament
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean),
    [form.temperament]
  );

  const completionItems = [
    Boolean(form.name.trim()),
    Boolean(form.breed.trim()),
    Boolean(form.description.trim()),
    Boolean(form.shelterName.trim()),
    Boolean(form.shelterAddress.trim()),
    Object.keys(fieldErrors).length === 0,
  ];

  const completionPercent = Math.round(
    (completionItems.filter(Boolean).length / completionItems.length) * 100
  );

  const updateField = <K extends keyof PetFormValues>(key: K, value: PetFormValues[K]) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const toggleTrait = (trait: string) => {
    const currentTraits = traits.map((value) => value.toLowerCase());

    if (currentTraits.includes(trait.toLowerCase())) {
      updateField(
        "temperament",
        traits.filter((value) => value.toLowerCase() !== trait.toLowerCase()).join(", ")
      );
      return;
    }

    updateField("temperament", [...traits, trait].join(", "));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setShowValidation(true);

    if (Object.keys(fieldErrors).length > 0) {
      setError("Please fix the highlighted fields before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        name: form.name.trim(),
        species: form.species as Pet["species"],
        breed: form.breed.trim(),
        mixedBreed: form.mixedBreed,
        age: {
          years: Number(form.years),
          months: Number(form.months),
        },
        size: form.size as Pet["size"],
        gender: form.gender as Pet["gender"],
        color: form.color.trim() || undefined,
        weight: form.weight ? Number(form.weight) : undefined,
        temperament: traits,
        description: form.description.trim(),
        photos: form.photoUrl.trim()
          ? [{ url: form.photoUrl.trim(), publicId: `manual-${Date.now()}`, isPrimary: true }]
          : [],
        status: form.status as Pet["status"],
        intakeType: form.intakeType as Pet["intakeType"],
        intakeNotes: form.intakeNotes.trim() || undefined,
        shelter: {
          name: form.shelterName.trim(),
          address: form.shelterAddress.trim(),
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Paper
        sx={{
          p: { xs: 2.5, md: 4 },
          mb: 3,
          overflow: "hidden",
          position: "relative",
          background:
            "linear-gradient(135deg, rgba(25,71,79,0.98) 0%, rgba(31,111,120,0.96) 50%, rgba(217,119,6,0.94) 100%)",
          color: "#fff",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at top right, rgba(255,255,255,0.18), transparent 30%), radial-gradient(circle at bottom left, rgba(255,255,255,0.12), transparent 28%)",
          }}
        />
        <Grid container spacing={3} sx={{ position: "relative" }}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Typography variant="overline" sx={{ letterSpacing: "0.14em", opacity: 0.85 }}>
              Pet Profile Studio
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
              {title}
            </Typography>
            <Typography variant="body1" sx={{ maxWidth: 680, opacity: 0.9 }}>
              {subtitle}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <Box
              sx={{
                p: 2.25,
                borderRadius: 4,
                bgcolor: "rgba(255,255,255,0.12)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.18)",
              }}
            >
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 1.5 }}>
                <Chip
                  label={`${completionPercent}% ready`}
                  sx={{ bgcolor: "rgba(255,255,255,0.16)", color: "#fff" }}
                />
                <Chip
                  label={formatStatusLabel(form.status)}
                  sx={{ bgcolor: "rgba(255,255,255,0.16)", color: "#fff", textTransform: "capitalize" }}
                />
                <Chip
                  label={speciesOptions.find((option) => option.value === form.species)?.label || "Pet"}
                  sx={{ bgcolor: "rgba(255,255,255,0.16)", color: "#fff" }}
                />
              </Stack>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Fill the essentials first, then layer in temperament, intake context, and shelter details for a profile that is easy for staff and adopters to trust.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <Stack spacing={3}>
              <PetFormSection
                eyebrow="Identity"
                title="Core Profile"
                description="Capture the details someone notices first when they land on the pet page."
              >
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="Pet Name"
                      value={form.name}
                      onChange={(event) => updateField("name", event.target.value)}
                      error={showValidation && Boolean(fieldErrors.name)}
                      helperText={showValidation ? fieldErrors.name : " "}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <TextField
                      select
                      fullWidth
                      label="Species"
                      value={form.species}
                      onChange={(event) => updateField("species", event.target.value)}
                    >
                      {speciesOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <TextField
                      select
                      fullWidth
                      label="Status"
                      value={form.status}
                      onChange={(event) => updateField("status", event.target.value)}
                    >
                      {statusOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="Breed"
                      value={form.breed}
                      onChange={(event) => updateField("breed", event.target.value)}
                      error={showValidation && Boolean(fieldErrors.breed)}
                      helperText={showValidation ? fieldErrors.breed : " "}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <TextField
                      select
                      fullWidth
                      label="Size"
                      value={form.size}
                      onChange={(event) => updateField("size", event.target.value)}
                    >
                      {sizeOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <TextField
                      select
                      fullWidth
                      label="Gender"
                      value={form.gender}
                      onChange={(event) => updateField("gender", event.target.value)}
                    >
                      {genderOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Age Years"
                      value={form.years}
                      onChange={(event) => updateField("years", event.target.value)}
                      error={showValidation && Boolean(fieldErrors.years)}
                      helperText={showValidation ? fieldErrors.years : " "}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CalendarToday fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Age Months"
                      value={form.months}
                      onChange={(event) => updateField("months", event.target.value)}
                      error={showValidation && Boolean(fieldErrors.months)}
                      helperText={showValidation ? fieldErrors.months : " "}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <TextField
                      fullWidth
                      label="Color"
                      value={form.color}
                      onChange={(event) => updateField("color", event.target.value)}
                      helperText=" "
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Weight"
                      value={form.weight}
                      onChange={(event) => updateField("weight", event.target.value)}
                      error={showValidation && Boolean(fieldErrors.weight)}
                      helperText={showValidation ? fieldErrors.weight : "Optional"}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                        startAdornment: (
                          <InputAdornment position="start">
                            <Scale fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={form.mixedBreed}
                          onChange={(event) => updateField("mixedBreed", event.target.checked)}
                        />
                      }
                      label="Mixed Breed"
                    />
                  </Grid>
                </Grid>
              </PetFormSection>

              <PetFormSection
                eyebrow="Story"
                title="Personality And Adoption Notes"
                description="Make the profile feel real with a concise description and clear temperament traits."
              >
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Quick temperament tags
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
                      {quickTraits.map((trait) => {
                        const active = traits.some(
                          (value) => value.toLowerCase() === trait.toLowerCase()
                        );

                        return (
                          <Chip
                            key={trait}
                            label={trait}
                            clickable
                            color={active ? "primary" : "default"}
                            variant={active ? "filled" : "outlined"}
                            onClick={() => toggleTrait(trait)}
                          />
                        );
                      })}
                    </Stack>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Temperament"
                      helperText="Separate custom traits with commas."
                      value={form.temperament}
                      onChange={(event) => updateField("temperament", event.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Psychology fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      multiline
                      minRows={5}
                      label="Description"
                      placeholder="Write a warm, specific summary of the pet's behavior, routines, energy level, and what kind of home would fit best."
                      value={form.description}
                      onChange={(event) => updateField("description", event.target.value)}
                      error={showValidation && Boolean(fieldErrors.description)}
                      helperText={
                        showValidation
                          ? fieldErrors.description
                          : "A better description gives adopters more confidence."
                      }
                    />
                  </Grid>
                </Grid>
              </PetFormSection>

              <PetFormSection
                eyebrow="Operations"
                title="Intake And Shelter Details"
                description="Keep the operational context tidy so staff can move the pet through review, medical, and placement."
              >
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      select
                      fullWidth
                      label="Intake Type"
                      value={form.intakeType}
                      onChange={(event) => updateField("intakeType", event.target.value)}
                    >
                      {intakeOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="Primary Photo URL"
                      value={form.photoUrl}
                      onChange={(event) => updateField("photoUrl", event.target.value)}
                      error={showValidation && Boolean(fieldErrors.photoUrl)}
                      helperText={
                        showValidation
                          ? fieldErrors.photoUrl
                          : "Use a direct image URL for the cover photo."
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhotoCamera fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      multiline
                      minRows={3}
                      label="Intake Notes"
                      value={form.intakeNotes}
                      onChange={(event) => updateField("intakeNotes", event.target.value)}
                      placeholder="Add rescue context, medical alerts, behavior notes, or transfer details."
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Notes fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="Shelter Name"
                      value={form.shelterName}
                      onChange={(event) => updateField("shelterName", event.target.value)}
                      error={showValidation && Boolean(fieldErrors.shelterName)}
                      helperText={showValidation ? fieldErrors.shelterName : " "}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="Shelter Address"
                      value={form.shelterAddress}
                      onChange={(event) => updateField("shelterAddress", event.target.value)}
                      error={showValidation && Boolean(fieldErrors.shelterAddress)}
                      helperText={showValidation ? fieldErrors.shelterAddress : " "}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <TextField
                      fullWidth
                      label="Longitude"
                      value={form.lng}
                      onChange={(event) => updateField("lng", event.target.value)}
                      error={showValidation && Boolean(fieldErrors.lng)}
                      helperText={showValidation ? fieldErrors.lng : " "}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <TextField
                      fullWidth
                      label="Latitude"
                      value={form.lat}
                      onChange={(event) => updateField("lat", event.target.value)}
                      error={showValidation && Boolean(fieldErrors.lat)}
                      helperText={showValidation ? fieldErrors.lat : " "}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={form.isNeutered}
                          onChange={(event) => updateField("isNeutered", event.target.checked)}
                        />
                      }
                      label="Neutered"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={form.isMicrochipped}
                          onChange={(event) => updateField("isMicrochipped", event.target.checked)}
                        />
                      }
                      label="Microchipped"
                    />
                  </Grid>
                </Grid>
              </PetFormSection>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, lg: 4 }}>
            <Stack spacing={3} sx={{ position: { lg: "sticky" }, top: { lg: 98 } }}>
              <Card sx={{ overflow: "hidden" }}>
                <Box
                  component="img"
                  src={form.photoUrl || "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=1200"}
                  alt={form.name || "Pet preview"}
                  sx={{ width: "100%", height: 260, objectFit: "cover" }}
                />
                <CardContent>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 1.5 }}>
                    <Chip
                      label={formatStatusLabel(form.status)}
                      color="primary"
                      sx={{ textTransform: "capitalize" }}
                    />
                    <Chip
                      label={sizeOptions.find((option) => option.value === form.size)?.label || form.size}
                      variant="outlined"
                    />
                  </Stack>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {form.name.trim() || "Unnamed pet"}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    {speciesOptions.find((option) => option.value === form.species)?.label} •{" "}
                    {form.breed.trim() || "Breed TBD"}
                  </Typography>
                  <Stack spacing={1.25}>
                    <Box sx={{ display: "flex", gap: 1.25, alignItems: "center" }}>
                      <CalendarToday fontSize="small" color="action" />
                      <Typography variant="body2">
                        {form.years || "0"}y {form.months || "0"}m
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", gap: 1.25, alignItems: "center" }}>
                      <Pets fontSize="small" color="action" />
                      <Typography variant="body2" sx={{ textTransform: "capitalize" }}>
                        {form.gender}
                        {form.mixedBreed ? " • mixed breed" : ""}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", gap: 1.25, alignItems: "center" }}>
                      <FmdGood fontSize="small" color="action" />
                      <Typography variant="body2">
                        {form.shelterName || "Shelter name"}{" "}
                        {form.shelterAddress ? `• ${form.shelterAddress}` : ""}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", gap: 1.25, alignItems: "center" }}>
                      <Vaccines fontSize="small" color="action" />
                      <Typography variant="body2">
                        {form.isNeutered ? "Neutered" : "Neuter pending"} •{" "}
                        {form.isMicrochipped ? "Microchipped" : "Microchip pending"}
                      </Typography>
                    </Box>
                  </Stack>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Description preview
                  </Typography>
                  <Typography variant="body2" sx={{ lineHeight: 1.7 }}>
                    {form.description.trim() ||
                      "The profile summary will appear here as you write it, helping you see how it will read on the pet page."}
                  </Typography>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
                    Readiness Checklist
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
                    <Chip
                      label={form.name.trim() ? "Name added" : "Name missing"}
                      color={form.name.trim() ? "success" : "default"}
                      variant={form.name.trim() ? "filled" : "outlined"}
                    />
                    <Chip
                      label={form.description.trim() ? "Description added" : "Description missing"}
                      color={form.description.trim() ? "success" : "default"}
                      variant={form.description.trim() ? "filled" : "outlined"}
                    />
                    <Chip
                      label={traits.length > 0 ? `${traits.length} traits` : "No traits yet"}
                      color={traits.length > 0 ? "success" : "default"}
                      variant={traits.length > 0 ? "filled" : "outlined"}
                    />
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    Strong profiles are easier for staff to review and easier for adopters to connect with quickly.
                  </Typography>
                </CardContent>
              </Card>

              <Paper sx={{ p: 2.5 }}>
                <Stack direction={{ xs: "column", sm: "row", lg: "column" }} spacing={1.5}>
                  <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : submitLabel}
                  </Button>
                  <Typography variant="caption" color="text.secondary">
                    Required: name, breed, description, shelter info, and valid coordinates.
                  </Typography>
                </Stack>
              </Paper>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default PetForm;
