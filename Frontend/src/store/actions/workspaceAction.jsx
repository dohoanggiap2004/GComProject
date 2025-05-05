import {instanceAxios8000} from "../../config/axiosConfig";
import {createAsyncThunk} from "@reduxjs/toolkit";

export const getWorkspaceByMemberId = createAsyncThunk('workspaces/getWorkspaceByMemberId', async (payload, thunkAPI) => {
    try {
        const response = await instanceAxios8000.get(`/api/workspaces/member`);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
})


export const getWorkspaceByWorkspaceId = createAsyncThunk('workspaces/getWorkspaceByWorkspaceId', async (payload, thunkAPI) => {
    try {
        const response = await instanceAxios8000.get(`/api/workspaces/${payload}`);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
})

export const getMemberInBoardsByWorkspaceId = createAsyncThunk('workspaces/getMemberInBoardsByWorkspaceId', async (payload, thunkAPI) => {
    try {
        const response = await instanceAxios8000.get(`/api/workspaces/member-board/${payload}`);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
})

export const createWorkspace = createAsyncThunk('workspaces/createWorkspace', async (payload, thunkAPI) => {
    try {
        const response = await instanceAxios8000.post('/api/workspaces', payload);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
})

export const updateWorkspace = createAsyncThunk('workspaces/updateWorkspace', async (payload, thunkAPI) => {
    try {
        const response = await instanceAxios8000.put('/api/workspaces', payload);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
})

export const deleteWorkspace = createAsyncThunk('workspaces/deleteWorkspace', async (payload, thunkAPI) => {
    try {
        await instanceAxios8000.delete('/api/workspaces', {
            params: {
                _id: payload,
            }
        });
        return payload;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
})





