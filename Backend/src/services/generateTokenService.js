const jwt = require('jsonwebtoken');
require('dotenv').config()
const generateAccessToken = (user) => {
    return jwt.sign({ _id: user._id, fullname: user.fullname, email: user.email, role: user.role}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '2h' });
};

const generateRefreshToken = (user) => {
    return jwt.sign({ _id: user._id, fullname: user.fullname, email: user.email, role: user.role }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
} 

module.exports = { generateAccessToken, generateRefreshToken }
