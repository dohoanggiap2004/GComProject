
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

        // Lấy tất cả board thuộc workspace này
        const boards = await Board.find({ workspaceId }).session(session);
        if (!boards.length) {
            await session.abortTransaction();
            session.endSession();
            return null; // Không tìm thấy board nào
        }

        // Lấy tất cả taskId từ các board → list → card → tasks
        const taskIds = boards.flatMap(board =>
            board.lists.flatMap(list =>
                list.cards.flatMap(card => card.tasks)
            )
        );

        // Xóa tất cả task liên quan
        if (taskIds.length) {
            await Task.deleteMany({ _id: { $in: taskIds } }, { session });
        }

        // Xóa tất cả board thuộc workspace
        await Board.deleteMany({ workspaceId }, { session });

        // Xóa workspace
        await Workspace.deleteOne({ _id: workspaceId }, { session });

        await session.commitTransaction();
        session.endSession();
        return { message: "Workspace và tất cả board liên quan đã bị xóa!" };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

module.exports = { getWorkspaceByMemberIdService,
    createWorkspaceService, updateWorkspaceService, deleteWorkspaceService, };
