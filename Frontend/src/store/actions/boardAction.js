import {instanceAxios8000} from "../../config/axiosConfig";
import {createAsyncThunk} from "@reduxjs/toolkit";

export const getBoardByWorkspaceIds = createAsyncThunk('boards/getBoardByWorkspaceIds', async (payload, thunkAPI) => {
    try {
        const response = await instanceAxios8000.get(`/api/boards/workspace/${payload}`);
        return response.data.data;
    } catch (error) {
        thunkAPI.rejectWithValue(error.response.data);
    }
})

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
        const response = await instanceAxios8000.get(`/api/boards/${payload}`);
        return response.data.data;
    } catch (error) {
        thunkAPI.rejectWithValue(error.response.data);
    }
})

export const createBoard = createAsyncThunk('boards/createBoard', async (payload, thunkAPI) => {
    try {
        const response = await instanceAxios8000.post('/api/boards', payload);
        console.log('check response', response.data.newBoard);
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
                _id: payload.boardId,
            }
        });
        return payload;
    } catch (error) {
        thunkAPI.rejectWithValue(error.response.data);
    }
})

//list action

export const createList = createAsyncThunk('lists/createList', async (payload, thunkAPI) => {
    try {
        const response = await instanceAxios8000.post('/api/lists', payload);
        console.log('check response', response.data.newList);
        return response.data.newList;
    } catch (error) {
        thunkAPI.rejectWithValue(error.response.data);
    }
})

export const updateList = createAsyncThunk('lists/updateList', async (payload, thunkAPI) => {
    try {
        const response = await instanceAxios8000.put('/api/lists', payload);
        return response.data.rowsEffected;
    } catch (error) {
        thunkAPI.rejectWithValue(error.response.data);
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
        thunkAPI.rejectWithValue(error.response.data);
    }
})

export const updateListIndex = createAsyncThunk('cards/updateListIndex', async (payload, thunkAPI) => {
    try {
        const response = await instanceAxios8000.put('/api/boards/re-list', payload);
        return response.data.data;
    } catch (error) {
        thunkAPI.rejectWithValue(error.response.data);
    }
})


//card action
export const createCard = createAsyncThunk('cards/createCard', async (payload, thunkAPI) => {
    try {
        const response = await instanceAxios8000.post('/api/cards', payload);
        return response.data.newCard;
    } catch (error) {
        thunkAPI.rejectWithValue(error.response.data);
    }
})

export const updateCard = createAsyncThunk('cards/updateCard', async (payload, thunkAPI) => {
    try {
        const response = await instanceAxios8000.put('/api/cards', payload);
        return response.data.rowsEffected;
    } catch (error) {
        thunkAPI.rejectWithValue(error.response.data);
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
        thunkAPI.rejectWithValue(error.response.data);
    }
})

export const updateCardIndex = createAsyncThunk('cards/updateCardIndex', async (payload, thunkAPI) => {
    try {
        const response = await instanceAxios8000.put('/api/boards/re-card', payload);
        return response.data.data;
    } catch (error) {
        thunkAPI.rejectWithValue(error.response.data);
    }
})





