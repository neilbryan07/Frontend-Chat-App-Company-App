import { createSlice } from "@reduxjs/toolkit";
import { fetchMessageGroup } from "./GroupChatThunk";


const initialState = {
    groupChatData : {
        loading: true,
        status: "pending",
        data: [],
        error: {},
    },
}

export const groupChatSlice = createSlice({
    name : 'groupChat',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(fetchMessageGroup.pending, (state) => {
                state.action = {
                    groupChatData: {
                        loading: true,
                        status: "pending",
                    }
                };
            })
            .addCase(fetchMessageGroup.fulfilled, (state, action) => {                
                state.action = {
                    groupChatData: {
                        loading: true,
                        status: "pending",
                        data: action.payload,
                    }
                };
            })
            .addCase(fetchMessageGroup.rejected, (state, action) => {
                state.groupChatData = {
                    groupChatData: {
                        loading: false,
                        status: "rejected",
                        error: action.payload,
                    }
                };
            })
    }
});

export const storeGroupDetails = groupChatSlice.actions

export default groupChatSlice.reducer;