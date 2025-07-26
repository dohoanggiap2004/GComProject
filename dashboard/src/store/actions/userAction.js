import {instanceAxios8000} from "../../config/axiosConfig";
import {createAsyncThunk} from "@reduxjs/toolkit";

export const getUsers = createAsyncThunk('users/fetchUsers', async (_, thunkAPI) => {
    try {
        const response = await instanceAxios8000.get('/api/users');
        return response.data.data;
    } catch (error) {
        thunkAPI.rejectWithValue(error.response.data);
    }
});

export const getUserByFullname = createAsyncThunk('users/fetchUserByFullname', async (payload, thunkAPI) => {
    try {
        const response = await instanceAxios8000.get(`/api/users/search`,{
            params: {
                fullname: payload,
            }
        });
        return response.data;
    } catch (error) {
        thunkAPI.rejectWithValue(error.response.data);
    }
})

export const createUser = createAsyncThunk('users/createUser', async (payload, thunkAPI) => {
    try {
        const response = await instanceAxios8000.post('/api/users', payload);
        return response.data;
    } catch (error) {
        thunkAPI.rejectWithValue(error.response.data);
    }
})

export const updateUser = createAsyncThunk('users/updateUser', async (payload, thunkAPI) => {
    try {
        const response = await instanceAxios8000.put(`/api/users`, payload);
        return payload;
    } catch (error) {
        thunkAPI.rejectWithValue(error.response.data);
    }
})

export const deleteUser = createAsyncThunk('users/deleteUser', async (payload, thunkAPI) => {
    try {
        const response = await instanceAxios8000.delete(`/api/users`, {
            params: {
                _id: payload._id
            }
        });
        return payload;
    } catch (error) {
        thunkAPI.rejectWithValue(error.response.data);
    }
})





