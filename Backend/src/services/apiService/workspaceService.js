
const Workspace = require("../../app/models/Workspace");
const mongoose = require('mongoose');
const Board = require("../../app/models/Board");
const Task = require("../../app/models/Task");

const getWorkspaceByMemberIdService = async (memberId) => {
    return Workspace.find({ memberIds: memberId })
        .select("_id name memberIds")
        .lean()
        .then(workspaces =>
            workspaces.map(workspace => ({
                _id: workspace._id,
                name: workspace.name,
                memberQuantity: workspace.memberIds.length
            }))
        );
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
    return Workspace.findByIdAndUpdate(_id, updateFields, {new: true});
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
            console.log(`Đã xóa ${taskDeleteResult.deletedCount} tasks`);
        }

        // Xóa tất cả Boards thuộc Workspace
        const boardDeleteResult = await Board.deleteMany(
            { workspaceId },
            { session }
        );
        console.log(`Đã xóa ${boardDeleteResult.deletedCount} boards`);

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

module.exports = deleteWorkspaceService;

module.exports = { getWorkspaceByMemberIdService,
    createWorkspaceService, updateWorkspaceService, deleteWorkspaceService, };
