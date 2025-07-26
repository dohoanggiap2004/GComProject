import {createSlice} from "@reduxjs/toolkit";
import {
    getUserQuantity,
    getRevenue,
    getMonthlyRevenue,
    getWorkspaceQuantity
} from "../actions/dashboardAction";

const initialState = {
    userQuantity: '',
    workspaceQuantity: '',
    revenue: '',
    monthlyRevenue: [],
    loading: false,
    error: null,
}

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(getUserQuantity.fulfilled, (state, action) => {
                    state.userQuantity = action.payload
                    state.loading = false;
                    state.error = null;
                }
            )

            .addCase(getRevenue.fulfilled, (state, action) => {
                state.revenue = action.payload
                state.loading = false;
                state.error = null;
            })

            .addCase(getMonthlyRevenue.fulfilled, (state, action) => {
                state.monthlyRevenue = action.payload
                state.loading = false;
                state.error = null;
            })

            .addCase(getWorkspaceQuantity.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.workspaceQuantity = action.payload
            })

    }
})

export default dashboardSlice.reducer;
