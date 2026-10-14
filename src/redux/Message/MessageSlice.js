import { createSlice } from "@reduxjs/toolkit";
import { fetchMessageData } from "./MessageThunk";


const initialState = {
    messageData : {
        loading: true,
        status: "pending",
        data: [],
        error: {},
    },
}

export const messageSlice = createSlice({
    name : 'message',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(fetchMessageData.pending, (state) => {
                state.action = {
                    messageData: {
                        loading: true,
                        status: "pending",
                    }
                };
            })
            .addCase(fetchMessageData.fulfilled, (state, action) => {       
                state.action = {
                    messageData: {
                        loading: true,
                        status: "pending",
                        data: action.payload,
                    }
                };
            })
            .addCase(fetchMessageData.rejected, (state, action) => {
                state.messageData = {
                    messageData: {
                        loading: false,
                        status: "rejected",
                        error: action.payload,
                    }
                };
            })
    }
});

export const storeGroupDetails = messageSlice.actions

export default messageSlice.reducer;