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
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
})

export const getUserRoleInWorkspaceOrBoard = createAsyncThunk('users/getUserRoleInWorkspaceOrBoard', async (payload, thunkAPI) => {
    try {
        const response = await instanceAxios8000.get(`/api/users/role`, {
            params: {
                boardId: payload.boardId,
                workspaceId: payload.workspaceId,
            }
        });
        return response.data.data.role;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
})

export const getQuantityUserWorkspace = createAsyncThunk('users/getQuantityUserWorkspace', async (payload, thunkAPI) => {
    try {
        const response = await instanceAxios8000.get(`/api/users/quantity-workspace`);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
})

export const getUserInfo = createAsyncThunk('users/getUserInfo', async (payload, thunkAPI) => {
    try {
        const response = await instanceAxios8000.get(`/api/users/info`);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
})










