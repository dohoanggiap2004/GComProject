import { createAsyncThunk } from "@reduxjs/toolkit";
import { instanceAxios8000 } from "../../config/axiosConfig.jsx";

export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (formData, thunkAPI) => {
        try {
            await instanceAxios8000.post("/auth/login", formData);
            return true;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data.message || error.message);
        }
    }
);

export const loginGG = createAsyncThunk(
    "auth/loginGG",
    async (_, thunkAPI) => {
        try {
            window.location.href = "http://localhost:8000/auth/google";
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data.message || error.message);
        }
    }
);

export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async (formData, thunkAPI) => {
        try {
            const response = await instanceAxios8000.post("/auth/register", formData);
            return response.data
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data.message || error.message);
        }
    }
);

export const logoutUser = createAsyncThunk(
    "auth/logoutUser",
    async (_, thunkAPI) => {
        try {
            await instanceAxios8000.post("/auth/logout");
            return true;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data.message || error.message);
        }
    }
);

export const setFalseRegister = createAsyncThunk(
    "auth/setFalseRegister",
    async () => {
        return true
    }
);
