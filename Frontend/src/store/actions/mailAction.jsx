import {createAsyncThunk} from "@reduxjs/toolkit";
import {instanceAxios8000} from "../../config/axiosConfig";

export const sendMail = createAsyncThunk('laptops/sendMail', async (payload, thunkAPI) => {
    try {
        const response = await instanceAxios8000.post('/api/mail/send-mail', payload);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
})
