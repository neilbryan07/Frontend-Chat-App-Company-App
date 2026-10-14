import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userData: {
    id: null,
    ass_id: null,
    name: null,
    permission: null,
    session_key: null,
    email: null,
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    storeUserDetails: (state, action) => {
      let update = {
        id: action.payload.id,
        ass_id: action.payload.ass_id,
        name: action.payload.name,
        permission: action.payload.permission,
        session_key: action.payload.session_key,
        email: action.payload.email,
      };
      state.userData = update;
    },
  },
});

export const { storeUserDetails } = userSlice.actions;

export default userSlice.reducer;
