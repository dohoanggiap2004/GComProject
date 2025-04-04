import {instanceAxios8000} from "../../config/axiosConfig";
import {createAsyncThunk} from "@reduxjs/toolkit";

export const searchUser = createAsyncThunk('users/searchUser', async (payload, thunkAPI) => {
    try {
        const response = await instanceAxios8000.get(`/api/users/search`, {
            params: {
                value: payload,
            }
        });
        return response.data.data;
    } catch (error) {
        thunkAPI.rejectWithValue(error.response.data);
    }
})







