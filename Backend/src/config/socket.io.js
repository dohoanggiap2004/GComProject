require('dotenv').config();
const {handleSocket} = require("../app/controllers/apiController/SocketController");
const {verify} = require("jsonwebtoken");
const User = require("../app/models/User");
const {Server} = require("socket.io");
// config/socket.io.js
const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL, // URL của frontend
            methods: ["GET", "POST"],
            credentials: true,
            allowEIO3: true, // Cho phép Engine.IO version 3
            transports: ['websocket', 'polling'],
            upgrade: false,
            pingTimeout: 60000,
            pingInterval: 25000
        }
    });

    io.use(async (socket, next) => {
        try {
            const cookies = socket.handshake.headers.cookie
                ?.split(';')
                ?.reduce((acc, cookie) => {
                    const [key, value] = cookie.trim().split('=');
                    acc[key] = value;
                    return acc;
                }, {});

            const refreshToken = cookies?.refreshToken;

            if (!refreshToken) {
                return next(new Error('Authentication required'));
            }

            const decoded = verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            const user = await User.findById(decoded._id);

            if (!user) {
                return next(new Error('User not found'));
            }

            socket.userId = user._id;

            next();
        } catch (error) {
            return next(new Error('Authentication failed'));
        }
    });

    io.on('connection', (socket) => {
        // console.log('User connected:', socket.id);
        handleSocket(io, socket);
    });

    return io;
};

module.exports = initializeSocket;
