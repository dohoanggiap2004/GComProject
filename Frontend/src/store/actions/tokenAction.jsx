import { createAsyncThunk } from '@reduxjs/toolkit';
import {instanceAxios8000} from '../../config/axiosConfig';

// Action để làm mới access token
export const refreshToken = createAsyncThunk(
    'auth/refreshToken',
    async (_, thunkAPI) => {
        try {
            await instanceAxios8000.get('/refresh-token');
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to refresh token');
        }
    }
);
