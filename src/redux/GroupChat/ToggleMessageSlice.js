import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    toggleMessage: false,
}

export const toggleMessageSlice = createSlice({
    name: 'toggleMessage',
    initialState,
    reducers: {
        storeToggleMessage: (state, action) => {

            state.toggleMessage = action.payload

        }
    }
});

export const { storeToggleMessage } = toggleMessageSlice.actions

export default toggleMessageSlice.reducer;