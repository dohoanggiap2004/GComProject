// reducers/productSlice.js
import {createSlice} from '@reduxjs/toolkit';

import {
    getCardWithTask
} from "../actions/cardAction";

import {
    updateTask,
    createTask,
    deleteTask
} from '../actions/taskAction.js'

const cardSlice = createSlice({
    name: 'cards',
    initialState: {
        card: null,
        loading: false,
        error: null,
    },
    extraReducers: (builder) => {
        builder
            // get 1 card by workspace
            .addCase(getCardWithTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCardWithTask.fulfilled, (state, action) => {
                state.loading = false;
                state.card = action.payload;
            })
            .addCase(getCardWithTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // create task
            .addCase(createTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createTask.fulfilled, (state, action) => {
                state.loading = false;
                console.log('creating task', action.payload);
                state.card.tasks = [...state.card.tasks, action.payload];
            })
            .addCase(createTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // update task
            .addCase(updateTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.card.tasks.findIndex((t) => t._id === action.payload._id);
                if (index >= 0) {
                    state.card.tasks[index] = action.payload;
                }
            })
            .addCase(updateTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // get 1 card by workspace
            .addCase(deleteTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                state.loading = false;
                const { taskId } = action.payload;
                state.card.tasks = state.card.tasks.filter((t) => t._id !== taskId);
            })
            .addCase(deleteTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default cardSlice.reducer;
