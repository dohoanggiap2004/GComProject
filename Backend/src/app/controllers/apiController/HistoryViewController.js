const getUserIdFromToken = require("../../../utils/getUserIdFromToken");
const {
    getBoardsInHistoryViewByUserIdService, updateHistoryViewService, createHistoryViewService,

} = require("../../../services/apiService/historyViewService");

class HistoryViewController {
    async getBoardsInHistoryViewByUserId(req, res) {
        try {
            const userId = await getUserIdFromToken(req);
            if(!userId)
                return res.status(400).json({
                    error: 1,
                    message: 'User information is required'
                });

            const boardsViewed = await getBoardsInHistoryViewByUserIdService(userId)
            if(!boardsViewed)
                return res.status(400).json({
                    error: 1,
                    message: "Not found boards viewed"
                });

            return res.status(200).json({
                error: 0,
                data: boardsViewed,
                message: "Boards viewed retrieved successfully"
            })
        }catch (err){
            return res.status(500).json({
                error: 1,
                message: "Internal Server Error"
            })
        }
    }

    async createHistoryView(req, res) {
        try {
            const userId = await getUserIdFromToken(req);
            if (!req?.body?.boardId || !userId) {
                return res.status(400).json({
                    error: 1,
                    message: "User ID and board IDs are required"
                });
            }

            const { boardId } = req.body;
            const newHistoryView = await createHistoryViewService(userId, boardId);

            return res.status(201).json({
                error: 0,
                data: newHistoryView,
                message: "History view created successfully"
            });

        } catch (error) {
            return res.status(500).json({
                error: 1,
                message: "Internal Server Error"
            });
        }
    }

    // async updateHistoryView(req, res) {
    //     try {
    //         if (!req?.body?._id || !req?.body?.boardId) {
    //             return res.status(400).json({
    //                 error: 1,
    //                 message: "History ID and board ID are required"
    //             });
    //         }
    //
    //         const {_id, boardId} = req.body;
    //         const result = await updateHistoryViewService(_id, boardId);
    //
    //         if (!result) {
    //             return res.status(400).json({
    //                 error: 1,
    //                 message: "No history view found to update"
    //             });
    //         }
    //
    //         return res.status(200).json({
    //             error: 0,
    //             data: result,
    //             message: "History view updated successfully"
    //         });
    //     } catch (error) {
    //         return res.status(500).json({
    //             error: 1,
    //             message: "Internal Server Error"
    //         });
    //     }
    // }

}

module.exports = new HistoryViewController()
