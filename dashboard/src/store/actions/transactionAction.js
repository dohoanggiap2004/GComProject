import {instanceAxios8000} from "../../config/axiosConfig";
import {createAsyncThunk} from "@reduxjs/toolkit";

// Tạo async thunk để fetch sản phẩm
export const getTransactions = createAsyncThunk('transactions/fetchTransactions', async (payload, thunkAPI) => {
    try {
        const response = await instanceAxios8000.get('/api/transactions', payload);
        return response.data.data;
    } catch (error) {
        thunkAPI.rejectWithValue(error.response.data);
    }
});

export const createTransaction = createAsyncThunk('transactions/createTransaction', async (payload, thunkAPI) => {
    try {
        const response = await instanceAxios8000.post('/api/transactions', payload);
        return response.data;
    } catch (error) {
        thunkAPI.rejectWithValue(error.response.data);
    }
})

export const updateTransaction = createAsyncThunk('transactions/updateTransaction', async (payload, thunkAPI) => {
    try {
        const response = await instanceAxios8000.put(`/api/transactions`, payload);
        return payload;
    } catch (error) {
        thunkAPI.rejectWithValue(error.response.data);
    }
})

export const deleteTransaction = createAsyncThunk('transactions/deleteTransaction', async (payload, thunkAPI) => {
    try {
        const response = await instanceAxios8000.delete(`/api/transactions`, {
            params: {
                _id: payload._id
            }
        });
        return payload;
    } catch (error) {
        thunkAPI.rejectWithValue(error.response.data);
    }
})





