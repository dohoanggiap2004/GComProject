const Board = require("../../app/models/Board");
const Task = require("../../app/models/Task");
const mongoose = require('mongoose');

const getMemberQuantityInBoardService = async (_id) => {
    const board = await Board.findById(_id).lean();
    if (!board) {
        throw new Error('Board not found');
    }

    return board.members.length;
}

const getCardQuantityInBoardService = async (_id) => {
    const board = await Board.findById(_id);

    if (!board) {
        throw new Error('Board not found');
    }

    let totalCompletedCards = 0;
    let totalCards = 0;
    for (const list of board.lists) {
        totalCards += list.cards.length;
        for (const card of list.cards) {
            if(card.isCompleted) totalCompletedCards += 1;
        }
    }

    return {
        totalCards,
        totalCompletedCards,
    };
}

const getTaskQuantityInBoardService = async(_id) => {
    const result = await Board.aggregate([
        // Match board by id
        { $match: { _id: new mongoose.Types.ObjectId(_id) } },

        // Unwind lists array
        { $unwind: '$lists' },

        // Unwind cards array in lists
        { $unwind: '$lists.cards' },

        // Lookup để join với tasks collection
        {
            $lookup: {
                from: 'tasks',
                localField: 'lists.cards.tasks',
                foreignField: '_id',
                as: 'taskDetails'
            }
        },

        // Unwind taskDetails để có thể đếm theo isCompleted
        { $unwind: '$taskDetails' },

        // Group để đếm tổng số tasks và tasks đã hoàn thành
        {
            $group: {
                _id: '$_id',
                totalTasks: { $sum: 1 },
                totalCompletedTasks: {
                    $sum: { $cond: [{ $eq: ['$taskDetails.isCompleted', true] }, 1, 0] }
                }
            }
        }
    ]);

    // Nếu không có tasks hoặc board không tồn tại
    if (result.length === 0) {
        return {
            totalTasks: 0,
            totalCompletedTasks: 0
        };
    }

    return {
        totalTasks: result[0].totalTasks,
        totalCompletedTasks: result[0].totalCompletedTasks
    };
}

const getProductiveMembersService = async (_id) => {
    const result = await Task.aggregate([
        // First, lookup to get board information
        {
            $lookup: {
                from: 'boards',
                localField: '_id',
                foreignField: 'lists.cards.tasks',
                as: 'boardInfo'
            }
        },

        // Match tasks by boardId
        {
            $match: {
                'boardInfo._id': new mongoose.Types.ObjectId(_id)
            }
        },

        // Unwind assignedTo array to get individual assignments
        {
            $unwind: '$assignedTo'
        },

        // Lookup to get user information
        {
            $lookup: {
                from: 'users',
                localField: 'assignedTo',
                foreignField: '_id',
                as: 'userInfo'
            }
        },

        // Unwind userInfo to get individual user
        {
            $unwind: '$userInfo'
        },

        // Group by user and count tasks
        {
            $group: {
                _id: '$assignedTo',
                fullname: { $first: '$userInfo.fullname' },
                email: { $first: '$userInfo.email' },
                taskCount: { $sum: 1 }
            }
        },

        // Sort by task count in descending order
        {
            $sort: { taskCount: -1 }
        },

        // Limit to 10 results
        {
            $limit: 10
        },

        // Project the final output format
        {
            $project: {
                fullname: 1,
                email: 1,
                taskCount: 1
            }
        }
    ]);

    return result;
}

const getMonthlyProgressService = async (_id) => {
        const result = await Board.aggregate([
            // Match board by id
            { $match: { _id: new mongoose.Types.ObjectId(_id) } },

            // Unwind lists array
            { $unwind: '$lists' },

            // Unwind cards array
            { $unwind: '$lists.cards' },

            // Match only completed cards and cards that have completedAt
            {
                $match: {
                    'lists.cards.isCompleted': true,
                    'lists.cards.completedAt': { $exists: true }
                }
            },

            // Group by month and year
            {
                $group: {
                    _id: {
                        year: { $year: '$lists.cards.completedAt' },
                        month: { $month: '$lists.cards.completedAt' }
                    },
                    completedCards: { $sum: 1 }
                }
            },

            // Sort by year and month
            {
                $sort: {
                    '_id.year': -1,
                    '_id.month': -1
                }
            },

            // Format the output
            {
                $project: {
                    _id: 0,
                    month: '$_id.month',
                    year: '$_id.year',
                    completedCards: 1
                }
            }
        ]);

        return result;
}

const getTaskQuantityInListService = async (_id) => {
    const result = await Board.aggregate([
        // Match board by id
        { $match: { _id: new mongoose.Types.ObjectId(_id) } },

        // Unwind lists array
        { $unwind: '$lists' },

        // Unwind cards array
        { $unwind: '$lists.cards' },

        // Lookup to get task details
        {
            $lookup: {
                from: 'tasks',
                localField: 'lists.cards.tasks',
                foreignField: '_id',
                as: 'taskDetails'
            }
        },

        // Group by list
        {
            $group: {
                _id: {
                    listId: '$lists._id',
                    listTitle: '$lists.title'
                },
                totalTasks: { $sum: { $size: '$taskDetails' } },
                completedTasks: {
                    $sum: {
                        $size: {
                            $filter: {
                                input: '$taskDetails',
                                as: 'task',
                                cond: { $eq: ['$$task.isCompleted', true] }
                            }
                        }
                    }
                }
            }
        },

        // Format output
        {
            $project: {
                _id: 0,
                listId: '$_id.listId',
                listTitle: '$_id.listTitle',
                totalTasks: 1,
                completedTasks: 1,
            }
        },

        // Sort by listTitle
        { $sort: { listTitle: 1 } }
    ]);

    return result;
}

module.exports = {
    getMemberQuantityInBoardService,
    getCardQuantityInBoardService,
    getTaskQuantityInBoardService,
    getProductiveMembersService,
    getMonthlyProgressService,
    getTaskQuantityInListService,
};
