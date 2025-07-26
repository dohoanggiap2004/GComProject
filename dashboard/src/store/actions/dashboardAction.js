import { instanceAxios8000 } from "../../config/axiosConfig";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getUserQuantity = createAsyncThunk('dashboard/getUserQuantity',
    async (_, thunkAPI) => {
        try {
            const response = await instanceAxios8000.get('api/statistics/user-quantity');
            return response.data.data;
        } catch (e) {
            console.error("Error fetching quantity of users:", e);
            return thunkAPI.rejectWithValue(e.response ? e.response.data : "Network Error");
        }
    }
);

export const getMonthlyRevenue = createAsyncThunk('dashboard/getMonthlyRevenue',
    async (_, thunkAPI) => {
        try {
            const response = await instanceAxios8000.get('api/statistics/monthly-revenue');
            return response.data.data;
        } catch (e) {
            console.error("Error calculating revenue:", e);
            return thunkAPI.rejectWithValue(e.response ? e.response.data : "Network Error");
        }
    }
);

export const getRevenue = createAsyncThunk('dashboard/getRevenue',
    async (_, thunkAPI) => {
        try {
            const response = await instanceAxios8000.get('api/statistics/revenue');
            return response.data.data;
        } catch (e) {
            console.error("Error counting product sales:", e);
            return thunkAPI.rejectWithValue(e.response ? e.response.data : "Network Error");
        }
    }
);

export const getWorkspaceQuantity = createAsyncThunk('dashboard/getWorkspaceQuantity',
    async (_, thunkAPI) => {
        try {
            const response = await instanceAxios8000.get('api/statistics/workspace-quantity');
            return response.data.data;
        } catch (e) {
            console.error("Error fetching quantity of users:", e);
            return thunkAPI.rejectWithValue(e.response ? e.response.data : "Network Error");
        }
    }
);


