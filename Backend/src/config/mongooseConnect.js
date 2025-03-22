require('dotenv').config();
const mongoose = require('mongoose');

// Thay thế bằng connection string của bạn từ MongoDB Atlas
const uri = process.env.URL_MONGO_CONNECTION;

async function connectDB() {
    try {
        await mongoose.connect(uri);
        console.log("Connection has been established successfully!");
    } catch (error) {
        console.error("Unable to connect to the database:", error.message);
    }
}

module.exports = { connectDB };
