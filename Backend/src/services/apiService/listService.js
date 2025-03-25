
const Board = require("../../app/models/Board");

const getListByBoardIdService = async (boardId) => {
    const result = await Board.findById(boardId).select('lists');
    return result ? result.lists : [];
};

const createListService = async (listData) => {
    const { boardId, ...listFields } = listData;
    const board = await Board.findById(boardId);
    if (!board) {
        throw new Error('Board not found');
    }

    board.lists.push(listData);
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
        throw new Error('Board or List not found');
    }

    return updatedBoard.lists.find(list => list._id.toString() === _id);
};

const deleteListService = async (boardId, listId) => {
    const updatedBoard = await Board.findByIdAndUpdate(
        boardId,
        { $pull: { lists: { _id: listId } } },
        { new: true }
    );

    if (!updatedBoard) {
        throw new Error('Board not found');
    }

    return updatedBoard;
};

module.exports = { getListByBoardIdService, createListService, updateListService, deleteListService, };
