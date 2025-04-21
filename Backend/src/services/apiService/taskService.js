const mongoose = require('mongoose');
const Task = require("../../app/models/Task");
const Board = require("../../app/models/Board");
const {getCardByIdWithTasksService} = require("./cardService");
// const getTaskByTaskIdService = async (boardId) => {
//     const result = await Task.findById(boardId).select('lists');
//     return result ? result.lists : [];
// };

async function createTaskService(boardId, listId, cardId, taskData) {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        // Tạo Task mới
        const newTask = new Task(taskData);
        await newTask.save({ session });

        // Thêm task _id vào mảng tasks của card
        const updatedCard = await Board.updateOne(
            {
                _id: boardId,
                "lists._id": listId,
                "lists.cards._id": cardId
            },
            {
                $push: { "lists.$[list].cards.$[card].tasks": newTask._id }
            },
            {
                arrayFilters: [{ "list._id": listId }, { "card._id": cardId }],
                session,
            }
        );

        if (updatedCard.modifiedCount === 0) {
            throw new Error('Could not add Task ID to Card');
        }

        await session.commitTransaction();
        session.endSession();

        return newTask;
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
}

const updateTaskService = async (updateData) => {
    const { _id, ...updateFields } = updateData;
    return Task.findByIdAndUpdate(_id, updateFields, {new: true});
};

const deleteTaskService = async (boardId, listId, cardId, taskId) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        // 1. Xóa Task
        const deletedTask = await Task.deleteOne({ _id: taskId }).session(session);
        if (deletedTask.deletedCount === 0) {
            throw new Error('Task không tồn tại');
        }

        // 2. Xóa taskId khỏi mảng tasks trong Card
        const updatedBoard = await Board.updateOne(
            {
                _id: boardId,
                'lists._id': listId,
                'lists.cards._id': cardId,
            },
            {
                $pull: { 'lists.$[list].cards.$[card].tasks': taskId },
            },
            {
                arrayFilters: [{ 'list._id': listId }, { 'card._id': cardId }],
                session,
            }
        );

        // Nếu không cập nhật gì, rollback lại để tránh lỗi mất đồng bộ
        if (updatedBoard.modifiedCount === 0) {
            throw new Error('TaskId không tồn tại trong Card hoặc không thể xóa');
        }

        // Commit transaction nếu không có lỗi
        await session.commitTransaction();
        return await getCardByIdWithTasksService(boardId, listId, cardId)
    } catch (error) {
        // Rollback khi gặp lỗi
        await session.abortTransaction();
        throw error;
    } finally {
        // Kết thúc session trong cả hai trường hợp thành công hoặc thất bại
        session.endSession();
    }
};

const addMemberToTaskService = async (taskId, userId) => {
    return Task.findByIdAndUpdate(
        taskId,
        { $addToSet: { assignedTo: userId } },
        { new: true }
    ).lean()
}

const removeMemberFromTaskService = async (taskId, userId) => {
    return Task.findByIdAndUpdate(
        taskId,
        { $pull: { assignedTo: userId } },
        { new: true }
    ).lean()
}

module.exports = {  createTaskService, updateTaskService, deleteTaskService, addMemberToTaskService, removeMemberFromTaskService };
