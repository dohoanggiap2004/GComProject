// reducers/productSlice.js
import {createSlice} from '@reduxjs/toolkit';
import {getWorkspaceByMemberId, createWorkspace, updateWorkspace, deleteWorkspace} from "../actions/workspaceAction";

const workspaceSlice = createSlice({
    initialState: {
        workspaces: [],
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
                const index = state.workspaces.findIndex(workspace => workspace._id === action.payload._id);
                if (index > -1) {
                    state.workspaces[index] = action.payload;
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
                state.workspaces = state.workspaces.filter(workspace => workspace._id !== action.payload._id);
            })
            .addCase(deleteWorkspace.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default workspaceSlice.reducer;
