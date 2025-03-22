const Task = require("../../app/models/Task");
const Board = require("../../app/models/Board");
const mongoose = require('mongoose');

const getBoardsService = async () => {
    return Board.find();
};

const getBoardByIdService = async (boardId) => {
    return Board.findById(boardId);
};

const getBoardByWorkspaceIdService = async (workspaceId) => {
    return Board.find({ workspaceId });
};

const createBoardService = async (board) => {
    console.log('checkboard', board);
    const newBoard = new Board(board);
    return await newBoard.save();
};

const updateBoardService = async (board) => {
    const { _id, ...updateFields } = board;
    return Board.findByIdAndUpdate(_id, updateFields, {new: true});
};

const deleteBoardService = async (boardId) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        const board = await Board.findById(boardId).session(session);
        if (!board) {
            await session.abortTransaction();
            session.endSession();
            return null; // không tìm thấy board
        }

        const taskIds = board.lists
            .flatMap(list => list.cards)
            .flatMap(card => card.tasks);

        if (taskIds.length) {
            await Task.deleteMany({ _id: { $in: taskIds } }, { session });
        }

        await Board.deleteOne({ _id: boardId }, { session });

        await session.commitTransaction();
        session.endSession();

        return board;
    } catch (error) {
        // Khi có bất kỳ lỗi nào → rollback
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};
module.exports = { getBoardsService, getBoardByIdService, getBoardByWorkspaceIdService,
    createBoardService, updateBoardService, deleteBoardService, };
