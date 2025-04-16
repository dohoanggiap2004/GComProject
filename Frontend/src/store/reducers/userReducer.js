// reducers/productSlice.js
import {createSlice} from '@reduxjs/toolkit';
import {
    searchUser,
    getUserRoleInWorkspaceOrBoard,
    getQuantityUserWorkspace,
    getUserInfo,

} from "../actions/userAction";

const userSlice = createSlice({
    initialState: {
        usersSearch: [],
        loading: false,
        error: null,
        role: '',
        userInfo: {},
        quantityWorkspace: null,
    },
    name: 'users',
    extraReducers: (builder) => {
        builder

            // get user by memberId
            .addCase(searchUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchUser.fulfilled, (state, action) => {
                state.loading = false;
                state.usersSearch = action.payload;
            })
            .addCase(searchUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // get user role in workspace or board
            .addCase(getUserRoleInWorkspaceOrBoard.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserRoleInWorkspaceOrBoard.fulfilled, (state, action) => {
                state.loading = false;
                state.role = action.payload;
            })
            .addCase(getUserRoleInWorkspaceOrBoard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // get user quantity workspace
            .addCase(getQuantityUserWorkspace.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getQuantityUserWorkspace.fulfilled, (state, action) => {
                state.loading = false;
                state.quantityWorkspace = action.payload;
            })
            .addCase(getQuantityUserWorkspace.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // get user info
            .addCase(getUserInfo.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserInfo.fulfilled, (state, action) => {
                state.loading = false;
                state.userInfo = action.payload;
            })
            .addCase(getUserInfo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    }
});

export default userSlice.reducer;
