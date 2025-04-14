import {instanceAxios8000} from "../../config/axiosConfig";
import {createAsyncThunk} from "@reduxjs/toolkit";

export const getCardWithTask = createAsyncThunk('cards/getCardWithTask', async (payload, thunkAPI) => {
    try {
        const response = await instanceAxios8000.get(`/api/cards`, {
            params: {
                boardId: payload.boardId,
                listId: payload.listId,
                cardId: payload.cardId,
            }
        });
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
})





