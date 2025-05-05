const getUserIdFromToken = require("../../../utils/getUserIdFromToken");
const {
    getBoardsForMessengerService
} = require("../../../services/apiService/messageService");

class MessageController {

    async getBoardWithMessagesByMemberId(req, res) {
        try {
            const memberId = await getUserIdFromToken(req);
            if (!memberId) {
                return res.status(400).json({
                    error: 1,
                    message: 'User information is required'
                });
            }

            const boardWithMessages = await getBoardsForMessengerService(memberId);

            if (!boardWithMessages) {
                return res.status(404).json({
                    error: 1,
                    message: "No boards found for this member"
                });
            }

            return res.status(200).json({
                error: 0,
                data: boardWithMessages,
                message: "Boards with messages retrieved successfully"
            });
        } catch (error) {
            return res.status(500).json({
                error: 1,
                message: "Internal Server Error"
            });
        }
    }
}

module.exports = new MessageController();
