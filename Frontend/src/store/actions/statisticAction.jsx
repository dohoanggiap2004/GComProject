import {instanceAxios8000} from "../../config/axiosConfig";
import {createAsyncThunk} from "@reduxjs/toolkit";

export const getMemberQuantityInBoard = createAsyncThunk('statistics/getMemberQuantityInBoard', async (payload, thunkAPI) => {
    try {
        const response = await instanceAxios8000.get(`/api/statistics/member-quantity/${payload}`);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
})

export const getCardQuantityInBoard = createAsyncThunk('statistics/getCardQuantityInBoard', async (payload, thunkAPI) => {
    try {
        const response = await instanceAxios8000.get(`/api/statistics/card-quantity/${payload}`);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
})

export const getTaskQuantityInBoard = createAsyncThunk('statistics/getTaskQuantityInBoard', async (payload, thunkAPI) => {
    try {
        const response = await instanceAxios8000.get(`/api/statistics/task-quantity/${payload}`);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
})

export const getProductiveMembers = createAsyncThunk('statistics/getProductiveMembers', async (payload, thunkAPI) => {
    try {
        const response = await instanceAxios8000.get(`/api/statistics/productive-member/${payload}`);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
})

export const getMonthlyProgress = createAsyncThunk('statistics/getMonthlyProgress', async (payload, thunkAPI) => {
    try {
        const response = await instanceAxios8000.get(`/api/statistics/monthly-progress/${payload}`);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
})

export const getTaskQuantityInList = createAsyncThunk('statistics/getTaskQuantityInList', async (payload, thunkAPI) => {
    try {
        const response = await instanceAxios8000.get(`/api/statistics/task-in-list/${payload}`);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
})










