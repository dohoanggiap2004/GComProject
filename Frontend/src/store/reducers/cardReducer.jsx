// reducers/productSlice.js
import {createSlice} from '@reduxjs/toolkit';

import {
    getCardWithTask,
    addMemberToCard,
    removeMemberFromCard,
} from "../actions/cardAction.jsx";

import {
    updateTask,
    createTask,
    deleteTask,
    addMemberToTask,
    removeMemberFromTask,

} from '../actions/taskAction.jsx'

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

            //add member
            .addCase(addMemberToCard.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addMemberToCard.fulfilled, (state, action) => {
                state.loading = false;
                state.card = action.payload;
            })
            .addCase(addMemberToCard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            //remove
            .addCase(removeMemberFromCard.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeMemberFromCard.fulfilled, (state, action) => {
                state.loading = false;
                state.card = action.payload;
            })
            .addCase(removeMemberFromCard.rejected, (state, action) => {
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
                const {taskId} = action.payload;
                state.card.tasks = state.card.tasks.filter((t) => t._id !== taskId);
            })
            .addCase(deleteTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // add member to task by userId, taskId
            .addCase(addMemberToTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addMemberToTask.fulfilled, (state, action) => {
                state.loading = false;
                const { taskId, userId, email, fullname } = action.payload;

                // Tìm task đúng
                const task = state.card.tasks.find(task => task._id === taskId);
                if (task) {
                    // Nếu chưa có user đó trong danh sách thì thêm
                    const alreadyExists = task.assignedTo.some(user => user._id === userId);
                    if (!alreadyExists) {
                        task.assignedTo.push({
                            _id: userId,
                            fullname,
                            email
                        });
                    }
                }
            })
            .addCase(addMemberToTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // remove member from task by userId, taskId
            .addCase(removeMemberFromTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeMemberFromTask.fulfilled, (state, action) => {
                state.loading = false;
                const { taskId, userId } = action.payload;

                const task = state.card.tasks.find(task => task._id === taskId);
                if (task) {
                    task.assignedTo = task.assignedTo.filter(user => user._id !== userId);
                }
            })
            .addCase(removeMemberFromTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default cardSlice.reducer;
