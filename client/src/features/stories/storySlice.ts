import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";

export interface Story {
  _id: string;
  title: string;
  summary: string;
  content: string;
  image: string;
  petName?: string;
  adopterName?: string;
  published: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface StoryState {
  stories: Story[];
  loading: boolean;
  submitting: boolean;
  error: string | null;
}

const initialState: StoryState = {
  stories: [],
  loading: false,
  submitting: false,
  error: null,
};

export const fetchStories = createAsyncThunk(
  "stories/fetchStories",
  async (includeAll: boolean = false, { rejectWithValue }) => {
    try {
      const response = await api.get("/stories", {
        params: includeAll ? { includeAll: true } : undefined,
      });
      return response.data.data as Story[];
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || "Failed to fetch stories");
    }
  }
);

export const createStory = createAsyncThunk(
  "stories/createStory",
  async (
    data: Omit<Story, "_id" | "createdBy" | "createdAt" | "updatedAt">,
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post("/stories", data);
      return response.data.data as Story;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || "Failed to create story");
    }
  }
);

export const updateStory = createAsyncThunk(
  "stories/updateStory",
  async (
    {
      id,
      data,
    }: {
      id: string;
      data: Partial<Omit<Story, "_id" | "createdBy" | "createdAt" | "updatedAt">>;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.patch(`/stories/${id}`, data);
      return response.data.data as Story;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || "Failed to update story");
    }
  }
);

export const deleteStory = createAsyncThunk(
  "stories/deleteStory",
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/stories/${id}`);
      return id;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || "Failed to delete story");
    }
  }
);

const storySlice = createSlice({
  name: "stories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStories.fulfilled, (state, action) => {
        state.loading = false;
        state.stories = action.payload;
      })
      .addCase(fetchStories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createStory.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(createStory.fulfilled, (state, action) => {
        state.submitting = false;
        state.stories.unshift(action.payload);
      })
      .addCase(createStory.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload as string;
      })
      .addCase(updateStory.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(updateStory.fulfilled, (state, action) => {
        state.submitting = false;
        const index = state.stories.findIndex((story) => story._id === action.payload._id);
        if (index !== -1) {
          state.stories[index] = action.payload;
        }
      })
      .addCase(updateStory.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload as string;
      })
      .addCase(deleteStory.fulfilled, (state, action) => {
        state.stories = state.stories.filter((story) => story._id !== action.payload);
      });
  },
});

export default storySlice.reducer;
