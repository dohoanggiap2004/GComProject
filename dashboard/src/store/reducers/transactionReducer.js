// reducers/productSlice.js
import {createSlice} from '@reduxjs/toolkit';
import {getTransactions, createTransaction, updateTransaction, deleteTransaction} from "../actions/transactionAction";

const transactionSlice = createSlice({
    name: 'transactions',
    initialState: {
        transactions: [],
        loading: false,
        error: null,
    },
    extraReducers: (builder) => {
        builder
            //get transactions
            .addCase(getTransactions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getTransactions.fulfilled, (state, action) => {
                state.loading = false;
                state.transactions = action.payload;
            })
            .addCase(getTransactions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            //post transaction
            .addCase(createTransaction.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createTransaction.fulfilled, (state, action) => {
                state.loading = false;
                state.transactions.push(action.payload);
            })
            .addCase(createTransaction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            //put transaction
            .addCase(updateTransaction.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateTransaction.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.transactions.findIndex(transaction => transaction._id === action.payload._id);
                if (index > -1) {
                    state.transactions[index] = action.payload;
                }
            })
            .addCase(updateTransaction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            //delete transaction
            .addCase(deleteTransaction.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteTransaction.fulfilled, (state, action) => {
                state.loading = false;
                state.transactions = state.transactions.filter(transaction => transaction._id !== action.payload._id);
            })
            .addCase(deleteTransaction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default transactionSlice.reducer;
