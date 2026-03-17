import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Button,
  Pagination,
  Collapse,
  Stack,
  Divider,
  InputAdornment,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import { Search, FilterList, Edit, Add } from "@mui/icons-material";
import { motion } from "framer-motion";
import type { AppDispatch, RootState } from "../../app/store";
import { fetchPets } from "../../features/pets/petSlice";

const PetsList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { pets, totalPages, currentPage } = useSelector((state: RootState) => state.pets);
  const { user } = useSelector((state: RootState) => state.auth);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [breedFilter, setBreedFilter] = useState("");
  const [sizeFilter, setSizeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [ageMin, setAgeMin] = useState("");
  const [ageMax, setAgeMax] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [radius, setRadius] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [page, setPage] = useState(1);
  const speciesFilter = searchParams.get("species") || "";

  useEffect(() => {
    dispatch(
      fetchPets({
        page,
        limit: 12,
        species: speciesFilter || undefined,
        breed: breedFilter || undefined,
        size: sizeFilter || undefined,
        status: statusFilter || undefined,
        search: searchTerm || undefined,
        ageMin: ageMin ? Number(ageMin) : undefined,
        ageMax: ageMax ? Number(ageMax) : undefined,
        lat: lat ? Number(lat) : undefined,
        lng: lng ? Number(lng) : undefined,
        radius: radius ? Number(radius) : undefined,
      })
    );
  }, [dispatch, page, speciesFilter, breedFilter, sizeFilter, statusFilter, searchTerm, ageMin, ageMax, lat, lng, radius]);

  const handleSpeciesChange = (event: SelectChangeEvent) => {
    const value = event.target.value;
    setPage(1);

    if (value) {
      setSearchParams((currentParams) => {
        const nextParams = new URLSearchParams(currentParams);
        nextParams.set("species", value);
        return nextParams;
      });
      return;
    }

    setSearchParams((currentParams) => {
      const nextParams = new URLSearchParams(currentParams);
      nextParams.delete("species");
      return nextParams;
    });
  };

  const filteredPets = pets.filter((pet) => {
    const matchesSearch = pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pet.breed.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecies = speciesFilter === "" || pet.species === speciesFilter;
    const matchesBreed = breedFilter === "" || pet.breed.toLowerCase().includes(breedFilter.toLowerCase());
    const matchesSize = sizeFilter === "" || pet.size === sizeFilter;
    const matchesStatus = statusFilter === "" || pet.status === statusFilter;
    const matchesAgeMin = ageMin === "" || pet.age.years >= Number(ageMin);
    const matchesAgeMax = ageMax === "" || pet.age.years <= Number(ageMax);
    return matchesSearch && matchesSpecies && matchesBreed && matchesSize && matchesStatus && matchesAgeMin && matchesAgeMax;
  });
  const sortedPets = [...filteredPets].sort((a, b) => {
    switch (sortBy) {
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "name_asc":
        return a.name.localeCompare(b.name);
      case "age_young":
        return a.age.years - b.age.years || a.age.months - b.age.months;
      case "age_old":
        return b.age.years - a.age.years || b.age.months - a.age.months;
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const canManagePets = user?.role === "Admin" || user?.role === "Staff";
  const availableCount = pets.filter((pet) => pet.status === "available").length;

  const resetFilters = () => {
    setSearchTerm("");
    setBreedFilter("");
    setSizeFilter("");
    setStatusFilter("");
    setAgeMin("");
    setAgeMax("");
    setLat("");
    setLng("");
    setRadius("");
    setPage(1);
    setSearchParams((currentParams) => {
      const nextParams = new URLSearchParams(currentParams);
      nextParams.delete("species");
      return nextParams;
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "center" }} sx={{ mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Browse Pets
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Find your perfect companion from our available pets
            </Typography>
          </Box>
          {canManagePets && (
            <Button
              component={Link}
              to={user?.role === "Admin" ? "/admin/pets/new" : "/staff/pets/new"}
              variant="contained"
              startIcon={<Add />}
            >
              Add New Pet
            </Button>
          )}
        </Stack>

        <Card sx={{ mb: 4, p: 0, overflow: "hidden" }}>
          <Box
            sx={{
              px: { xs: 2, md: 3 },
              py: 2.5,
              background: "linear-gradient(135deg, rgba(31,111,120,0.08) 0%, rgba(217,119,6,0.08) 100%)",
            }}
          >
            <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "center" }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                  Search With More Intention
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Filter by species, age, size, status, or shelter location to find a better match faster.
                </Typography>
              </Box>
              <Stack
                direction="row"
                spacing={1.25}
                divider={<Divider orientation="vertical" flexItem />}
                sx={{ flexWrap: "wrap", rowGap: 1 }}
              >
                <Box>
                  <Typography variant="caption" color="text.secondary">Visible</Typography>
                  <Typography variant="h6">{filteredPets.length}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Available</Typography>
                  <Typography variant="h6">{availableCount}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Pages</Typography>
                  <Typography variant="h6">{totalPages}</Typography>
                </Box>
              </Stack>
            </Stack>
          </Box>
        </Card>

        <Box sx={{ display: "flex", gap: 2, mb: 4, flexWrap: "wrap" }}>
          <TextField
            placeholder="Search by name or breed..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ flexGrow: 1, minWidth: 250 }}
          />
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Species</InputLabel>
            <Select value={speciesFilter} label="Species" onChange={handleSpeciesChange}>
              <MenuItem value="">All</MenuItem>
              <MenuItem value="dog">Dogs</MenuItem>
              <MenuItem value="cat">Cats</MenuItem>
              <MenuItem value="rabbit">Rabbits</MenuItem>
              <MenuItem value="bird">Birds</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={() => setShowAdvancedFilters((current) => !current)}
          >
            {showAdvancedFilters ? "Hide Filters" : "More Filters"}
          </Button>
          <FormControl sx={{ minWidth: 180 }}>
            <InputLabel>Sort By</InputLabel>
            <Select value={sortBy} label="Sort By" onChange={(event) => setSortBy(event.target.value)}>
              <MenuItem value="newest">Newest First</MenuItem>
              <MenuItem value="oldest">Oldest First</MenuItem>
              <MenuItem value="name_asc">Name A-Z</MenuItem>
              <MenuItem value="age_young">Youngest First</MenuItem>
              <MenuItem value="age_old">Oldest Pets First</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Collapse in={showAdvancedFilters}>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: 2, mb: 4 }}>
            <TextField
              label="Breed"
              value={breedFilter}
              onChange={(event) => setBreedFilter(event.target.value)}
            />
            <FormControl>
              <InputLabel>Size</InputLabel>
              <Select value={sizeFilter} label="Size" onChange={(event) => setSizeFilter(event.target.value)}>
                <MenuItem value="">All</MenuItem>
                <MenuItem value="small">Small</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="large">Large</MenuItem>
                <MenuItem value="extra_large">Extra Large</MenuItem>
              </Select>
            </FormControl>
            <FormControl>
              <InputLabel>Status</InputLabel>
              <Select value={statusFilter} label="Status" onChange={(event) => setStatusFilter(event.target.value)}>
                <MenuItem value="">All</MenuItem>
                <MenuItem value="intake">Intake</MenuItem>
                <MenuItem value="medical_hold">Medical Hold</MenuItem>
                <MenuItem value="available">Available</MenuItem>
                <MenuItem value="adoption_pending">Adoption Pending</MenuItem>
                <MenuItem value="adopted">Adopted</MenuItem>
                <MenuItem value="foster_placed">Foster Placed</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Age Min"
              type="number"
              value={ageMin}
              onChange={(event) => setAgeMin(event.target.value)}
            />
            <TextField
              label="Age Max"
              type="number"
              value={ageMax}
              onChange={(event) => setAgeMax(event.target.value)}
            />
            <TextField
              label="Latitude"
              value={lat}
              onChange={(event) => setLat(event.target.value)}
            />
            <TextField
              label="Longitude"
              value={lng}
              onChange={(event) => setLng(event.target.value)}
            />
            <TextField
              label="Radius (km)"
              type="number"
              value={radius}
              onChange={(event) => setRadius(event.target.value)}
            />
            <Button variant="text" onClick={resetFilters} sx={{ justifySelf: "start" }}>
              Reset Filters
            </Button>
          </Box>
        </Collapse>

        <Grid container spacing={3}>
          {sortedPets.map((pet, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={pet._id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.2s",
                    overflow: "hidden",
                    "&:hover": { transform: "translateY(-6px)" },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={pet.photos[0]?.url || "https://via.placeholder.com/400x300"}
                    alt={pet.name}
                    sx={{ objectFit: "cover" }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {pet.name}
                      </Typography>
                      <Chip
                        label={pet.species}
                        size="small"
                        color={pet.species === "dog" ? "primary" : "secondary"}
                        variant="outlined"
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {pet.breed} • {pet.age.years}y {pet.age.months}m
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        mb: 1.5,
                        color: "text.secondary",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {pet.description}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                      {pet.temperament.slice(0, 2).map((trait) => (
                        <Chip key={trait} label={trait} size="small" sx={{ fontSize: "0.7rem" }} />
                      ))}
                    </Box>
                    <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                      <Button component={Link} to={`/pets/${pet._id}`} fullWidth variant="outlined" size="small">
                        View
                      </Button>
                      {canManagePets && (
                        <Button
                          component={Link}
                          to={user?.role === "Admin" ? `/admin/pets/${pet._id}/edit` : `/staff/pets/${pet._id}/edit`}
                          fullWidth
                          variant="contained"
                          size="small"
                          startIcon={<Edit />}
                        >
                          Edit
                        </Button>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
        {sortedPets.length === 0 && (
          <Typography align="center" color="text.secondary" sx={{ mt: 4 }}>
            No pets matched your search. Try adjusting the filters or add a new pet from the dashboard.
          </Typography>
        )}

        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination count={totalPages} page={currentPage} onChange={(_, value) => setPage(value)} color="primary" />
        </Box>
      </motion.div>
    </Container>
  );
};

export default PetsList;
