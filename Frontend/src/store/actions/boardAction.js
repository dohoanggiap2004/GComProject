import {instanceAxios8000} from "../../config/axiosConfig";
import {createAsyncThunk} from "@reduxjs/toolkit";

export const getBoardByWorkspaceId = createAsyncThunk('boards/getBoardByWorkspaceId', async (payload, thunkAPI) => {
    try {
        const response = await instanceAxios8000.get(`/api/boards/workspace/${payload}`);
        return response.data.data;
    } catch (error) {
        thunkAPI.rejectWithValue(error.response.data);
    }
})

export const getBoardByBoardId = createAsyncThunk('boards/getBoardByBoardId', async (payload, thunkAPI) => {
    try {
        const response = await instanceAxios8000.get(`/api/boards`);
        return response.data.data;
    } catch (error) {
        thunkAPI.rejectWithValue(error.response.data);
    }
})

export const createBoard = createAsyncThunk('boards/createBoard', async (payload, thunkAPI) => {
    try {
        const response = await instanceAxios8000.post('/api/boards', payload);
        return response.data.newBoard;
    } catch (error) {
        thunkAPI.rejectWithValue(error.response.data);
    }
})

export const updateBoard = createAsyncThunk('boards/updateBoard', async (payload, thunkAPI) => {
    try {
        await instanceAxios8000.put('/api/boards', payload);
        return payload;
    } catch (error) {
        thunkAPI.rejectWithValue(error.response.data);
    }
})

export const deleteBoard = createAsyncThunk('boards/deleteBoard', async (payload, thunkAPI) => {
    try {
        await instanceAxios8000.delete('/api/boards', {
            params: {
                _id: payload,
            }
        });
        return payload;
    } catch (error) {
        thunkAPI.rejectWithValue(error.response.data);
    }
})





