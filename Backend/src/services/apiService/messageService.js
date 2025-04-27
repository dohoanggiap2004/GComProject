const mongoose = require('mongoose');
const Board = require("../../app/models/Board");
const Workspace = require("../../app/models/Workspace");
const Message = require("../../app/models/Message");

const getBoardsForMessengerService = async (memberId) => {
    const workspaces = await Workspace.find({
        memberIds: memberId
    }).lean();

    const workspaceIds = workspaces.map(workspace => workspace._id);

    const boards = await Board.aggregate([
        {
            $match: {
                $or: [
                    { workspaceId: { $in: workspaceIds } },
                    { 'members.memberId': new mongoose.Types.ObjectId(memberId) }
                ]
            }
        },
        {
            $lookup: {
                from: 'workspaces',
                localField: 'workspaceId',
                foreignField: '_id',
                as: 'workspace'
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'members.memberId',
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
                as: 'memberDetails'
            }
        },
        {
            // Lấy tin nhắn cuối cùng của mỗi board
            $lookup: {
                from: 'messages',
                let: { boardId: '$_id' },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ['$boardId', '$$boardId'] }
                        }
                    },
                    { $sort: { createdAt: -1 } },
                    { $limit: 1 },
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'senderId',
                            foreignField: '_id',
                            pipeline: [
                                {
                                    $project: {
                                        _id: 1,
                                        fullname: 1
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
                    }
                ],
                as: 'lastMessage'
            }
        },
        {
            $addFields: {
                workspace: { $arrayElemAt: ['$workspace', 0] },
                lastMessage: { $arrayElemAt: ['$lastMessage', 0] }
            }
        },
        {
            $project: {
                _id: 1,
                title: 1,
                background: 1,
                workspaceName: '$workspace.name',
                members: {
                    $map: {
                        input: '$members',
                        as: 'member',
                        in: {
                            $mergeObjects: [
                                '$$member',
                                {
                                    userInfo: {
                                        $arrayElemAt: [
                                            {
                                                $filter: {
                                                    input: '$memberDetails',
                                                    cond: { $eq: ['$$this._id', '$$member.memberId'] }
                                                }
                                            },
                                            0
                                        ]
                                    }
                                }
                            ]
                        }
                    }
                },
                lastMessage: {
                    _id: '$lastMessage._id',
                    content: '$lastMessage.content',
                    createdAt: '$lastMessage.createdAt',
                    sender: '$lastMessage.sender'
                },
                createdAt: 1
            }
        },
        {
            $sort: { 'lastMessage.createdAt': -1 }  // Sắp xếp theo tin nhắn mới nhất
        }
    ]);

    return boards;

};


module.exports = {
    getBoardsForMessengerService
}
