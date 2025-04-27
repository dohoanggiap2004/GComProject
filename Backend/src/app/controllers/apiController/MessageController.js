const getUserIdFromToken = require("../../../utils/getUserIdFromToken");
const {
    getBoardsForMessengerService
} = require("../../../services/apiService/messageService");

class MessageController {

    async getBoardWithMessagesByMemberId(req, res) {
        try{
            const memberId = await getUserIdFromToken(req);
            if(!memberId)
                return res.status(400).json({ message: 'User information is required' });

            const boardWithMessages = await getBoardsForMessengerService(memberId);

            if (!boardWithMessages) {
                return res.status(400).json({ message: "Board not found" });
            }

            res.status(200).json({
                data: boardWithMessages,
            });
        }catch(error){
            console.error(error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

}



module.exports = new MessageController();
