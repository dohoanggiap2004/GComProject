const {
    getMemberQuantityInBoardService,
    getCardQuantityInBoardService,
    getTaskQuantityInBoardService,
    getProductiveMembersService,
    getMonthlyProgressService,
    getTaskQuantityInListService,

} = require("../../../services/apiService/statisticService");

class StatisticController {
    async getMemberQuantityInBoard(req, res){
        const boardId = req.params.boardId;
        if(!boardId) return res.status(400).json({ message: "Board ID is required" });

        const memberQuantity = await getMemberQuantityInBoardService(boardId);

        if(!memberQuantity) return res.status(400).json({ message: "Board not found" });

        res.status(200).json({
            data: memberQuantity,
        })
    }

    async getCardQuantityInBoard(req, res){
        const boardId = req.params.boardId;
        if(!boardId) return res.status(400).json({ message: "Board ID is required" });

        const result = await getCardQuantityInBoardService(boardId);
        if(!result) return res.status(400).json({ message: "Board not found" });

        res.status(200).json({
            data: result,
        })
    }

    async getTaskQuantityInBoard(req, res){
        const boardId = req.params.boardId;
        if(!boardId) return res.status(400).json({ message: "Board ID is required" });

        const result = await getTaskQuantityInBoardService(boardId);
        if(!result) return res.status(400).json({ message: "Board not found" });

        res.status(200).json({
            data: result,
        })
    }

    async getProductiveMembers(req, res){
        const boardId = req.params.boardId;
        if(!boardId) return res.status(400).json({ message: "Board ID is required" });

        const result = await getProductiveMembersService(boardId);
        if(!result) return res.status(400).json({ message: "Board not found" });

        res.status(200).json({
            data: result,
        })
    }

    async getMonthlyProgress(req, res){
        const boardId = req.params.boardId;
        if(!boardId) return res.status(400).json({ message: "Board ID is required" });

        const result = await getMonthlyProgressService(boardId);
        if(!result) return res.status(400).json({ message: "Board not found" });

        res.status(200).json({
            data: result,
        })
    }

    async getTaskQuantityInList(req, res){
        const boardId = req.params.boardId;
        if(!boardId) return res.status(400).json({ message: "Board ID is required" });

        const result = await getTaskQuantityInListService(boardId);
        if(!result) return res.status(400).json({ message: "Board not found" });

        res.status(200).json({
            data: result,
        })

    }

}

module.exports = new StatisticController();
