import {instanceAxios8000} from "../../config/axiosConfig";
import {createAsyncThunk} from "@reduxjs/toolkit";

export const getHistoryViewsByUserId = createAsyncThunk('history-view/getHistoryViewsByCardId', async (payload, thunkAPI) => {
    try {
        const response = await instanceAxios8000.get(`/api/history-view`);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
})


export const createHistoryView = createAsyncThunk('history-view/createHistoryView', async (payload, thunkAPI) => {
    try {
        const response = await instanceAxios8000.post(`/api/history-view`, payload);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
})

// export const updateHistoryView = createAsyncThunk('history-view/updateHistoryView', async (payload, thunkAPI) => {
//     try {
//         const response = await instanceAxios8000.put(`/api/history-view`, payload);
//         return response.data.data;
//     } catch (error) {
//         return thunkAPI.rejectWithValue(error.response.data.message);
//     }
// })




