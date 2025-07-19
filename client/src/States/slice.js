import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  mode: "light",
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setMode:(state, action)=>{
        state.mode=action.payload;
    },
  },
});

const appReducer = appSlice.reducer;
export default appReducer;

export const { setUser, setToken, setMode } = appSlice.actions;