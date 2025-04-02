
const mongoose = require('mongoose');
const taskSchema = require('./Task');

const cardSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    label: {
        type: String,
    },
    listId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    dueDate: {
        type: Date,
    },
    startDate: {
        type: Date,
    },
    dateReminder: {
        type: Date,
    },
    memberIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    isCompleted: {
        type: Boolean,
        default: false,
    },
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
    }],
});

module.exports = cardSchema;
