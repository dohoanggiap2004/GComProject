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
    removeMemberFromBoardService,
    getBoardByMemberIdService,
} = require("../../../services/apiService/boardService");
const getUserIdFromToken = require("../../../utils/getUserIdFromToken");

class BoardController {
    async getBoards(req, res) {
        try {
            const boards = await getBoardsService();

            if (!boards) {
                return res.status(404).json({
                    error: 1,
                    message: "No boards found"
                });
            }

            return res.status(200).json({
                error: 0,
                data: boards,
                message: "Boards retrieved successfully"
            });
        } catch (error) {
            return res.status(500).json({
                error: 1,
                message: "Internal Server Error"
            });
        }
    }

    async getBoardById(req, res) {
        try {
            if (!req?.params?._id) {
                return res.status(400).json({
                    error: 1,
                    message: "Board id is required"
                });
            }

            const id = req.params._id;
            const result = await getBoardByIdService(id);

            if (!result) {
                return res.status(404).json({
                    error: 1,
                    message: "Board not found"
                });
            }

            return res.status(200).json({
                error: 0,
                data: result,
                message: "Board retrieved successfully"
            });
        } catch (error) {
            return res.status(500).json({
                error: 1,
                message: "Internal Server Error"
            });
        }
    }

    async getBoardByWorkspaceId(req, res) {
        try {
            if (!req?.params?.workspaceId) {
                return res.status(400).json({
                    error: 1,
                    message: "Workspace id is required"
                });
            }

            const id = req.params.workspaceId;
            const board = await getBoardByWorkspaceIdService(id);

            if (!board) {
                return res.status(404).json({
                    error: 1,
                    message: "No boards found in workspace"
                });
            }

            return res.status(200).json({
                error: 0,
                data: board,
                message: "Workspace boards retrieved successfully"
            });
        } catch (error) {
            return res.status(500).json({
                error: 1,
                message: "Internal Server Error"
            });
        }
    }

    async getBoardByMemberId(req, res) {
        try {
            const userId = await getUserIdFromToken(req);

            if (!userId) {
                return res.status(400).json({
                    error: 1,
                    message: "Member id is required"
                });
            }

            const board = await getBoardByMemberIdService(userId);
            if (!board) {
                return res.status(404).json({
                    error: 1,
                    message: "No boards found for member"
                });
            }

            return res.status(200).json({
                error: 0,
                data: board,
                message: "Member boards retrieved successfully"
            });
        } catch (error) {
            return res.status(500).json({
                error: 1,
                message: "Internal Server Error"
            });
        }
    }

    async createBoard(req, res) {
        try {
            if (!req?.body?.title || !req.body?.visibility || !req.body?.workspaceId) {
                return res.status(400).json({
                    error: 1,
                    message: "Board title, visibility and workspace id are required"
                });
            }

            const board = req.body;
            const workspaceId = req.body.workspaceId;
            const userId = await getUserIdFromToken(req);

            if (!workspaceId || !userId) {
                return res.status(400).json({
                    error: 1,
                    message: "WorkspaceId and userId are required"
                });
            }

            const quantity = await countBoardInWorkspaceService(userId, workspaceId);

            if (quantity !== 'unlimited' && quantity >= 5) {
                return res.status(400).json({
                    error: 1,
                    message: "Reached the limitation to create a new board"
                });
            }

            const newBoard = await createBoardService(board);
            return res.status(201).json({
                error: 0,
                data: newBoard,
                message: "Board created successfully"
            });

        } catch (error) {
            return res.status(500).json({
                error: 1,
                message: "Internal Server Error"
            });
        }
    }

    async updateBoard(req, res) {
        try {
            if (!req?.body?._id) {
                return res.status(400).json({
                    error: 1,
                    message: "Board id is required"
                });
            }

            const board = req.body;
            const result = await updateBoardService(board);

            if (!result) {
                return res.status(404).json({
                    error: 1,
                    message: "No board found to update"
                });
            }

            return res.status(200).json({
                error: 0,
                data: result,
                message: "Board updated successfully"
            });
        } catch (error) {
            return res.status(500).json({
                error: 1,
                message: "Internal Server Error"
            });
        }
    }

    async removeMemberFromBoard(req, res) {
        try {
            const {_id, userId} = req.body;

            if (!_id || !userId) {
                return res.status(400).json({
                    error: 1,
                    message: "Board id and user id are required"
                });
            }

            const result = await removeMemberFromBoardService(_id, userId);
            if (!result) {
                return res.status(404).json({
                    error: 1,
                    message: "Member not found in board"
                });
            }

            return res.status(200).json({
                error: 0,
                data: result,
                message: "Member removed from board successfully"
            });
        } catch (error) {
            return res.status(500).json({
                error: 1,
                message: "Internal Server Error"
            });
        }
    }

    async deleteBoard(req, res) {
        try {
            if (!req?.query._id) {
                return res.status(400).json({
                    error: 1,
                    message: "Board id is required"
                });
            }

            const id = req.query._id;
            const result = await deleteBoardService(id);

            if (!result) {
                return res.status(404).json({
                    error: 1,
                    message: "No board found to delete"
                });
            }

            return res.status(200).json({
                error: 0,
                data: result,
                message: "Board deleted successfully"
            });
        } catch (error) {
            return res.status(500).json({
                error: 1,
                message: "Internal Server Error"
            });
        }
    }

    async updateListIndex(req, res) {
        try {
            if (!req?.body?.sourceIndex || !req?.body?.destIndex || !req?.body?.boardId) {
                return res.status(400).json({
                    error: 1,
                    message: "Source index, destination index and board id are required"
                });
            }

            const info = req.body;
            const result = await updateListIndexService(info);

            if (!result) {
                return res.status(404).json({
                    error: 1,
                    message: "No list found to update"
                });
            }

            return res.status(200).json({
                error: 0,
                data: result,
                message: "List index updated successfully"
            });
        } catch (error) {
            return res.status(500).json({
                error: 1,
                message: "Internal Server Error"
            });
        }
    }

    async updateCardIndex(req, res) {
        try {
            if (req?.body?.boardId === undefined ||
                req?.body?.sourceListId === undefined ||
                req?.body?.destListId === undefined ||
                req?.body?.sourceCardIndex === undefined ||
                req?.body?.destCardIndex === undefined) {
                return res.status(400).json({
                    error: 1,
                    message: "Board id, source list id, destination list id, source card index and destination card index are required"
                });
            }

            const info = req.body;

            const result = await updateCardIndexService(info);

            if (!result) {
                return res.status(404).json({
                    error: 1,
                    message: "No card found to update"
                });
            }

            return res.status(200).json({
                error: 0,
                data: result,
                message: "Card index updated successfully"
            });
        } catch (error) {
            return res.status(500).json({
                error: 1,
                message: "Internal Server Error"
            });
        }
    }
}

module.exports = new BoardController();
