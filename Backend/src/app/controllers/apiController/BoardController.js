const {
    getBoardsService,
    getBoardByIdService,
    createBoardService,
    updateBoardService,
    deleteBoardService,
    getBoardByWorkspaceIdService,
    updateCardIndexService,
    updateListIndexService,
    countBoardInWorkspaceService,
    removeMemberFromBoardService, getBoardByMemberIdService,
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

    async getBoardByMemberId(req, res) {
        try {
            const userId = await getUserIdFromToken(req)

            if (!userId)
                return res.status(400).json({message: "Member id is required"});

            const board = await getBoardByMemberIdService(userId);
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
            if (!req?.body?.title || !req.body?.visibility || !req.body?.workspaceId)
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
            if (!req?.body?._id)
                return res.status(400).json({message: "BoardItem information is required"});

            const board = req.body;
            const result = await updateBoardService(board);

            if (!result) return res.status(200).json({message: "No board changed"});

            res.status(200).json({
                rowsEffected: result,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({message: "Internal Server Error"});
        }
    }

    async removeMemberFromBoard(req, res) {
        try {
            const { _id, userId } = req.body;

            if (!_id || !userId)
                return res.status(400).json({message: "Card information is required"});

            const result = await removeMemberFromBoardService(_id, userId);
            if (!result) return res.status(200).json({message: "No member added to card"});

            res.status(200).json({
                data: result,
            })
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Server error" });
        }
    }

    async deleteBoard(req, res) {
        try {
            if (!req?.query._id)
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
            if (!req?.body?.sourceIndex || !req?.body?.destIndex || !req?.body?.boardId)
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
            if (!req?.body?.boardId || !req?.body?.sourceListId || !req?.body?.destListId
                || !req?.body?.sourceCardIndex || !req?.body?.destCardIndex)
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
