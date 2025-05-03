
const Workspace = require("../../app/models/Workspace");
const mongoose = require('mongoose');
const Board = require("../../app/models/Board");
const Task = require("../../app/models/Task");
const User = require("../../app/models/User");
const {getBoardByWorkspaceIdService} = require("./boardService");

const getWorkspaceByMemberIdService = async (memberId) => {
    return Workspace.find({ memberIds: memberId })
        .select("_id name memberIds")
        .lean()
        .then(workspaces =>
            workspaces.map(workspace => ({
                _id: workspace._id,
                name: workspace.name,
                memberQuantity: workspace.memberIds.length,
                memberIds: workspace.memberIds
            }))
        );
};

const getWorkspaceByWorkspaceIdService = async (workspaceId) => {
    // Lấy workspace theo workspaceId
    const workspace = await Workspace.findById(workspaceId).lean()

    if (!workspace) {
        throw new Error('Workspace not found');
    }

    const memberIds = workspace.memberIds;
    const user = await User.find({ '_id': { $in: memberIds } }).select('_id fullname email').lean();
    const board = await getBoardByWorkspaceIdService(workspaceId);
    return {
        workspace,
        user,
        board
    };
};

//trả về tất cả member trong các board của workspace
const getMemberInBoardsByWorkspaceIdService = async (workspaceId) => {
    const workspace = await Workspace.findById(workspaceId).lean();
    if (!workspace) {
        throw new Error('Workspace not found');
    }

    const boards = await Board.find({ workspaceId })
        .populate({
            path: 'members.memberId',
            select: '_id fullname email'
        })
        .lean();

    const users = [];

    boards.forEach(board => {
        board.members.forEach(member => {
            const userId = member.memberId?._id?.toString();
            if (!userId) return;

            const existingUser = users.find(u => u.user._id.toString() === userId);

            const boardInfo = {
                _id: board._id,
                title: board.title,
                role: member.role
            };

            if (existingUser) {
                existingUser.boards.push(boardInfo);
            } else {
                users.push({
                    user: member.memberId,
                    boards: [boardInfo]
                });
            }
        });
    });

    return users;
};


const createWorkspaceService = async (workspace, memberId) => {

    const newWorkspace = new Workspace({
        ...workspace,
        memberIds: [memberId],
    });

    await newWorkspace.save();
    return {
        _id: newWorkspace._id,
        name: newWorkspace.name,
        memberQuantity: 1
    }
};


const updateWorkspaceService = async (workspace) => {
    const { _id, ...updateFields } = workspace;

    const updateWorkspace = await Workspace.findByIdAndUpdate(_id, updateFields, {new: true}).lean();
    const memberIds = updateWorkspace.memberIds;
    const user = await User.find({ '_id': { $in: memberIds } }).lean();
    return {
        workspace: updateWorkspace,
        user: user,
    }
};

const deleteWorkspaceService = async (workspaceId) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        // Kiểm tra xem Workspace có tồn tại không
        const workspace = await Workspace.findById(workspaceId).session(session);
        if (!workspace) {
            await session.abortTransaction();
            session.endSession();
            throw new Error("Workspace không tồn tại");
        }

        // Tìm tất cả Boards thuộc Workspace
        const boards = await Board.find({ workspaceId }).session(session);

        // Nếu không có Boards, xóa Workspace ngay
        if (!boards.length) {
            await Workspace.deleteOne({ _id: workspaceId }, { session });
            await session.commitTransaction();
            session.endSession();
            return {
                error: 0,
                message: "Workspace đã được xóa thành công (không có Boards)",
            };
        }

        // Lấy tất cả taskId từ các board → list → card → tasks
        const taskIds = boards.flatMap(board =>
            board.lists.flatMap(list =>
                list.cards.flatMap(card => card.tasks)
            )
        );

        // Xóa tất cả Tasks liên quan
        if (taskIds.length) {
            const taskDeleteResult = await Task.deleteMany(
                { _id: { $in: taskIds } },
                { session }
            );
            // console.log(`Đã xóa ${taskDeleteResult.deletedCount} tasks`);
        }

        // Xóa tất cả Boards thuộc Workspace
        const boardDeleteResult = await Board.deleteMany(
            { workspaceId },
            { session }
        );
        // console.log(`Đã xóa ${boardDeleteResult.deletedCount} boards`);

        // Xóa Workspace
        await Workspace.deleteOne({ _id: workspaceId }, { session });

        // Commit transaction
        await session.commitTransaction();
        session.endSession();
        return {
            error: 0,
            message: "Workspace và các tài nguyên liên quan đã được xóa thành công",
        };
    } catch (error) {
        // Rollback transaction nếu có lỗi
        await session.abortTransaction();
        session.endSession();
        console.error("Lỗi khi xóa Workspace:", error.message);
        throw new Error(`Không thể xóa Workspace: ${error.message}`);
    }
};

module.exports = { getWorkspaceByMemberIdService, getWorkspaceByWorkspaceIdService, getMemberInBoardsByWorkspaceIdService,
    createWorkspaceService, updateWorkspaceService, deleteWorkspaceService, };
