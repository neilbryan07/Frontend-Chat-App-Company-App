import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    groupSelectedData : { id : null , name : null },
}

export const groupSelectedSlice = createSlice({
    name : 'groupSelected',
    initialState,
    reducers : {
        storeGroupSelectedDetails : ( state , action) => {

            state.groupSelectedData = action.payload
            
        }
    }
});

export const { storeGroupSelectedDetails } = groupSelectedSlice.actions

export default groupSelectedSlice.reducer;