// reducers/productSlice.js
import {createSlice} from '@reduxjs/toolkit';

import {
    getBoardWithMessages
} from "../actions/messageAction.jsx";

const messageSlice = createSlice({
    name: 'messages',
    initialState: {
        boardWithMessages: null,
        loading: false,
        error: null,
    },
    extraReducers: (builder) => {
        builder
            // get 1 message by workspace
            .addCase(getBoardWithMessages.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getBoardWithMessages.fulfilled, (state, action) => {
                state.loading = false;
                state.boardWithMessages = action.payload;
            })
            .addCase(getBoardWithMessages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
});

export default messageSlice.reducer;
