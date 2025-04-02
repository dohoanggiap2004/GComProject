// models/Activity.js
const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    cardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BoardItem.lists.cards', // Tham chiếu đến card nhúng
        required: true,
    },
    action: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;
