import {createSlice} from "@reduxjs/toolkit";
import {loginUser, loginGG, logoutUser, registerUser, setFalseRegister} from "../actions/authAction.jsx";

const initialState = {
    user: null,
    loading: false,
    isLoginUser: false,
    role: '',
    error: null,
    isRegister: false
};

const authSlice = createSlice({
    name: "login",
    initialState,
    reducers: {
        loginUserSuccess(state, action) {
            console.log(action.payload);
            state.loading = false;
            state.isLoginUser = true;
            state.role = 'user';
            state.user = action.payload;
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
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.loading = false;
                state.isRegister = true;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            //setFalseRegister
            .addCase(setFalseRegister.fulfilled, (state) => {
                state.isRegister = false;
            })
    },
});

export const { loginUserSuccess } = authSlice.actions
export default authSlice.reducer;
