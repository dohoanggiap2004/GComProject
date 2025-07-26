import {instanceAxios8000} from "../../config/axiosConfig";
import {
    loginRequest,
    loginAdminSuccess,
    loginFailure,
    logoutAdminSuccess,
} from "../reducers/authReducer";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const loginAdmin = (formData) => async (dispatch) => {
    try {
        dispatch(loginRequest());
        const { data } = await instanceAxios8000.post("/auth/admin/login", formData);
        dispatch(loginAdminSuccess());
    } catch (error) {
        dispatch(loginFailure(error.response?.data.message || error.message));
    }
};

export const logoutAdmin = () => async (dispatch) => {
    try {
        await instanceAxios8000.post("/auth/logout"); // Đảm bảo endpoint đúng
        dispatch(logoutAdminSuccess()); // Cập nhật trạng thái đăng xuất trong Redux
    } catch (error) {
        console.error("Logout error:", error); // Hiển thị lỗi
    }
};

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
