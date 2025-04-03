
const Board = require("../../app/models/Board");
const Task = require("../../app/models/Task");

const createListService = async (listData) => {
    const { boardId, ...listFields } = listData;
    const board = await Board.findById(boardId);
    if (!board) {
        throw new Error('BoardItem not found');
    }

    board.lists.push(listFields);
    await board.save();

    return board.lists[board.lists.length - 1];
};

const updateListService = async (updateData) => {
    const { boardId, _id, ...updateFields } = updateData;

    const updatedBoard = await Board.findOneAndUpdate(
        { _id: boardId, 'lists._id': _id },
        {
            $set: Object.keys(updateFields).reduce((acc, key) => {
                acc[`lists.$.${key}`] = updateFields[key];
                return acc;
            }, {})
        },
        { new: true }
    );

    if (!updatedBoard) {
        throw new Error('BoardItem or List not found');
    }

    return updatedBoard.lists.find(list => list._id.toString() === _id);
};

const deleteListService = async (boardId, listId) => {
    const board = await Board.findById(boardId);
    if (!board) {
        throw new Error("BoardItem not found");
    }

    // Tìm list cần xóa
    const list = board.lists.find(list => list._id.toString() === listId);
    if (!list) {
        throw new Error("List not found");
    }

    // Lấy danh sách cardId trong list
    const cardIds = list.cards.map(card => card._id);

    // Xóa tất cả tasks liên quan đến cardIds
    await Task.deleteMany({ cardId: { $in: cardIds } });

    // Xóa list khỏi board
    const updatedBoard = await Board.findByIdAndUpdate(
        boardId,
        { $pull: { lists: { _id: listId } } },
        { new: true }
    );

    return updatedBoard;
};


module.exports = { createListService, updateListService, deleteListService, };
