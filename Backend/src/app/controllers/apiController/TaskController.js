const {
  createTaskService,
  updateTaskService,
  deleteTaskService, addMemberToTaskService, removeMemberFromTaskService,
} = require("../../../services/apiService/taskService");

class TaskController {

  // async getTaskByBoardId(req, res) {
  //   try {
  //     if (!req?.params?._id)
  //       return res.status(400).json({ message: "BoardItem id is required" });
  //
  //     const id = req.params._id;
  //     const task= await getTaskByBoardIdService(id);
  //
  //     if (!task) {
  //       return res.status(200).json({ message: "Task not found" });
  //     }
  //
  //     res.status(200).json({
  //       data: task,
  //     });
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ message: "Internal Server Error" });
  //   }
  // }

  async createTask(req, res) {
    try {
      if (!req?.body?.boardId || !req?.body?.listId || !req?.body?.cardId || !req?.body?.title)
        return res.status(400).json({ message: "Task information is required" });

      const { boardId, listId, cardId, ...task} = req.body;
      const newTask = await createTaskService(boardId, listId, cardId, task);

      res.status(201).json({
        newTask: newTask,
      });
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async updateTask(req, res) {
    try {
      if (!req?.body?._id)
       return res.status(400).json({ message: "Task information is required" });

      const task = req.body;
      const result = await updateTaskService(task);
      console.log(result)
      if (!result) return res.status(200).json({ message: "No taskchanged" });

      res.status(200).json({
        rowsEffected: result,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async deleteTask(req, res) {
    try {
      if (!req?.query?.boardId || !req?.query?.listId || !req?.query?.cardId || !req?.query?.taskId)
        return res.status(400).json({ message: "Task information is required" });
      const { boardId, listId, cardId, taskId } = req.query;
      const result = await deleteTaskService( boardId, listId, cardId, taskId );
      if (!result) return res.status(200).json({ message: "No task be deleted" });

      res.status(200).json({
        rowsAfterEffected: result,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async addMemberToTask(req, res) {
    try {
      const { taskId, userId } = req.body;
      if (!taskId || !userId)
        return res.status(400).json({message: "Task information is required"});

      const result = await addMemberToTaskService(taskId, userId);
      if (!result) return res.status(200).json({message: "No member added to card"});

      res.status(200).json({
        error: 0
      })
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }

  async removeMemberFromTask(req, res) {
    try {
      const { taskId, userId } = req.body;

      if (!taskId || !userId)
        return res.status(400).json({message: "Task information is required"});

      const result = await removeMemberFromTaskService(taskId, userId);
      if (!result) return res.status(200).json({message: "No member added to card"});

      res.status(200).json({
        error: 0
      })
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
}

module.exports = new TaskController();
