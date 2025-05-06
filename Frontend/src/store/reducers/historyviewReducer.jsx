// reducers/productSlice.js
import {createSlice} from '@reduxjs/toolkit';
import {
    getHistoryViewsByUserId,
    createHistoryView,
    // updateHistoryView,
} from "../actions/historyviewAction.jsx";

const historyviewSlice = createSlice({
    initialState: {
        boardViewed: [],
        loading: false,
        error: null,
    },
    name: 'historyviews',
    extraReducers: (builder) => {
        builder
            // get historyview by userId
            .addCase(getHistoryViewsByUserId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getHistoryViewsByUserId.fulfilled, (state, action) => {
                state.loading = false;
                state.boardViewed = action.payload;
            })
            .addCase(getHistoryViewsByUserId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // create and update historyview
            .addCase(createHistoryView.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createHistoryView.fulfilled, (state, action) => {
                state.loading = false;
                state.boardViewed = action.payload;
            })
            .addCase(createHistoryView.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // remove historyview
            // .addCase(updateHistoryView.pending, (state) => {
            //     state.loading = true;
            //     state.error = null;
            // })
            // .addCase(updateHistoryView.fulfilled, (state, action) => {
            //     state.loading = false;
            //     state.boardViewed = action.payload;
            // })
            // .addCase(updateHistoryView.rejected, (state, action) => {
            //     state.loading = false;
            //     state.error = action.payload;
            // })
    }
});

export default historyviewSlice.reducer;
