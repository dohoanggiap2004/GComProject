const {
  getListByBoardIdService,
  createListService,
  updateListService,
  deleteListService,
} = require("../../../services/apiService/listService");
class ListController {

  // async getListByBoardId(req, res) {
  //   try {
  //     if (!req?.params?._id)
  //       return res.status(400).json({ message: "Board id is required" });
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
      if (!req?.body)
        return res.status(400).json({ message: "List information is required" });

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
      if (!req?.body)
       return res.status(400).json({ message: "List information is required" });

      const list= req.body;
      const result = await updateListService(list);
      console.log(result)
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
      if (!req?.query)
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
