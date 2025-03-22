// reducers/productSlice.js
import {createSlice} from '@reduxjs/toolkit';
import {getBoardByBoardId, createBoard, updateBoard, deleteBoard, getBoardByWorkspaceId} from "../actions/boardAction";

const boardSlice = createSlice({
    initialState: {
        boards: [],
        board: null,
        loading: false,
        error: null,
    },
    name: 'boards',
    extraReducers: (builder) => {
        builder

            // get board by boardId
            .addCase(getBoardByBoardId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getBoardByBoardId.fulfilled, (state, action) => {
                state.loading = false;
                state.board = action.payload;
            })
            .addCase(getBoardByBoardId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })


            // get board by workspace
            .addCase(getBoardByWorkspaceId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getBoardByWorkspaceId.fulfilled, (state, action) => {
                state.loading = false;
                if (Array.isArray(action.payload) && action.payload.length > 0) {
                    const newBoards = action.payload.filter(
                        (board) => !state.boards.some((b) => b._id === board._id)
                    );
                    state.boards.push(...newBoards);
                }
            })

            .addCase(getBoardByWorkspaceId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // post board
            .addCase(createBoard.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createBoard.fulfilled, (state, action) => {
                state.loading = false;
                state.boards.push(action.payload);
            })
            .addCase(createBoard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // put board
            .addCase(updateBoard.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateBoard.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.boards.findIndex(board => board._id === action.payload._id);
                if (index > -1) {
                    state.boards[index] = action.payload;
                }
            })
            .addCase(updateBoard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // delete board
            .addCase(deleteBoard.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteBoard.fulfilled, (state, action) => {
                state.loading = false;
                state.boards = state.boards.filter(board => board._id !== action.payload._id);
            })
            .addCase(deleteBoard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default boardSlice.reducer;
