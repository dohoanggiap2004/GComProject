import {createAsyncThunk} from "@reduxjs/toolkit";
import {instanceAxios8000} from "../../config/axiosConfig.jsx";

export const getBoardWithMessages = createAsyncThunk('messages/getBoardWithMessages', async (_, thunkAPI) => {
    try {
        const response = await instanceAxios8000.get(`/api/messages/board-with-messages`);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
})
