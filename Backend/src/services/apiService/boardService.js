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
    return Board.findByIdAndUpdate(
        _id,
        { $set: updateFields },
        { new: true }
    );
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

const reorderCardService = async(info) => {
    console.log(info);
    const {boardId, sourceListId, destListId, sourceCardIndex, destCardIndex } = info;
    const board = await Board.findById(boardId);
    if (!board) {
        throw new Error("Board not found");
    }

    // Tìm list nguồn và list đích theo _id
    const sourceList = board.lists.id(sourceListId);
    const destList = board.lists.id(destListId);

    if (!sourceList || !destList) {
        throw new Error("List not found");
    }

    // Xử lý reorder
    if (sourceListId.toString() === destListId.toString()) {
        // Cập nhật sắp xếp lại card trong cùng 1 list
        const movedCard = sourceList.cards.splice(sourceCardIndex, 1)[0];
        sourceList.cards.splice(destCardIndex, 0, movedCard);
    } else {
        // Di chuyển card giữa 2 list khác nhau
        const movedCard = sourceList.cards.splice(sourceCardIndex, 1)[0];
        destList.cards.splice(destCardIndex, 0, movedCard);
    }

    // Lưu thay đổi
    await board.save();
    return board
}
module.exports = { getBoardsService, getBoardByIdService, getBoardByWorkspaceIdService,
    createBoardService, updateBoardService, deleteBoardService, reorderCardService };
