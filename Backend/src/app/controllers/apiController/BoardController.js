const {
  getBoardsService,
  getBoardByIdService,
  createBoardService,
  updateBoardService,
  deleteBoardService, getBoardByWorkspaceIdService, reorderCardService,
} = require("../../../services/apiService/boardService");
class BoardController {
  async getBoards(req, res) {
    try {
      const boards = await getBoardsService();

      if (!boards) {
        return res.status(200).json({ message: "Board not found" });
      }

      res.status(200).json({
        data: boards,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async getBoardById(req, res) {
    try {
      if (!req?.params?._id)
        return res.status(400).json({ message: "Board id is required" });

      const id = req.params._id;
      const board = await getBoardByIdService(id);

      if (!board) {
        return res.status(200).json({ message: "Board not found" });
      }

      res.status(200).json({
        data: board,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async getBoardByWorkspaceId(req, res) {
    try {
      if (!req?.params?.workspaceId)
        return res.status(400).json({ message: "Owner id is required" });

      const id = req.params.workspaceId;
      const board = await getBoardByWorkspaceIdService(id);

      if (!board) {
        return res.status(200).json({ message: "Board not found" });
      }

      res.status(200).json({
        data: board,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async createBoard(req, res) {
    try {
      if (!req?.body)
        return res.status(400).json({ message: "Board information is required" });

      const board = req.body;
      const newBoard = await createBoardService(board);

      res.status(201).json({
        newBoard: newBoard,
      });
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async updateBoard(req, res) {
    try {
      if (!req?.body)
       return res.status(400).json({ message: "Board information is required" });

      const board = req.body;
      const result = await updateBoardService(board);
      console.log(result)
      if (!result) return res.status(200).json({ message: "No board changed" });

      res.status(200).json({
        rowsEffected: result,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async deleteBoard(req, res) {
    try {
      if (!req?.query)
        return res.status(400).json({ message: "Board information is required" });

      const id = req.query._id;
      const result = await deleteBoardService(id);
      if (!result) return res.status(200).json({ message: "No board be deleted" });

      res.status(200).json({
        rowsEffected: result,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async reorderCard(req, res) {
    try {
      if (!req?.body)
        return res.status(400).json({ message: "Card information is required" });

      const info = req.body;
      const result = await reorderCardService(info);

      if (!result) return res.status(200).json({ message: "No board changed" });

      res.status(200).json({
        data: result,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

module.exports = new BoardController();
