import { createAsyncThunk } from "@reduxjs/toolkit";
import { APIServices } from "../../hooks/fetchAPI";

export const fetchMessageGroup = createAsyncThunk(
    'fetch/message/group',
    async (value, thunkApi) => {
        try {

            const response = await APIServices.get({ url: `/fetch-message-group` , payload: value });
            return response.data.data;

        } catch (error) {
            return thunkApi.rejectWithValue({ error: error.data, status: error.status });
        }
    }
)