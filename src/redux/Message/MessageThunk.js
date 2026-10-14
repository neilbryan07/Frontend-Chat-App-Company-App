import { createAsyncThunk } from "@reduxjs/toolkit";
import { APIServices } from "../../hooks/fetchAPI";

export const fetchMessageData = createAsyncThunk(
    'fetch/message/text',
    async (value, thunkApi) => {
        try {

            const response = await APIServices.get({ url: `/fetch-message-text` , payload: value });
            return response.data.data;

        } catch (error) {
            return thunkApi.rejectWithValue({ error: error.data, status: error.status });
        }
    }
)