// reducers/productSlice.js
import {createSlice} from '@reduxjs/toolkit';
import {
    getWorkspaceByMemberId,
    getWorkspaceByWorkspaceId,
    getMemberInBoardsByWorkspaceId,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
} from "../actions/workspaceAction.jsx";

const workspaceSlice = createSlice({
    initialState: {
        workspaces: [],
        workspace: null,
        member: [],
        membersInBoards: [],
        board: null,
        loading: false,
        error: null,
    },
    name: 'workspaces',
    extraReducers: (builder) => {
        builder

            // get workspace by memberId
            .addCase(getWorkspaceByMemberId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getWorkspaceByMemberId.fulfilled, (state, action) => {
                state.loading = false;
                state.workspaces = action.payload;
            })
            .addCase(getWorkspaceByMemberId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // get workspace by memberId
            .addCase(getWorkspaceByWorkspaceId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getWorkspaceByWorkspaceId.fulfilled, (state, action) => {
                state.loading = false;
                state.workspace = action.payload.workspace;
                state.member = action.payload.user;
                state.board = action.payload.board;
            })
            .addCase(getWorkspaceByWorkspaceId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // get all member in all board in workspace
            .addCase(getMemberInBoardsByWorkspaceId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMemberInBoardsByWorkspaceId.fulfilled, (state, action) => {
                state.loading = false;
                state.membersInBoards = action.payload.users;
            })
            .addCase(getMemberInBoardsByWorkspaceId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // post workspace
            .addCase(createWorkspace.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createWorkspace.fulfilled, (state, action) => {
                state.loading = false;
                state.workspaces.push(action.payload);
            })
            .addCase(createWorkspace.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // put workspace
            .addCase(updateWorkspace.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateWorkspace.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.workspaces.findIndex(workspace => workspace._id === action.payload.workspace._id);
                if (index > -1) {
                    state.workspaces[index] = action.payload.workspace;
                }
                if (state.workspace._id === action.payload.workspace._id){
                    state.workspace = action.payload.workspace
                    state.member = action.payload.user
                }
            })
            .addCase(updateWorkspace.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // delete workspace
            .addCase(deleteWorkspace.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteWorkspace.fulfilled, (state, action) => {
                state.loading = false;
                state.workspaces = state.workspaces.filter(workspace => workspace._id !== action.payload);
            })
            .addCase(deleteWorkspace.rejected, (state) => {
                state.loading = false;
                state.error = 'Lỗi khi xóa';
            });
    }
});

export default workspaceSlice.reducer;
