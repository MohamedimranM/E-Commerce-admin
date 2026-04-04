import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth-slice";
import sidebarReducer from "./features/sidebar-slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    sidebar: sidebarReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
