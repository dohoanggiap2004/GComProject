const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    boardId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Board',
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
})

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
