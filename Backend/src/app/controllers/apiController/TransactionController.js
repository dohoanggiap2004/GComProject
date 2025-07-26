const {
    createTransactionService,
    updateTransactionService,
    deleteTransactionService,
    getAllTransactionsService,
} = require("../../../services/apiService/transactionService");

class TransactionController {
    async getTransactions(req, res) {
        try {
            const transactions = await getAllTransactionsService();
            if (!transactions) {
                return res.status(404).json({
                    error: 1,
                    message: "Transactions not found"
                });
            }

            return res.status(200).json({
                error: 0,
                data: transactions,
                message: "Transactions retrieved successfully"
            });
        } catch (error) {
            return res.status(500).json({
                error: 1,
                message: "Internal Server Error"
            });
        }
    }
    

    async createTransaction(req, res) {
        try {
            if (!req?.body?.userId || !req?.body?.amount) {
                return res.status(400).json({
                    error: 1,
                    message: "User ID and amount are required"
                });
            }

            const transaction = req.body;
            const newTransaction = await createTransactionService(transaction);

            return res.status(201).json({
                error: 0,
                data: newTransaction,
                message: "Transaction created successfully"
            });

        } catch (error) {
            return res.status(500).json({
                error: 1,
                message: "Internal Server Error"
            });
        }
    }

    async updateTransaction(req, res) {
        try {
            if (!req?.body?._id) {
                return res.status(400).json({
                    error: 1,
                    message: "Transaction ID is required"
                });
            }

            const transaction = req.body;
            const result = await updateTransactionService(transaction);

            if (!result) {
                return res.status(404).json({
                    error: 1,
                    message: "Transaction not found"
                });
            }

            return res.status(200).json({
                error: 0,
                data: result,
                message: "Transaction updated successfully"
            });
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                error: 1,
                message: "Internal Server Error"
            });
        }
    }

    async deleteTransaction(req, res) {
        try {
            if (!req?.query?._id) {
                return res.status(400).json({
                    error: 1,
                    message: "Transaction ID is required"
                });
            }

            const { _id } = req.query;
            const result = await deleteTransactionService(_id);

            if (!result) {
                return res.status(404).json({
                    error: 1,
                    message: "Transaction not found"
                });
            }

            return res.status(200).json({
                error: 0,
                data: result,
                message: "Transaction deleted successfully"
            });
        } catch (error) {
            return res.status(500).json({
                error: 1,
                message: "Internal Server Error"
            });
        }
    }
}

module.exports = new TransactionController();
