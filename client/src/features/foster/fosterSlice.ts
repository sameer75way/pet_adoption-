import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export interface FosterAssignment {
  _id: string;
  pet: {
    _id: string;
    name: string;
    species: string;
    photos: { url: string }[];
  };
  fosterParent: {
    _id: string;
    name: string;
    email: string;
  };
  status: "active" | "completed" | "returned_early";
  startDate: string;
  expectedEndDate: string;
  actualEndDate?: string;
  notes?: string;
  assignedBy: string;
  createdAt: string;
}

interface FosterState {
  assignments: FosterAssignment[];
  myAssignments: FosterAssignment[];
  loading: boolean;
  error: string | null;
}

const initialState: FosterState = {
  assignments: [],
  myAssignments: [],
  loading: false,
  error: null,
};

export const fetchFosterAssignments = createAsyncThunk(
  "foster/fetchFosterAssignments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/foster/assignments");
      return response.data.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || "Failed to fetch foster assignments");
    }
  }
);

export const registerAsFoster = createAsyncThunk(
  "foster/registerAsFoster",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post("/foster/register");
      return response.data.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || "Failed to register as foster");
    }
  }
);

export const assignPetToFoster = createAsyncThunk(
  "foster/assignPetToFoster",
  async (
    data: { petId: string; fosterParentId: string; startDate: string; expectedEndDate: string; notes?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post("/foster/assignments", data);
      return response.data.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || "Failed to assign pet");
    }
  }
);

const fosterSlice = createSlice({
  name: "foster",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFosterAssignments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFosterAssignments.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments = action.payload;
      })
      .addCase(fetchFosterAssignments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(assignPetToFoster.fulfilled, (state, action) => {
        state.assignments.unshift(action.payload);
      });
  },
});

export const { clearError } = fosterSlice.actions;
export default fosterSlice.reducer;
