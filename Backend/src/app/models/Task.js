
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    isCompleted: {
        type: Boolean,
        default: false,
    },
    assignedTo: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    }],
    dueDate: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
