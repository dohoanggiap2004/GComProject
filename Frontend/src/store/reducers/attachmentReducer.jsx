// reducers/productSlice.js
import {createSlice} from '@reduxjs/toolkit';
import {
    uploadAttachment,
    getAttachmentsByCardId,
    removeAttachment,
} from "../actions/attachmentAction.jsx";

const attachmentSlice = createSlice({
    initialState: {
        attachments: [],
        loading: false,
        error: null,
    },
    name: 'attachments',
    extraReducers: (builder) => {
        builder
            // get attachment by memberId
            .addCase(getAttachmentsByCardId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAttachmentsByCardId.fulfilled, (state, action) => {
                state.loading = false;
                state.attachments = action.payload;
            })
            .addCase(getAttachmentsByCardId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // upload attachment
            .addCase(uploadAttachment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(uploadAttachment.fulfilled, (state, action) => {
                state.loading = false;
                state.attachments.push(action.payload);
            })
            .addCase(uploadAttachment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // remove attachment
            .addCase(removeAttachment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeAttachment.fulfilled, (state, action) => {
                state.loading = false;
                state.attachments = state.attachments.filter(attachment => attachment._id !== action.payload);
            })
            .addCase(removeAttachment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })


    }
});

export default attachmentSlice.reducer;
