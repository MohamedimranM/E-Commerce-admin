import { createSlice } from "@reduxjs/toolkit";

interface SidebarState {
  isCollapsed: boolean;
  isMobileOpen: boolean;
}

const initialState: SidebarState = {
  isCollapsed: false,
  isMobileOpen: false,
};

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    toggleCollapse(state) {
      state.isCollapsed = !state.isCollapsed;
    },
    setCollapsed(state, action) {
      state.isCollapsed = action.payload;
    },
    toggleMobile(state) {
      state.isMobileOpen = !state.isMobileOpen;
    },
    closeMobile(state) {
      state.isMobileOpen = false;
    },
  },
});

export const { toggleCollapse, setCollapsed, toggleMobile, closeMobile } =
  sidebarSlice.actions;
export default sidebarSlice.reducer;
