const Board = require('../../models/Board');
const Message = require('../../models/Message');
const User = require('../../models/User');
const Workspace = require('../../models/Workspace');
const mongoose = require('mongoose');

const handleSocket = (io, socket) => {
    // Tham gia phòng chat của board
    socket.on('joinBoard', async ( boardId ) => {
        try {
            // console.log('joinBoard', boardId)
            if (!socket.userId) {
                socket.emit('error', 'Authentication required');
                return;
            }

            const board = await Board.findById(boardId);

            if (!board) {
                socket.emit('error', 'Board not found');
                return;
            }

            const workspace = await Workspace.findById(board.workspaceId);
            if (!workspace) {
                socket.emit('error', 'Workspace not found');
                return;
            }

            // Kiểm tra quyền truy cập
            const isBoardMember = board.members.some(member =>
                member.memberId.toString() === socket.userId.toString()
            );
            const isWorkspaceMember = workspace.memberIds.includes(socket.userId);

            if (!isWorkspaceMember && !isBoardMember) {
                socket.emit('error', 'Access denied');
                return;
            }

            socket.join(boardId);
            // console.log(`User ${socket.userId} joined board ${boardId}`);

            // Lấy 50 tin nhắn gần nhất
            const messages = await Message.aggregate([
                {
                    $match: { boardId: new mongoose.Types.ObjectId(boardId) }
                },
                {
                    $sort: { createdAt: -1 }
                },
                {
                    $limit: 50
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'senderId',
                        foreignField: '_id',
                        pipeline: [
                            {
                                $project: {
                                    _id: 1,
                                    fullname: 1,
                                    email: 1
                                }
                            }
                        ],
                        as: 'sender'
                    }
                },
                {
                    $addFields: {
                        sender: { $arrayElemAt: ['$sender', 0] }
                    }
                },
                {
                    $sort: { createdAt: 1 } // Sắp xếp lại theo thứ tự cũ đến mới
                }
            ]);

            socket.emit('initialMessages', messages);

        } catch (error) {
            console.error('Error in joinBoard:', error);
            socket.emit('error', 'Server error');
        }
    });

    // Nhận và lưu tin nhắn
    socket.on('sendMessage', async ({ boardId, content }) => {
        try {
            if (!socket.userId) {
                socket.emit('error', 'Authentication required');
                return;
            }

            const board = await Board.findById(boardId);
            if (!board) {
                socket.emit('error', 'Board not found');
                return;
            }

            const workspace = await Workspace.findById(board.workspaceId);
            if (!workspace) {
                socket.emit('error', 'Workspace not found');
                return;
            }

            // Kiểm tra quyền truy cập
            const isBoardMember = board.members.some(member =>
                member.memberId.toString() === socket.userId.toString()
            );
            const isWorkspaceMember = workspace.memberIds.includes(socket.userId);

            if (!isWorkspaceMember && !isBoardMember) {
                socket.emit('error', 'Access denied');
                return;
            }

            const newMessage = new Message({
                boardId,
                senderId: socket.userId,
                content,
                createdAt: new Date()
            });
            await newMessage.save();

            // Lấy thông tin người gửi
            const sender = await User.findById(socket.userId, {
                _id: 1,
                fullname: 1,
                email: 1
            });

            // Gửi tin nhắn kèm thông tin người gửi cho tất cả client trong board
            io.to(boardId).emit('receiveMessage', {
                ...newMessage.toObject(),
                sender
            });

        } catch (error) {
            console.error('Error in sendMessage:', error);
            socket.emit('error', 'Server error');
        }
    });

    // Rời phòng
    socket.on('leaveBoard', (boardId) => {
        socket.leave(boardId);
        // console.log(`User ${socket.userId} left board ${boardId}`);
    });

    socket.on('disconnect', () => {
        // console.log('User disconnected:', {
        //     socketId: socket.id,
        //     userId: socket.userId
        // });
    });
};

module.exports = { handleSocket };
