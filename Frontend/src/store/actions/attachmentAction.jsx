import {instanceAxios8000, instanceAxiosFile8000} from "../../config/axiosConfig";
import {createAsyncThunk} from "@reduxjs/toolkit";

export const getAttachmentsByCardId = createAsyncThunk('attachments/getAttachmentsByCardId', async (payload, thunkAPI) => {
    try {
        const response = await instanceAxios8000.get(`/api/attachments/${payload}`);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
})


export const uploadAttachment = createAsyncThunk('attachments/uploadAttachment', async (payload, thunkAPI) => {
    try {
        const response = await instanceAxiosFile8000.post(`/api/attachments`, payload);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
})

export const removeAttachment = createAsyncThunk('attachments/removeAttachment', async (payload, thunkAPI) => {
    try {
        await instanceAxios8000.delete(`/api/attachments`, {
            params:{
                _id: payload,
            }
        });
        return payload;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
})




