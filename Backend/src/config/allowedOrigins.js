require('dotenv').config();

const allowedOrigins = [
    'https://www.google.com.vn',
    'http://localhost:3000',
    'http://localhost:3001',
    process.env.CLIENT_URL,
];

module.exports = allowedOrigins
