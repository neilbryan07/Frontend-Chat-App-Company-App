import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    toggleDrawer: false,
}

export const toggleSlice = createSlice({
    name: 'toggleDrawer',
    initialState,
    reducers: {
        storeToggleDrawer: (state, action) => {

            state.toggleDrawer = action.payload

        }
    }
});

export const { storeToggleDrawer } = toggleSlice.actions

export default toggleSlice.reducer;