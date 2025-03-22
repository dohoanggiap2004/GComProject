// models/List.js
const mongoose = require('mongoose');
const cardSchema = require('./Card');

const listSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    cards: [cardSchema],
});

module.exports = listSchema;
