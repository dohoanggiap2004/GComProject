import {createSlice} from "@reduxjs/toolkit";
import {loginUser, loginGG, logoutUser, registerUser, setFalseRegister} from "../actions/authAction.jsx";
import {getUserInfo} from "../actions/userAction.jsx";

const initialState = {
    loading: false,
    isLoginUser: false,
    role: '',
    error: null,
    registerError: null,
    isRegister: false,
    userInfo: {},
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginUserSuccess(state) {
            state.loading = false;
            state.isLoginUser = true;
            state.role = 'user';
        },
    },
    extraReducers: (builder) => {
        builder
            // loginUser
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.isLoginUser = false;
                state.role = '';
            })
            .addCase(loginUser.fulfilled, (state) => {
                state.loading = false;
                state.isLoginUser = true;
                state.role = 'user';
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.isLoginUser = false;
                state.error = action.payload;
                state.role = '';
            })

            // loginGG
            .addCase(loginGG.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginGG.fulfilled, (state) => {
                state.loading = false;
                state.isLoginUser = true;
                state.role = 'user';
            })
            .addCase(loginGG.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.role = '';
            })

            // logoutUser
            .addCase(logoutUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.loading = false;
                state.isLoginUser = false;
                state.role = '';
                state.user = null;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // logoutUser
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.registerError = null;
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.loading = false;
                state.isRegister = true;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.registerError = action.payload;
            })

            //setFalseRegister
            .addCase(setFalseRegister.fulfilled, (state) => {
                state.isRegister = false;
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
    },
});

export const { loginUserSuccess } = authSlice.actions
export default authSlice.reducer;
