// reducers/productSlice.js
import {createSlice} from '@reduxjs/toolkit';
import {
    getTaskQuantityInBoard,
    getCardQuantityInBoard,
    getProductiveMembers,
    getMemberQuantityInBoard,
    getTaskQuantityInList,
    getMonthlyProgress,
} from "../actions/statisticAction.jsx";

const userSlice = createSlice({
    initialState: {
        cardQuantity: {},
        taskQuantity: {},
        productiveMember: [],
        memberQuantity: null,
        taskQuantityInList: null,
        monthlyProgress: null,
        loading: false,
        error: null,
    },
    name: 'users',
    extraReducers: (builder) => {
        builder

            // get task quantity: total task and task done
            .addCase(getTaskQuantityInBoard.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getTaskQuantityInBoard.fulfilled, (state, action) => {
                state.loading = false;
                state.taskQuantity = action.payload;
            })
            .addCase(getTaskQuantityInBoard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // get card quantity: total card and card done
            .addCase(getCardQuantityInBoard.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCardQuantityInBoard.fulfilled, (state, action) => {
                state.loading = false;
                state.cardQuantity = action.payload;
            })
            .addCase(getCardQuantityInBoard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // get member quantity in board
            .addCase(getMemberQuantityInBoard.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMemberQuantityInBoard.fulfilled, (state, action) => {
                state.loading = false;
                state.memberQuantity = action.payload;
            })
            .addCase(getMemberQuantityInBoard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            //member in much task
            .addCase(getProductiveMembers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProductiveMembers.fulfilled, (state, action) => {
                state.loading = false;
                state.productiveMember = action.payload;
            })
            .addCase(getProductiveMembers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            //monthly progress
            .addCase(getMonthlyProgress.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMonthlyProgress.fulfilled, (state, action) => {
                state.loading = false;
                state.monthlyProgress = action.payload;
            })
            .addCase(getMonthlyProgress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            //task quantity in list
            .addCase(getTaskQuantityInList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getTaskQuantityInList.fulfilled, (state, action) => {
                state.loading = false;
                state.taskQuantityInList = action.payload;
            })
            .addCase(getTaskQuantityInList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    }
});

export default userSlice.reducer;
