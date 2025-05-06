const mongoose = require('mongoose');

const historyViewSchema = new mongoose.Schema({
    boardIds:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Board',
        required: true,
    }],
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
})

const HistoryView = mongoose.model('HistoryView', historyViewSchema);
module.exports = HistoryView;
