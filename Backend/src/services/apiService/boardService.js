const Task = require("../../app/models/Task");
const Board = require("../../app/models/Board");
const User = require("../../app/models/User");
const mongoose = require('mongoose');

const getBoardsService = async () => {
    return Board.find().lean();
};

// trả về board và member trong nó
const getBoardByIdService = async (boardId) => {
    const board = await Board.findById(boardId).lean();
    let users = [];

    if (!board?.members?.length) {
        return {
            board,
            users,
        };
    }

    const memberIds = board.members.map(member => member.memberId);
    const foundUsers = await User.find({ _id: { $in: memberIds } })
        .select('_id fullname email')
        .lean();

    users = board.members.map(member => {
        const user = foundUsers.find(u => u._id.toString() === member.memberId.toString());
        return {
            ...user,
            role: member.role
        };
    });

    return {
        board,
        users
    };
};


const getBoardByWorkspaceIdService = async (workspaceId) => {
    return Board.find({ workspaceId }).select('title background workspaceId').lean();
};

const getBoardByMemberIdService = async (memberId) => {
    return Board.find({ 'members.memberId': memberId })
        .select('title background workspaceId')
        .populate({
            path: 'workspaceId',
            select: 'name'
        })
        .lean();
};


const createBoardService = async (board) => {
    const newBoard = new Board(board);
    return await newBoard.save();
};

const updateBoardService = async (board) => {
    const { _id, ...updateFields } = board;
    await Board.findByIdAndUpdate(
        _id,
        { $set: updateFields },
        { new: true }
    );
    return getBoardByIdService(_id);
};

const removeMemberFromBoardService = async (boardId, userId) => {
    const board = await Board.findById(boardId);
    if (!board) {
        throw new Error('Board not found');
    }

    // Xóa userId khỏi board.members
    board.members = board.members.filter(member => member.memberId.toString() !== userId);

    // Lặp qua các lists và cards để xóa userId khỏi memberIds
    for (let list of board.lists) {
        for (let card of list.cards) {
            card.memberIds = card.memberIds.filter(id => id.toString() !== userId);
        }
    }

    await board.save();

    return getBoardByIdService(boardId);
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

const updateCardIndexService = async(info) => {
    const {boardId, sourceListId, destListId, sourceCardIndex, destCardIndex } = info;
    const board = await Board.findById(boardId);
    if (!board) {
        throw new Error("BoardItem not found");
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

const updateListIndexService = async(info) => {
    const {boardId, sourceIndex, destIndex } = info;
    const board = await Board.findById(boardId);
    if (!board) {
        throw new Error("BoardItem not found");
    }
    if (
        sourceIndex < 0 ||
        sourceIndex >= board.lists.length ||
        destIndex < 0 ||
        destIndex >= board.lists.length
    ) {
        throw new Error('Invalid source or destination index');
    }

    // Di chuyển list trong mảng lists
    const listToMove = board.lists[sourceIndex];
    board.lists.splice(sourceIndex, 1); // Xóa list khỏi vị trí cũ
    board.lists.splice(destIndex, 0, listToMove); // Chèn list vào vị trí mới

    // Lưu thay đổi
    await board.save();
    return board
}

const countBoardInWorkspaceService = async (userId, workspaceId) => {
    const user = await User.findById(userId).lean()
    if (user.service === 'premium'){
        return 'unlimited'
    }
    return Board.countDocuments({ "workspaceId": workspaceId })
}

module.exports = {
    getBoardsService,
    getBoardByIdService,
    getBoardByWorkspaceIdService,
    createBoardService,
    updateBoardService,
    deleteBoardService,
    updateCardIndexService,
    updateListIndexService,
    countBoardInWorkspaceService,
    removeMemberFromBoardService,
    getBoardByMemberIdService,
};
