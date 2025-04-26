const mongoose = require('mongoose');
const Board = require("../../app/models/Board");
const Task = require("../../app/models/Task");
const Activity = require("../../app/models/Activity");

const getCardByIdWithTasksService = async (boardId, listId, cardId) => {
    const board = await Board.findOne(
        {
            _id: boardId,
            "lists._id": listId,
            "lists.cards._id": cardId
        },
        { "lists.$": 1 }
    )
        .populate({
            path: 'lists.cards.tasks',
            populate: {
                path: 'assignedTo',
                model: 'User',
                select: 'fullname email'
            }
        })
        .populate({
            path: 'lists.cards.memberIds',
            select: 'fullname email'
        })
        .lean();


    if (!board || board.lists.length === 0) {
        return null;
    }

    const [list] = board.lists;
    const card = list.cards.find(c => c._id.toString() === cardId);

    return card || null;
};


const createCardService = async (cardData) => {
    const {boardId, listId, ...cardFields} = cardData;

    // Tìm kiếm board dựa trên ID board
    const board = await Board.findById(boardId);
    if (!board) {
        throw new Error('BoardItem not found');
    }

    // Tìm kiếm list trong bảng list của board
    const list = board.lists.id(listId);
    if (!list) {
        throw new Error('List not found in board');
    }

    // Thêm trường tham chiếu listId cho card (tiện ích về lâu dài)
    const newCard = {...cardFields, listId};

    // Thêm card mới vào list đã chỉ định
    list.cards.push(newCard);

    // Lưu lại thông tin của board
    await board.save();

    // Trả về card vừa mới tạo
    return list.cards[list.cards.length - 1];
};

const  updateCardService = async (updateData) => {
    const {boardId, listId, _id, ...updateFields} = updateData;

    const board = await Board.findOneAndUpdate(
        {
            _id: boardId,
            'lists._id': listId,
            'lists.cards._id': _id
        },
        {
            $set: {
                'lists.$[list].cards.$[card].listId': listId,
                ...Object.keys(updateFields).reduce((acc, key) => {
                    acc[`lists.$[list].cards.$[card].${key}`] = updateFields[key];
                    return acc;
                }, {})
            }
        },
        {
            new: true,
            arrayFilters: [
                {'list._id': listId},
                {'card._id': _id}
            ]
        }
    );

    if (!board) {
        throw new Error('BoardItem, List or Card not found');
    }

    const updatedList = board.lists.id(listId);
    const updatedCard = updatedList?.cards.id(_id);

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
            {'lists.$': 1},
            {session}
        );

        if (!board) {
            throw new Error('BoardItem or List not found');
        }

        const list = board.lists.id(listId);
        const card = list.cards.id(cardId);

        if (!card) {
            throw new Error('Card not found');
        }

        const taskIds = card.tasks;

        if (taskIds && taskIds.length > 0) {
            await Task.deleteMany({_id: {$in: taskIds}}, {session});
        }

        await Activity.deleteMany({cardId}, {session});

        const updatedBoard = await Board.findOneAndUpdate(
            {
                _id: boardId,
                'lists._id': listId,
            },
            {
                $pull: {'lists.$.cards': {_id: cardId}}
            },
            {new: true, session}
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

const addMemberToCardService = async (boardId, listId, cardId, userId) => {
    const board = await Board.findOneAndUpdate(
        {
            _id: boardId,
            'lists._id': listId,
            'lists.cards._id': cardId,
        },
        {
            $addToSet: {
                'lists.$[list].cards.$[card].memberIds': userId,
            },
        },
        {
            new: true,
            arrayFilters: [
                { 'list._id': listId },
                { 'card._id': cardId },
            ],
        }
    )
        .populate({
            path: 'lists.cards.tasks',
            populate: {
                path: 'assignedTo',
                model: 'User',
                select: 'fullname email'
            }
        })
        .populate({
            path: 'lists.cards.memberIds',
            select: 'fullname email',
        })
        .lean();

    if (!board) {
        throw new Error('Board, List, or Card not found');
    }

    const updatedList = board.lists.find(list => list._id.toString() === listId);
    const updatedCard = updatedList?.cards.find(card => card._id.toString() === cardId);

    if (!updatedCard) {
        throw new Error('Card not found');
    }

    return updatedCard;
};

const removeMemberFromCardService = async (boardId, listId, cardId, userId ) => {
    const board = await Board.findOneAndUpdate(
        {
            _id: boardId,
            'lists._id': listId,
            'lists.cards._id': cardId
        },
        {
            $pull: {
                'lists.$[list].cards.$[card].memberIds': userId
            }
        },
        {
            new: true,
            arrayFilters: [
                { 'list._id': listId },
                { 'card._id': cardId }
            ]
        }
    )
        .populate({
            path: 'lists.cards.tasks',
            populate: {
                path: 'assignedTo',
                model: 'User',
                select: 'fullname email'
            }
        })
        .populate({
            path: 'lists.cards.memberIds',
            select: 'fullname email',
        })
        .lean();

    const updatedList = board.lists.find(list => list._id.toString() === listId);
    const updatedCard = updatedList?.cards.find(card => card._id.toString() === cardId);

    if (!board) {
        throw new Error('Board, List, or Card not found');
    }

    if (!updatedCard) {
        throw new Error('Card not found');
    }

    return updatedCard;
};

module.exports = {
    getCardByIdWithTasksService,
    createCardService,
    updateCardService,
    deleteCardService,
    addMemberToCardService,
    removeMemberFromCardService
};
