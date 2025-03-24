
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
    listId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    dueDate: {
        type: Date,
    },
    isCompleted: {
        type: Boolean,
        default: false,
    },
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task', // Tham chiếu đến Task thay vì nhúng
    }],
});

module.exports = cardSchema;
