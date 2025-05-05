const {
  createListService,
  updateListService,
  deleteListService,
} = require("../../../services/apiService/listService");

class ListController {

  // async getListByBoardId(req, res) {
  //   try {
  //     if (!req?.params?._id) {
  //       return res.status(400).json({
  //         error: 1,
  //         message: "Board id is required"
  //       });
  //     }
  //
  //     const id = req.params._id;
  //     const list = await getListByBoardIdService(id);
  //
  //     if (!list) {
  //       return res.status(404).json({
  //         error: 1,
  //         message: "List not found"
  //       });
  //     }
  //
  //     return res.status(200).json({
  //       error: 0,
  //       data: list,
  //       message: "List retrieved successfully"
  //     });
  //   } catch (error) {
  //     return res.status(500).json({
  //       error: 1,
  //       message: "Internal Server Error"
  //     });
  //   }
  // }

  async createList(req, res) {
    try {
      if (!req?.body?.boardId) {
        return res.status(400).json({
          error: 1,
          message: "Board id is required"
        });
      }

      const list = req.body;
      const newList = await createListService(list);

      return res.status(201).json({
        error: 0,
        data: newList,
        message: "List created successfully"
      });

    } catch (error) {
      return res.status(500).json({
        error: 1,
        message: "Internal Server Error"
      });
    }
  }

  async updateList(req, res) {
    try {
      if (!req?.body?.boardId || !req?.body?._id) {
        return res.status(400).json({
          error: 1,
          message: "Board id and list id are required"
        });
      }

      const list = req.body;
      const result = await updateListService(list);

      if (!result) {
        return res.status(404).json({
          error: 1,
          message: "No list found to update"
        });
      }

      return res.status(200).json({
        error: 0,
        data: result,
        message: "List updated successfully"
      });
    } catch (error) {
      return res.status(500).json({
        error: 1,
        message: "Internal Server Error"
      });
    }
  }

  async deleteList(req, res) {
    try {
      if (!req?.query?.boardId || !req?.query?.listId) {
        return res.status(400).json({
          error: 1,
          message: "Board id and list id are required"
        });
      }

      const { boardId, listId } = req.query;
      const result = await deleteListService(boardId, listId);

      if (!result) {
        return res.status(404).json({
          error: 1,
          message: "No list found to delete"
        });
      }

      return res.status(200).json({
        error: 0,
        data: result,
        message: "List deleted successfully"
      });
    } catch (error) {
      return res.status(500).json({
        error: 1,
        message: "Internal Server Error"
      });
    }
  }
}

module.exports = new ListController();
