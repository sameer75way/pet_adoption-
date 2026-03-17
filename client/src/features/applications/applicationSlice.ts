import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import api from "../../services/api";

export type ApplicationStatus =
  | "submitted"
  | "under_review"
  | "approved"
  | "rejected"
  | "withdrawn";

export interface Application {
  _id: string;
  pet: {
    _id: string;
    name: string;
    species: string;
    photos: { url: string }[];
  };
  applicant: {
    _id: string;
    name: string;
    email: string;
  };
  status: ApplicationStatus;
  questionnaire: {
    housingType: string;
    hasYard: boolean;
    householdAdults: number;
    householdChildren: number;
    otherPets: string;
    previousPets: string;
    hoursAlonePerDay: number;
    reasonForAdoption: string;
  };
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

interface ApplicationState {
  applications: Application[];
  myApplications: Application[];
  currentApplication: Application | null;
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
}

const initialState: ApplicationState = {
  applications: [],
  myApplications: [],
  currentApplication: null,
  loading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,
};

export const fetchApplications = createAsyncThunk(
  "applications/fetchApplications",
  async (params: { page?: number; limit?: number; status?: string } = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/applications", { params });
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || "Failed to fetch applications");
    }
  }
);

export const fetchMyApplications = createAsyncThunk(
  "applications/fetchMyApplications",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/applications/my");
      return response.data.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || "Failed to fetch your applications");
    }
  }
);

export const submitApplication = createAsyncThunk(
  "applications/submitApplication",
  async (data: { petId: string; questionnaire: Application["questionnaire"] }, { rejectWithValue }) => {
    try {
      const response = await api.post("/applications", {
        pet: data.petId,
        questionnaire: data.questionnaire,
      });
      return response.data.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || "Failed to submit application");
    }
  }
);

export const updateApplicationStatus = createAsyncThunk(
  "applications/updateApplicationStatus",
  async (
    { id, status, rejectionReason }: { id: string; status: ApplicationStatus; rejectionReason?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.patch(`/applications/${id}/status`, { status, rejectionReason });
      return response.data.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || "Failed to update status");
    }
  }
);

const applicationSlice = createSlice({
  name: "applications",
  initialState,
  reducers: {
    clearCurrentApplication: (state) => {
      state.currentApplication = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    upsertApplicationRealtime: (state, action: PayloadAction<Application>) => {
      const nextApplication = action.payload;
      const appIndex = state.applications.findIndex((item) => item._id === nextApplication._id);
      const myIndex = state.myApplications.findIndex((item) => item._id === nextApplication._id);

      if (appIndex === -1) {
        state.applications.unshift(nextApplication);
      } else {
        state.applications[appIndex] = nextApplication;
      }

      if (myIndex === -1) {
        state.myApplications.unshift(nextApplication);
      } else {
        state.myApplications[myIndex] = nextApplication;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload.data || [];
        state.totalPages = action.payload.totalPages || 1;
        state.currentPage = action.payload.currentPage || 1;
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchMyApplications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.myApplications = action.payload;
      })
      .addCase(fetchMyApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(submitApplication.fulfilled, (state, action) => {
        state.myApplications.unshift(action.payload);
      })
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        const index = state.applications.findIndex((a) => a._id === action.payload._id);
        if (index !== -1) {
          state.applications[index] = action.payload;
        }
        const myIndex = state.myApplications.findIndex((a) => a._id === action.payload._id);
        if (myIndex !== -1) {
          state.myApplications[myIndex] = action.payload;
        }
      });
  },
});

export const { clearCurrentApplication, clearError, upsertApplicationRealtime } = applicationSlice.actions;
export default applicationSlice.reducer;
