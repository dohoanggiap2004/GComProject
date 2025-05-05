const {
  createTaskService,
  updateTaskService,
  deleteTaskService,
  addMemberToTaskService,
  removeMemberFromTaskService,
} = require("../../../services/apiService/taskService");

class TaskController {

  async createTask(req, res) {
    try {
      if (!req?.body?.boardId || !req?.body?.listId || !req?.body?.cardId || !req?.body?.title) {
        return res.status(400).json({
          error: 1,
          message: "Task information is required"
        });
      }

      const { boardId, listId, cardId, ...task } = req.body;
      const newTask = await createTaskService(boardId, listId, cardId, task);

      return res.status(201).json({
        error: 0,
        data: newTask,
        message: "Task created successfully"
      });

    } catch (error) {
      return res.status(500).json({
        error: 1,
        message: "Internal Server Error"
      });
    }
  }

  async updateTask(req, res) {
    try {
      if (!req?.body?._id) {
        return res.status(400).json({
          error: 1,
          message: "Task ID is required"
        });
      }

      const task = req.body;
      const result = await updateTaskService(task);

      if (!result) {
        return res.status(404).json({
          error: 1,
          message: "No task found to update"
        });
      }

      return res.status(200).json({
        error: 0,
        data: result,
        message: "Task updated successfully"
      });
    } catch (error) {
      return res.status(500).json({
        error: 1,
        message: "Internal Server Error"
      });
    }
  }

  async deleteTask(req, res) {
    try {
      if (!req?.query?.boardId || !req?.query?.listId || !req?.query?.cardId || !req?.query?.taskId) {
        return res.status(400).json({
          error: 1,
          message: "Task information is required"
        });
      }

      const { boardId, listId, cardId, taskId } = req.query;
      const result = await deleteTaskService(boardId, listId, cardId, taskId);

      if (!result) {
        return res.status(404).json({
          error: 1,
          message: "No task found to delete"
        });
      }

      return res.status(200).json({
        error: 0,
        data: result,
        message: "Task deleted successfully"
      });
    } catch (error) {
      return res.status(500).json({
        error: 1,
        message: "Internal Server Error"
      });
    }
  }

  async addMemberToTask(req, res) {
    try {
      const { taskId, userId } = req.body;
      if (!taskId || !userId) {
        return res.status(400).json({
          error: 1,
          message: "Task ID and User ID are required"
        });
      }

      const result = await addMemberToTaskService(taskId, userId);
      if (!result) {
        return res.status(404).json({
          error: 1,
          message: "Task or user not found"
        });
      }

      return res.status(200).json({
        error: 0,
        data: result,
        message: "Member added to task successfully"
      });
    } catch (error) {
      return res.status(500).json({
        error: 1,
        message: "Internal Server Error"
      });
    }
  }

  async removeMemberFromTask(req, res) {
    try {
      const { taskId, userId } = req.body;
      if (!taskId || !userId) {
        return res.status(400).json({
          error: 1,
          message: "Task ID and User ID are required"
        });
      }

      const result = await removeMemberFromTaskService(taskId, userId);
      if (!result) {
        return res.status(404).json({
          error: 1,
          message: "Member not found in task"
        });
      }

      return res.status(200).json({
        error: 0,
        data: result,
        message: "Member removed from task successfully"
      });
    } catch (error) {
      return res.status(500).json({
        error: 1,
        message: "Internal Server Error"
      });
    }
  }
}

module.exports = new TaskController();
