const {
    getCardByIdWithTasksService,
    createCardService,
    updateCardService,
    deleteCardService, addMemberToCardService, removeMemberFromCardService,
} = require("../../../services/apiService/cardService");
const getUserIdFromToken = require("../../../utils/getUserIdFromToken");

class CardController {

    async getCardByIdWithTasks(req, res) {
        try {
            if (!req?.query)
                return res.status(400).json({message: "BoardItem id is required"});

            const {boardId, listId, cardId} = req.query;
            const card = await getCardByIdWithTasksService(boardId, listId, cardId);

            if (!card) {
                return res.status(200).json({message: "Card not found"});
            }

            res.status(200).json({
                data: card,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({message: "Internal Server Error"});
        }
    }

    async createCard(req, res) {
        try {
            if (!req?.body)
                return res.status(400).json({message: "Card information is required"});

            const card = req.body;
            const newCard = await createCardService(card);

            res.status(201).json({
                newCard: newCard,
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({message: "Internal Server Error"});
        }
    }

    async updateCard(req, res) {
        try {
            if (!req?.body)
                return res.status(400).json({message: "Card information is required"});
            const card = req.body;
            const result = await updateCardService(card);
            console.log(result)
            if (!result) return res.status(200).json({message: "No cardchanged"});

            res.status(200).json({
                rowsEffected: result,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({message: "Internal Server Error"});
        }
    }

    async deleteCard(req, res) {
        try {
            if (!req?.query)
                return res.status(400).json({message: "Card information is required"});
            const {boardId, listId, cardId} = req.query;
            const result = await deleteCardService(boardId, listId, cardId);
            if (!result) return res.status(200).json({message: "No card be deleted"});

            res.status(200).json({
                rowsEffected: result,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({message: "Internal Server Error"});
        }
    }

    async addMemberToCard(req, res) {
        try {
            const { cardId, listId, boardId, userId } = req.body;
            if (!cardId || !listId || !boardId || !userId)
                return res.status(400).json({message: "Card information is required"});

            const result = await addMemberToCardService(boardId, listId, cardId, userId);
            if (!result) return res.status(200).json({message: "No member added to card"});

            res.status(200).json({
                data: result,
            })
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Server error" });
        }
    }

    async removeMemberFromCard(req, res) {
        try {
            const { cardId, listId, boardId, userId } = req.body;

            if (!cardId || !listId || !boardId || !userId)
                return res.status(400).json({message: "Card information is required"});

            const result = await removeMemberFromCardService(boardId, listId, cardId, userId);
            if (!result) return res.status(200).json({message: "No member added to card"});

            res.status(200).json({
                data: result,
            })
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Server error" });
        }
    }
}

module.exports = new CardController();
