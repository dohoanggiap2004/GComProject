const {
  getTaskByBoardIdService,
  createTaskService,
  updateTaskService,
  deleteTaskService,
} = require("../../../services/apiService/taskService");
class TaskController {

  // async getTaskByBoardId(req, res) {
  //   try {
  //     if (!req?.params?._id)
  //       return res.status(400).json({ message: "Board id is required" });
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
      if (!req?.body)
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
      if (!req?.body)
       return res.status(400).json({ message: "Task information is required" });

      const task= req.body;
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
      if (!req?.query)
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
}

module.exports = new TaskController();
