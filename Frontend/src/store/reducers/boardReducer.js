// reducers/productSlice.js
import {createSlice} from '@reduxjs/toolkit';
import {
    getBoardByBoardId,
    getBoardByWorkspaceIds,
    createBoard,
    updateBoard,
    deleteBoard,
    getBoardByWorkspaceId
} from "../actions/boardAction";

const boardSlice = createSlice({
    initialState: {
        boards: [],
        boardTitle: [],
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


            // get boards by workspace
            .addCase(getBoardByWorkspaceIds.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getBoardByWorkspaceIds.fulfilled, (state, action) => {
                state.loading = false;

                if (Array.isArray(action.payload) && action.payload.length > 0) {
                    const boardsByWorkspace = {...state.boards};

                    action.payload.forEach((board) => {
                        const {workspaceId, _id} = board;

                        if (!boardsByWorkspace[workspaceId]) {
                            boardsByWorkspace[workspaceId] = [];
                        }

                        // Tránh trùng lặp board
                        if (!boardsByWorkspace[workspaceId].some(b => b._id === _id)) {
                            boardsByWorkspace[workspaceId].push(board);
                        }
                    });

                    state.boards = boardsByWorkspace;
                }
            })
            .addCase(getBoardByWorkspaceIds.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })


            // get 1board by workspace
            .addCase(getBoardByWorkspaceId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getBoardByWorkspaceId.fulfilled, (state, action) => {
                state.loading = false;
                if (Array.isArray(action.payload) && action.payload.length > 0) {
                    const newBoards = action.payload.filter(
                        (board) => !state.boardTitle.some((b) => b._id === board._id)
                    );
                    state.boardTitle.push(...newBoards);
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
                const {workspaceId, ...board} = action.payload;

                if (!state.boards[workspaceId]) {
                    state.boards[workspaceId] = [];
                }

                state.boards[workspaceId].push(board);
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
                const {workspaceId, board} = action.payload;

                if (state.boards[workspaceId]) {
                    const index = state.boards[workspaceId].findIndex(b => b._id === board._id);
                    if (index > -1) {
                        state.boards[workspaceId][index] = board;
                    }
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
                const {workspaceId, boardId} = action.payload;

                if (state.boards[workspaceId]) {
                    state.boards[workspaceId] = state.boards[workspaceId].filter(b => b._id !== boardId);
                }
            })
            .addCase(deleteBoard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Cập nhật trạng thái hoàn thành của card
            // .addCase(toggleCardCompletion.fulfilled, (state, action) => {
            //     const {cardId, isCompleted} = action.payload;
            //     if (state.board && state.board.lists) {
            //         for (const listId in state.board.lists) {
            //             const list = state.board.lists[listId];
            //             const cardIndex = list.cards.findIndex(card => card._id === cardId);
            //             if (cardIndex !== -1) {
            //                 list.cards[cardIndex].isCompleted = isCompleted;
            //                 break;
            //             }
            //         }
            //     }
            // })
            //
            // // Di chuyển card
            // .addCase(moveCard.fulfilled, (state, action) => {
            //     const {cardId, newListId, newIndex} = action.payload;
            //     if (state.board && state.board.lists) {
            //         let sourceListId = null;
            //         let movedCard = null;
            //
            //         // Tìm list nguồn và card
            //         for (const listId in state.board.lists) {
            //             const list = state.board.lists[listId];
            //             const cardIndex = list.cards.findIndex(card => card._id === cardId);
            //             if (cardIndex !== -1) {
            //                 sourceListId = listId;
            //                 movedCard = list.cards[cardIndex];
            //                 list.cards.splice(cardIndex, 1);
            //                 break;
            //             }
            //         }
            //
            //         // Di chuyển card sang list mới
            //         if (sourceListId && movedCard && state.board.lists[newListId]) {
            //             state.board.lists[newListId].cards.splice(newIndex, 0, movedCard);
            //         }
            //     }
            // });

    }
});

export default boardSlice.reducer;
