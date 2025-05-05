import {instanceAxios8000} from "../../config/axiosConfig";
import {createAsyncThunk} from "@reduxjs/toolkit";

export const createTransaction = createAsyncThunk('transactions/createTransaction', async (payload, thunkAPI) => {
    try {
        const response = await instanceAxios8000.post('/api/transactions', payload);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
})

export const deleteTransaction = createAsyncThunk('transactions/deleteTransaction', async (payload, thunkAPI) => {
    try {
        await instanceAxios8000.delete('/api/transactions', {
            params: {
                _id: payload,
            }
        });
        return payload;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
})









