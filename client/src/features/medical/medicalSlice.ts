import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export type MedicalRecordType =
  | "vaccination"
  | "deworming"
  | "surgery"
  | "vet_visit"
  | "diagnosis"
  | "prescription";

export interface MedicalRecord {
  _id: string;
  pet: string;
  type: MedicalRecordType;
  title: string;
  notes: string;
  date: string;
  vetName: string;
  vetClinic: string;
  recordedBy: string;
  createdAt: string;
}

interface MedicalState {
  records: MedicalRecord[];
  loading: boolean;
  error: string | null;
}

const initialState: MedicalState = {
  records: [],
  loading: false,
  error: null,
};

export const fetchMedicalHistory = createAsyncThunk(
  "medical/fetchMedicalHistory",
  async (petId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/medical/${petId}/records`);
      return response.data.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || "Failed to fetch medical records");
    }
  }
);

export const addMedicalRecord = createAsyncThunk(
  "medical/addMedicalRecord",
  async (
    { petId, data }: { petId: string; data: Partial<MedicalRecord> },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post(`/medical/${petId}/records`, data);
      return response.data.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || "Failed to add medical record");
    }
  }
);

const medicalSlice = createSlice({
  name: "medical",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearRecords: (state) => {
      state.records = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMedicalHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMedicalHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload;
      })
      .addCase(fetchMedicalHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addMedicalRecord.fulfilled, (state, action) => {
        state.records.unshift(action.payload);
      });
  },
});

export const { clearError, clearRecords } = medicalSlice.actions;
export default medicalSlice.reducer;
