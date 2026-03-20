import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import api from "../../services/api";

export type PetStatus =
  | "intake"
  | "medical_hold"
  | "available"
  | "adoption_pending"
  | "adopted"
  | "foster_placed";

export type PetSpecies = "dog" | "cat" | "rabbit" | "bird" | "other";
export type PetSize = "small" | "medium" | "large" | "extra_large";
export type PetGender = "male" | "female" | "unknown";
export type IntakeType = "stray" | "surrendered" | "rescued" | "transferred";

export interface PetPhoto {
  url: string;
  publicId: string;
  isPrimary: boolean;
}

export interface Pet {
  _id: string;
  intakeId: string;
  name: string;
  species: PetSpecies;
  breed: string;
  mixedBreed: boolean;
  age: {
    years: number;
    months: number;
  };
  size: PetSize;
  gender: PetGender;
  color?: string;
  weight?: number;
  temperament: string[];
  description: string;
  photos: PetPhoto[];
  status: PetStatus;
  intakeDate: string;
  intakeType: IntakeType;
  intakeNotes?: string;
  shelter: {
    name: string;
    address: string;
    location: {
      type: string;
      coordinates: [number, number];
    };
  };
  isNeutered: boolean;
  isMicrochipped: boolean;
  adoptedBy?: string;
  adoptedAt?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface PetState {
  pets: Pet[];
  currentPet: Pet | null;
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  filters: {
    species?: string;
    status?: string;
    size?: string;
    search?: string;
  };
}

const initialState: PetState = {
  pets: [],
  currentPet: null,
  loading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,
  filters: {},
};

export const fetchPets = createAsyncThunk(
  "pets/fetchPets",
  async (
    params: {
      page?: number;
      limit?: number;
      search?: string;
      species?: string;
      status?: string;
      size?: string;
      breed?: string;
      ageMin?: number;
      ageMax?: number;
      lat?: number;
      lng?: number;
      radius?: number;
    } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await api.get("/pets", { params });
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || "Failed to fetch pets");
    }
  }
);

export const fetchPetById = createAsyncThunk(
  "pets/fetchPetById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/pets/${id}`);
      return response.data.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || "Failed to fetch pet");
    }
  }
);

export const createPet = createAsyncThunk(
  "pets/createPet",
  async (petData: Partial<Pet>, { rejectWithValue }) => {
    try {
      const response = await api.post("/pets", petData);
      return response.data.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || "Failed to create pet");
    }
  }
);

export const updatePet = createAsyncThunk(
  "pets/updatePet",
  async ({ id, data }: { id: string; data: Partial<Pet> }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/pets/${id}`, data);
      return response.data.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || "Failed to update pet");
    }
  }
);

export const deletePet = createAsyncThunk(
  "pets/deletePet",
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/pets/${id}`);
      return id;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || "Failed to delete pet");
    }
  }
);

export const updatePetStatus = createAsyncThunk(
  "pets/updatePetStatus",
  async ({ id, status }: { id: string; status: PetStatus }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/pets/${id}/status`, { status });
      return response.data.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || "Failed to update status");
    }
  }
);

const petSlice = createSlice({
  name: "pets",
  initialState,
  reducers: {
    clearCurrentPet: (state) => {
      state.currentPet = null;
    },
    setFilters: (state, action: PayloadAction<PetState["filters"]>) => {
      state.filters = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPets.fulfilled, (state, action) => {
        state.loading = false;
        state.pets = action.payload.data || [];
        state.totalPages =
          action.payload.totalPages || action.payload.meta?.totalPages || 1;
        state.currentPage =
          action.payload.currentPage || action.payload.meta?.page || 1;
      })
      .addCase(fetchPets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchPetById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPetById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPet = action.payload;
      })
      .addCase(fetchPetById.rejected, (state, action) => {
        state.loading = false;
        state.currentPet = null;
        state.error = action.payload as string;
      })
      .addCase(createPet.fulfilled, (state, action) => {
        state.pets.unshift(action.payload);
      })
      .addCase(updatePet.fulfilled, (state, action) => {
        const index = state.pets.findIndex((p) => p._id === action.payload._id);
        if (index !== -1) {
          state.pets[index] = action.payload;
        }
        if (state.currentPet?._id === action.payload._id) {
          state.currentPet = action.payload;
        }
      })
      .addCase(deletePet.fulfilled, (state, action) => {
        state.pets = state.pets.filter((p) => p._id !== action.payload);
      })
      .addCase(updatePetStatus.fulfilled, (state, action) => {
        const index = state.pets.findIndex((p) => p._id === action.payload._id);
        if (index !== -1) {
          state.pets[index] = action.payload;
        }
        if (state.currentPet?._id === action.payload._id) {
          state.currentPet = action.payload;
        }
      });
  },
});

export const { clearCurrentPet, setFilters, clearError } = petSlice.actions;
export default petSlice.reducer;
