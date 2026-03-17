import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import petReducer from "../features/pets/petSlice";
import applicationReducer from "../features/applications/applicationSlice";
import userReducer from "../features/users/userSlice";
import medicalReducer from "../features/medical/medicalSlice";
import fosterReducer from "../features/foster/fosterSlice";
import notificationReducer from "../features/notifications/notificationSlice";
import storyReducer from "../features/stories/storySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    pets: petReducer,
    applications: applicationReducer,
    users: userReducer,
    medical: medicalReducer,
    foster: fosterReducer,
    notifications: notificationReducer,
    stories: storyReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
