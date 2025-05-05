const {
    getMemberQuantityInBoardService,
    getCardQuantityInBoardService,
    getTaskQuantityInBoardService,
    getProductiveMembersService,
    getMonthlyProgressService,
    getTaskQuantityInListService,
} = require("../../../services/apiService/statisticService");

class StatisticController {
    async getMemberQuantityInBoard(req, res) {
        try {
            const boardId = req.params.boardId;
            if (!boardId) {
                return res.status(400).json({
                    error: 1,
                    message: "Board ID is required"
                });
            }

            const memberQuantity = await getMemberQuantityInBoardService(boardId);

            if (!memberQuantity) {
                return res.status(404).json({
                    error: 1,
                    message: "Board not found"
                });
            }

            return res.status(200).json({
                error: 0,
                data: memberQuantity,
                message: "Member quantity retrieved successfully"
            });
        } catch (error) {
            return res.status(500).json({
                error: 1,
                message: "Internal Server Error"
            });
        }
    }

    async getCardQuantityInBoard(req, res) {
        try {
            const boardId = req.params.boardId;
            if (!boardId) {
                return res.status(400).json({
                    error: 1,
                    message: "Board ID is required"
                });
            }

            const result = await getCardQuantityInBoardService(boardId);
            if (!result) {
                return res.status(404).json({
                    error: 1,
                    message: "Board not found"
                });
            }

            return res.status(200).json({
                error: 0,
                data: result,
                message: "Card quantity retrieved successfully"
            });
        } catch (error) {
            return res.status(500).json({
                error: 1,
                message: "Internal Server Error"
            });
        }
    }

    async getTaskQuantityInBoard(req, res) {
        try {
            const boardId = req.params.boardId;
            if (!boardId) {
                return res.status(400).json({
                    error: 1,
                    message: "Board ID is required"
                });
            }

            const result = await getTaskQuantityInBoardService(boardId);
            if (!result) {
                return res.status(404).json({
                    error: 1,
                    message: "Board not found"
                });
            }

            return res.status(200).json({
                error: 0,
                data: result,
                message: "Task quantity retrieved successfully"
            });
        } catch (error) {
            return res.status(500).json({
                error: 1,
                message: "Internal Server Error"
            });
        }
    }

    async getProductiveMembers(req, res) {
        try {
            const boardId = req.params.boardId;
            if (!boardId) {
                return res.status(400).json({
                    error: 1,
                    message: "Board ID is required"
                });
            }

            const result = await getProductiveMembersService(boardId);
            if (!result) {
                return res.status(404).json({
                    error: 1,
                    message: "Board not found"
                });
            }

            return res.status(200).json({
                error: 0,
                data: result,
                message: "Productive members retrieved successfully"
            });
        } catch (error) {
            return res.status(500).json({
                error: 1,
                message: "Internal Server Error"
            });
        }
    }

    async getMonthlyProgress(req, res) {
        try {
            const boardId = req.params.boardId;
            if (!boardId) {
                return res.status(400).json({
                    error: 1,
                    message: "Board ID is required"
                });
            }

            const result = await getMonthlyProgressService(boardId);
            if (!result) {
                return res.status(404).json({
                    error: 1,
                    message: "Board not found"
                });
            }

            return res.status(200).json({
                error: 0,
                data: result,
                message: "Monthly progress retrieved successfully"
            });
        } catch (error) {
            return res.status(500).json({
                error: 1,
                message: "Internal Server Error"
            });
        }
    }

    async getTaskQuantityInList(req, res) {
        try {
            const boardId = req.params.boardId;
            if (!boardId) {
                return res.status(400).json({
                    error: 1,
                    message: "Board ID is required"
                });
            }

            const result = await getTaskQuantityInListService(boardId);
            if (!result) {
                return res.status(404).json({
                    error: 1,
                    message: "Board not found"
                });
            }

            return res.status(200).json({
                error: 0,
                data: result,
                message: "Task quantity per list retrieved successfully"
            });
        } catch (error) {
            return res.status(500).json({
                error: 1,
                message: "Internal Server Error"
            });
        }
    }
}

module.exports = new StatisticController();
