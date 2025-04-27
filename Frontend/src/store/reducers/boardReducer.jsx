// reducers/productSlice.js
import {createSlice} from '@reduxjs/toolkit';

import {
    getBoardByBoardId,
    getBoardByWorkspaceIds,
    createBoard,
    updateBoard,
    deleteBoard,
    createCard,
    updateCard,
    deleteCard,
    updateCardIndex,
    createList,
    updateList,
    deleteList,
    updateListIndex,
    removeMemberFromBoard,
    getBoardByMemberId,
} from "../actions/boardAction.jsx";

const boardSlice = createSlice({
    name: 'boards',
    initialState: {
        boards: {},
        boardGuest: {},
        membersInBoard: [],
        board: null,
        loading: false,
        error: null,
    },
    extraReducers: (builder) => {
        builder

            // get board by boardId
            .addCase(getBoardByBoardId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getBoardByBoardId.fulfilled, (state, action) => {
                state.loading = false;
                state.board = action.payload.board;
                state.membersInBoard = action.payload.users;
            })
            .addCase(getBoardByBoardId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // get boarr guest by memberId
            .addCase(getBoardByMemberId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getBoardByMemberId.fulfilled, (state, action) => {
                state.loading = false;
                state.boardGuest = action.payload;
            })
            .addCase(getBoardByMemberId.rejected, (state, action) => {
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
                // const {workspaceId, board} = action.payload;
                // if (state.boards[workspaceId]) {
                //     const index = state.boards[workspaceId].findIndex(b => b._id === board._id);
                //     if (index > -1) {
                //         state.boards[workspaceId][index] = board;
                //     }
                // }
                state.membersInBoard = action.payload.users
            })
            .addCase(updateBoard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // put board
            .addCase(removeMemberFromBoard.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeMemberFromBoard.fulfilled, (state, action) => {
                state.loading = false;
                state.membersInBoard = action.payload.users
            })
            .addCase(removeMemberFromBoard.rejected, (state, action) => {
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

            // list reducers
            .addCase(createList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createList.fulfilled, (state, action) => {
                state.loading = false;
                const newList = action.payload;
                if (state.board) {
                    // Nếu board.lists là mảng
                    state.board.lists.push(newList);
                }
            })
            .addCase(createList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateList.fulfilled, (state, action) => {
                state.loading = false;
                const updatedList = action.payload;
                if (state.board && Array.isArray(state.board.lists)) {
                    const listIndex = state.board.lists.findIndex(list => list._id === updatedList._id);
                    if (listIndex !== -1) {
                        state.board.lists[listIndex] = updatedList;
                    }
                }
            })
            .addCase(updateList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteList.fulfilled, (state, action) => {
                state.loading = false;
                const { listId } = action.payload;
                if (state.board && Array.isArray(state.board.lists)) {
                    state.board.lists = state.board.lists.filter(list => list._id !== listId);
                }
            })
            .addCase(deleteList.rejected, (state) => {
                state.loading = false;
                state.error = 'Có lỗi khi xóa';
            })

            // card reducers
            .addCase(createCard.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCard.fulfilled, (state, action) => {
                state.loading = false;
                const newCard = action.payload;
                if (state.board && Array.isArray(state.board.lists)) {
                    const listIndex = state.board.lists.findIndex(list => list._id === newCard.listId);
                    if (listIndex !== -1) {
                        state.board.lists[listIndex].cards = [
                            ...state.board.lists[listIndex].cards,
                            newCard,
                        ];
                    }
                }
            })
            .addCase(createCard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateCard.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCard.fulfilled, (state, action) => {
                state.loading = false;
                const updatedCard = action.payload;
                const {listId, _id} = updatedCard;
                if (state.board && Array.isArray(state.board.lists)) {
                    const listIndex = state.board.lists.findIndex(list => list._id === listId);
                    if (listIndex !== -1) {
                        const cardIndex = state.board.lists[listIndex].cards.findIndex(card => card._id === _id);
                        if (cardIndex !== -1) {
                            state.board.lists[listIndex].cards[cardIndex] = updatedCard;
                        }
                    }
                }
            })
            .addCase(updateCard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteCard.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCard.fulfilled, (state, action) => {
                state.loading = false;
                const {listId, cardId} = action.payload;
                if (state.board && Array.isArray(state.board.lists)) {
                    const listIndex = state.board.lists.findIndex(list => list._id === listId);
                    if (listIndex !== -1) {
                        state.board.lists[listIndex].cards = state.board.lists[listIndex].cards.filter(card => card._id !== cardId);
                    }
                }
            })
            .addCase(deleteCard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(updateCardIndex.fulfilled, (state, action) => {
                state.loading = false
                state.board = action.payload;
            })
            .addCase(updateCardIndex.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(updateListIndex.fulfilled, (state, action) => {
                state.loading = false
                state.board = action.payload;
            })
            .addCase(updateListIndex.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default boardSlice.reducer;
