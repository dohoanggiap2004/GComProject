const {
    getBoardsService,
    getBoardByIdService,
    createBoardService,
    updateBoardService,
    deleteBoardService,
    getBoardByWorkspaceIdService,
    updateCardIndexService,
    updateListIndexService, countBoardInWorkspaceService,
} = require("../../../services/apiService/boardService");
const getUserIdFromToken = require("../../../utils/getUserIdFromToken");

class BoardController {
    async getBoards(req, res) {
        try {
            const boards = await getBoardsService();

            if (!boards) {
                return res.status(200).json({message: "BoardItem not found"});
            }

            res.status(200).json({
                data: boards,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({message: "Internal Server Error"});
        }
    }

    async getBoardById(req, res) {
        try {
            if (!req?.params?._id)
                return res.status(400).json({message: "BoardItem id is required"});

            const id = req.params._id;
            const result = await getBoardByIdService(id);

            if (!result) {
                return res.status(200).json({message: "BoardItem not found"});
            }

            res.status(200).json({
                data: result,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({message: "Internal Server Error"});
        }
    }

    async getBoardByWorkspaceId(req, res) {
        try {
            if (!req?.params?.workspaceId)
                return res.status(400).json({message: "Owner id is required"});

            const id = req.params.workspaceId;
            const board = await getBoardByWorkspaceIdService(id);
            if (!board) {
                return res.status(200).json({message: "BoardItem not found"});
            }

            res.status(200).json({
                data: board,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({message: "Internal Server Error"});
        }
    }

    async createBoard(req, res) {
        try {
            if (!req?.body)
                return res.status(400).json({message: "BoardItem information is required"});

            const board = req.body;
            const workspaceId = req.body.workspaceId;
            const userId = await getUserIdFromToken(req)

            if (!workspaceId || !userId)
                return res.status(400).json({message: "WorkspaceId && userId information is required"});

            const quantity = await countBoardInWorkspaceService(userId, workspaceId);
            if (quantity === 'unlimited') {
                const newBoard = await createBoardService(board);
                return res.status(201).json({
                    newBoard: newBoard,
                });
            } else if (quantity >= 5)
                return res.status(400).json({message: "Reached the limitation to create a new board"});


            const newBoard = await createBoardService(board);
            res.status(201).json({
                newBoard: newBoard,
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({message: "Internal Server Error"});
        }
    }

    async updateBoard(req, res) {
        try {
            if (!req?.body)
                return res.status(400).json({message: "BoardItem information is required"});

            const board = req.body;
            const result = await updateBoardService(board);
            console.log(result)
            if (!result) return res.status(200).json({message: "No board changed"});

            res.status(200).json({
                rowsEffected: result,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({message: "Internal Server Error"});
        }
    }

    async deleteBoard(req, res) {
        try {
            if (!req?.query)
                return res.status(400).json({message: "BoardItem information is required"});

            const id = req.query._id;
            const result = await deleteBoardService(id);
            if (!result) return res.status(200).json({message: "No board be deleted"});

            res.status(200).json({
                rowsEffected: result,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({message: "Internal Server Error"});
        }
    }

    async updateListIndex(req, res) {
        try {
            if (!req?.body)
                return res.status(400).json({message: "List information is required"});

            const info = req.body;
            const result = await updateListIndexService(info);

            if (!result) return res.status(200).json({message: "No board changed"});

            res.status(200).json({
                data: result,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({message: "Internal Server Error"});
        }
    }

    async updateCardIndex(req, res) {
        try {
            if (!req?.body)
                return res.status(400).json({message: "Card information is required"});

            const info = req.body;
            const result = await updateCardIndexService(info);

            if (!result) return res.status(200).json({message: "No board changed"});

            res.status(200).json({
                data: result,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({message: "Internal Server Error"});
        }
    }
}

module.exports = new BoardController();
