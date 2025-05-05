import {instanceAxios8000} from "../../config/axiosConfig";
import {createAsyncThunk} from "@reduxjs/toolkit";

export const getBoardByWorkspaceIds = createAsyncThunk('boards/getBoardByWorkspaceIds', async (payload, thunkAPI) => {
    try {
        const response = await instanceAxios8000.get(`/api/boards/workspace/${payload}`);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
})

export const getBoardByBoardId = createAsyncThunk('boards/getBoardByBoardId', async (payload, thunkAPI) => {
    try {
        const response = await instanceAxios8000.get(`/api/boards/${payload}`);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
})

//member là guest của workspace
export const getBoardByMemberId = createAsyncThunk('boards/getBoardByMemberId', async (payload, thunkAPI) => {
    try {
        const response = await instanceAxios8000.get(`/api/boards/board-guest`);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
})

export const createBoard = createAsyncThunk('boards/createBoard', async (payload, thunkAPI) => {
    try {
        const response = await instanceAxios8000.post('/api/boards', payload);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
})

export const updateBoard = createAsyncThunk('boards/updateBoard', async (payload, thunkAPI) => {
    try {
        const response = await instanceAxios8000.put('/api/boards', payload);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
})


export const removeMemberFromBoard = createAsyncThunk('boards/removeMemberFromBoard', async (payload, thunkAPI) => {
    try {
        const response = await instanceAxios8000.put('/api/boards/remove-member', payload);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
})

export const deleteBoard = createAsyncThunk('boards/deleteBoard', async (payload, thunkAPI) => {
    try {
        await instanceAxios8000.delete('/api/boards', {
            params: {
                _id: payload.boardId,
            }
        });
        return payload;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
})

//list action

export const createList = createAsyncThunk('lists/createList', async (payload, thunkAPI) => {
    try {
        const response = await instanceAxios8000.post('/api/lists', payload);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
})

export const updateList = createAsyncThunk('lists/updateList', async (payload, thunkAPI) => {
    try {
        const response = await instanceAxios8000.put('/api/lists', payload);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
})

export const deleteList = createAsyncThunk('lists/deleteList', async (payload, thunkAPI) => {
    try {
        await instanceAxios8000.delete('/api/lists', {
            params: {
                boardId: payload.boardId,
                listId: payload.listId,
            }
        });
        return payload
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
})

export const updateListIndex = createAsyncThunk('cards/updateListIndex', async (payload, thunkAPI) => {
    try {
        const response = await instanceAxios8000.put('/api/boards/re-list', payload);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
})


//card action
export const createCard = createAsyncThunk('cards/createCard', async (payload, thunkAPI) => {
    try {
        const response = await instanceAxios8000.post('/api/cards', payload);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
})

export const updateCard = createAsyncThunk('cards/updateCard', async (payload, thunkAPI) => {
    try {
        const response = await instanceAxios8000.put('/api/cards', payload);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
})

export const deleteCard = createAsyncThunk('cards/deleteCard', async (payload, thunkAPI) => {
    try {
        await instanceAxios8000.delete('/api/cards', {
            params: {
                boardId: payload.boardId,
                listId: payload.listId,
                cardId: payload.cardId,
            }
        });
        return payload;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
})

export const updateCardIndex = createAsyncThunk('cards/updateCardIndex', async (payload, thunkAPI) => {
    try {
        const response = await instanceAxios8000.put('/api/boards/re-card', payload);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
})





