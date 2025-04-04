// reducers/productSlice.js
import {createSlice} from '@reduxjs/toolkit';
import { searchUser } from "../actions/userAction";

const userSlice = createSlice({
    initialState: {
        usersSearch: [],
        loading: false,
        error: null,
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

    }
});

export default userSlice.reducer;
