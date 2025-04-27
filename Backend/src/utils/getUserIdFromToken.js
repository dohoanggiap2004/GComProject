const jwt = require("jsonwebtoken");
const RefreshToken = require("../app/models/RefreshToken");

const getUserIdFromToken = async (req) => {
    const token = req.cookies.refreshToken;
    if (!token) return null;  // Trả về null nếu không có token

    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
            if (err) {
                await RefreshToken.deleteOne({ token: token });
                return reject("Refresh token expired, please log in again");
            }
            resolve(user._id);
        });
    });
}

module.exports = getUserIdFromToken;
