import {instanceAxios8000} from "../../config/axiosConfig";
import {createAsyncThunk} from "@reduxjs/toolkit";

export const getWorkspaceByMemberId = createAsyncThunk('workspaces/getWorkspaceByMemberId', async (payload, thunkAPI) => {
    try {
        const response = await instanceAxios8000.get(`/api/workspaces/member`);
        return response.data.data;
    } catch (error) {
        thunkAPI.rejectWithValue(error.response.data);
    }
})

export const createWorkspace = createAsyncThunk('workspaces/createWorkspace', async (payload, thunkAPI) => {
    try {
        const response = await instanceAxios8000.post('/api/workspaces', payload);
        return response.data.newWorkspace;
    } catch (error) {
        thunkAPI.rejectWithValue(error.response.data);
    }
})

export const updateWorkspace = createAsyncThunk('workspaces/updateWorkspace', async (payload, thunkAPI) => {
    try {
        await instanceAxios8000.put('/api/workspaces', payload);
        return payload;
    } catch (error) {
        thunkAPI.rejectWithValue(error.response.data);
    }
})

export const deleteWorkspace = createAsyncThunk('workspaces/deleteWorkspace', async (payload, thunkAPI) => {
    try {
        console.log('check payload', payload);
        await instanceAxios8000.delete('/api/workspaces', {
            params: {
                _id: payload,
            }
        });
        return payload;
    } catch (error) {
        thunkAPI.rejectWithValue(error.response.data);
    }
})





