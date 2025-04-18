const {
  createListService,
  updateListService,
  deleteListService,
} = require("../../../services/apiService/listService");
class ListController {

  // async getListByBoardId(req, res) {
  //   try {
  //     if (!req?.params?._id)
  //       return res.status(400).json({ message: "BoardItem id is required" });
  //
  //     const id = req.params._id;
  //     const list= await getListByBoardIdService(id);
  //
  //     if (!list) {
  //       return res.status(200).json({ message: "List not found" });
  //     }
  //
  //     res.status(200).json({
  //       data: list,
  //     });
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ message: "Internal Server Error" });
  //   }
  // }

  async createList(req, res) {
    try {
      if (!req?.body?.boardId)
        return res.status(400).json({ message: "BoardId is required" });

      const list= req.body;
      const newList = await createListService(list);

      res.status(201).json({
        newList: newList,
      });
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async updateList(req, res) {
    try {
      if (!req?.body?.boardId || req?.body?._id)
       return res.status(400).json({ message: "List information is required" });

      const list = req.body;
      const result = await updateListService(list);

      if (!result) return res.status(200).json({ message: "No listchanged" });

      res.status(200).json({
        rowsEffected: result,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async deleteList(req, res) {
    try {
      if (!req?.query?.boardId || !req?.query?.listId)
        return res.status(400).json({ message: "List information is required" });
      const { boardId, listId } = req.query;
      console.log(boardId, listId)
      const result = await deleteListService(boardId, listId);
      if (!result) return res.status(200).json({ message: "No list be deleted" });

      res.status(200).json({
        rowsEffected: result,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

}

module.exports = new ListController();
