const {
    getCardByIdWithTasksService,
    createCardService,
    updateCardService,
    deleteCardService,
    addMemberToCardService,
    removeMemberFromCardService,
} = require("../../../services/apiService/cardService");

class CardController {
    async getCardByIdWithTasks(req, res) {
        try {
            if (!req?.query?.boardId || !req?.query?.listId || !req?.query?.cardId) {
                return res.status(400).json({
                    error: 1,
                    message: "Board id, list id and card id are required"
                });
            }

            const {boardId, listId, cardId} = req.query;
            const card = await getCardByIdWithTasksService(boardId, listId, cardId);

            if (!card) {
                return res.status(404).json({
                    error: 1,
                    message: "Card not found"
                });
            }

            return res.status(200).json({
                error: 0,
                data: card,
                message: "Card retrieved successfully"
            });
        } catch (error) {
            return res.status(500).json({
                error: 1,
                message: "Internal Server Error"
            });
        }
    }

    async createCard(req, res) {
        try {
            if (!req?.body?.boardId || !req?.body?.listId || !req?.body?.title) {
                return res.status(400).json({
                    error: 1,
                    message: "Board id, list id and title are required"
                });
            }

            const card = req.body;
            const newCard = await createCardService(card);

            return res.status(201).json({
                error: 0,
                data: newCard,
                message: "Card created successfully"
            });

        } catch (error) {
            return res.status(500).json({
                error: 1,
                message: "Internal Server Error"
            });
        }
    }

    async updateCard(req, res) {
        try {
            if (!req?.body?.boardId || !req?.body?.listId || !req?.body?._id) {
                return res.status(400).json({
                    error: 1,
                    message: "Board id, list id and card id are required"
                });
            }

            const card = req.body;
            const result = await updateCardService(card);

            if (!result) {
                return res.status(404).json({
                    error: 1,
                    message: "No card found to update"
                });
            }

            return res.status(200).json({
                error: 0,
                data: result,
                message: "Card updated successfully"
            });
        } catch (error) {
            return res.status(500).json({
                error: 1,
                message: "Internal Server Error"
            });
        }
    }

    async deleteCard(req, res) {
        try {
            if (!req?.query?.boardId || !req?.query?.listId || !req?.query?.cardId) {
                return res.status(400).json({
                    error: 1,
                    message: "Board id, list id and card id are required"
                });
            }

            const {boardId, listId, cardId} = req.query;
            const result = await deleteCardService(boardId, listId, cardId);

            if (!result) {
                return res.status(404).json({
                    error: 1,
                    message: "No card found to delete"
                });
            }

            return res.status(200).json({
                error: 0,
                data: result,
                message: "Card deleted successfully"
            });
        } catch (error) {
            return res.status(500).json({
                error: 1,
                message: "Internal Server Error"
            });
        }
    }

    async addMemberToCard(req, res) {
        try {
            const { cardId, listId, boardId, userId } = req.body;
            if (!cardId || !listId || !boardId || !userId) {
                return res.status(400).json({
                    error: 1,
                    message: "Card id, list id, board id and user id are required"
                });
            }

            const result = await addMemberToCardService(boardId, listId, cardId, userId);
            if (!result) {
                return res.status(404).json({
                    error: 1,
                    message: "Card not found or member already added"
                });
            }

            return res.status(200).json({
                error: 0,
                data: result,
                message: "Member added to card successfully"
            });
        } catch (error) {
            return res.status(500).json({
                error: 1,
                message: "Internal Server Error"
            });
        }
    }

    async removeMemberFromCard(req, res) {
        try {
            const { cardId, listId, boardId, userId } = req.body;

            if (!cardId || !listId || !boardId || !userId) {
                return res.status(400).json({
                    error: 1,
                    message: "Card id, list id, board id and user id are required"
                });
            }

            const result = await removeMemberFromCardService(boardId, listId, cardId, userId);
            if (!result) {
                return res.status(404).json({
                    error: 1,
                    message: "Member not found in card"
                });
            }

            return res.status(200).json({
                error: 0,
                data: result,
                message: "Member removed from card successfully"
            });
        } catch (error) {
            return res.status(500).json({
                error: 1,
                message: "Internal Server Error"
            });
        }
    }
}

module.exports = new CardController();
