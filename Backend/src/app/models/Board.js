const mongoose = require('mongoose');
const listSchema = require("./List");

const boardSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    workspaceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workspace',
        required: true,
    },
    visibility: {
        type: String,
        required: true,
    },
    background: {
        type: String,
    },
    userIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    lists: [listSchema],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Board = mongoose.model('Board', boardSchema);

module.exports = Board;
