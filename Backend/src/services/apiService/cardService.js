const mongoose = require('mongoose');
const Board = require("../../app/models/Board");
const Task = require("../../app/models/Task");
const Activity = require("../../app/models/Activity");

const getCardByIdWithTasksService = async (boardId, listId, cardId) => {
    // Query lấy đúng card và populate tasks bên trong card đó
    const board = await Board.findOne(
        {
            _id: boardId,
            "lists._id": listId,
            "lists.cards._id": cardId
        },
        { "lists.$": 1 } // Chỉ lấy ra đúng list thoả mãn điều kiện
    )
        .populate({
            path: 'lists.cards.tasks', // Đường dẫn đến các task trong card
        });

    if (!board || board.lists.length === 0) {
        return null;
    }

    // Tìm đúng list
    const [list] = board.lists;

    // Tìm đúng card trong list
    const card = list.cards.find(c => c._id.toString() === cardId);

    // Sau khi populate, card.tasks sẽ là mảng objects (details của task)
    return card || null;
};

const createCardService = async (cardData) => {
    const { boardId, listId, ...cardFields } = cardData;
    console.log('cardData', cardData)
    // Tìm kiếm board dựa trên ID board
    const board = await Board.findById(boardId);
    if (!board) {
        throw new Error('Board not found');
    }

    // Tìm kiếm list trong bảng list của board
    const list = board.lists.id(listId);
    if (!list) {
        throw new Error('List not found in board');
    }

    // Thêm trường tham chiếu listId cho card (tiện ích về lâu dài)
    const newCard = { ...cardFields, listId };

    // Thêm card mới vào list đã chỉ định
    list.cards.push(newCard);

    // Lưu lại thông tin của board
    await board.save();

    // Trả về card vừa mới tạo
    return list.cards[list.cards.length - 1];
};

const updateCardService = async (updateData) => {
    const { boardId, listId, cardId, ...updateFields } = updateData;

    const board = await Board.findOneAndUpdate(
        {
            _id: boardId,
            'lists._id': listId,
            'lists.cards._id': cardId
        },
        {
            $set: {
                'lists.$[list].cards.$[card]': {
                    _id: cardId,
                    listId,
                    ...updateFields
                }
            }
        },
        {
            new: true, // Trả lại document đã cập nhật
            arrayFilters: [
                { 'list._id': listId },
                { 'card._id': cardId }
            ]
        }
    );

    if (!board) {
        throw new Error('Board, List or Card not found');
    }

    // Trả về card vừa cập nhật (cho frontend sử dụng)
    const updatedList = board.lists.id(listId);
    const updatedCard = updatedList?.cards.id(cardId);

    return updatedCard;
};

const deleteCardService = async (boardId, listId, cardId) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const board = await Board.findOne(
            {
                _id: boardId,
                'lists._id': listId,
                'lists.cards._id': cardId
            },
            { 'lists.$': 1 },
            { session }
        );

        if (!board) {
            throw new Error('Board or List not found');
        }

        const list = board.lists.id(listId);
        const card = list.cards.id(cardId);

        if (!card) {
            throw new Error('Card not found');
        }

        const taskIds = card.tasks;

        if (taskIds && taskIds.length > 0) {
            await Task.deleteMany({ _id: { $in: taskIds } }, { session });
        }

        await Activity.deleteMany({ cardId }, { session });

        const updatedBoard = await Board.findOneAndUpdate(
            {
                _id: boardId,
                'lists._id': listId,
            },
            {
                $pull: { 'lists.$.cards': { _id: cardId } }
            },
            { new: true, session }
        );

        if (!updatedBoard) {
            throw new Error('Could not remove card from list');
        }

        await session.commitTransaction();
        session.endSession();

        return updatedBoard;

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};
module.exports = { getCardByIdWithTasksService, createCardService, updateCardService, deleteCardService, };
