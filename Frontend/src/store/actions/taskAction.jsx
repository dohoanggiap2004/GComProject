import {instanceAxios8000} from "../../config/axiosConfig";
import {createAsyncThunk} from "@reduxjs/toolkit";

export const createTask = createAsyncThunk('tasks/createTask', async (payload, thunkAPI) => {
    try {
        const response = await instanceAxios8000.post(`/api/tasks`, payload);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
})

export const updateTask = createAsyncThunk('tasks/updateTask', async (payload, thunkAPI) => {
    try {
        const response = await instanceAxios8000.put(`/api/tasks`, payload);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
})

export const deleteTask = createAsyncThunk('tasks/deleteTask', async (payload, thunkAPI) => {
    try {
        await instanceAxios8000.delete(`/api/tasks`, {
            params: {
                boardId: payload.boardId,
                listId: payload.listId,
                cardId: payload.cardId,
                taskId: payload.taskId,
            }
        });
        return payload;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
})

export const addMemberToTask = createAsyncThunk('tasks/addMemberToTask', async (payload, thunkAPI) => {
    try {
        await instanceAxios8000.put(`/api/tasks/add-member`, payload);
        return payload;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
})

export const removeMemberFromTask = createAsyncThunk('tasks/removeMemberFromTask', async (payload, thunkAPI) => {
    try {
        await instanceAxios8000.put(`/api/tasks/remove-member`, payload);
        return payload;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
})





