import {instanceAxios8000} from "../../config/axiosConfig";
import {createAsyncThunk} from "@reduxjs/toolkit";

export const createTask = createAsyncThunk('tasks/createTask', async (payload, thunkAPI) => {
    try {
        const response = await instanceAxios8000.post(`/api/tasks`, payload);
        return response.data.newTask;
    } catch (error) {
        thunkAPI.rejectWithValue(error.response.data);
    }
})

export const updateTask = createAsyncThunk('tasks/updateTask', async (payload, thunkAPI) => {
    try {
        const response = await instanceAxios8000.put(`/api/tasks`, payload);
        return response.data.rowsEffected;
    } catch (error) {
        thunkAPI.rejectWithValue(error.response.data);
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
        thunkAPI.rejectWithValue(error.response.data);
    }
})





