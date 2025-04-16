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
                return res.status(200).json({message: "Transaction not found"});
            }

            res.status(200).json({
                data: transactions,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({message: "Internal Server Error"});
        }
    }

    async createTransaction(req, res) {
        try {
            if (!req?.body)
                return res.status(400).json({message: "Transaction information is required"});

            const transaction = req.body;
            const newTransaction = await createTransactionService(transaction);
            res.status(201).json({
                newTransaction: newTransaction,
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({message: "Internal Server Error"});
        }
    }

    async updateTransaction(req, res) {
        try {
            if (!req?.body)
                return res.status(400).json({message: "Transaction information is required"});
            const transaction = req.body;
            const result = await updateTransactionService(transaction);

            if (!result) return res.status(200).json({message: "No transaction changed"});

            res.status(200).json({
                rowsEffected: result,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({message: "Internal Server Error"});
        }
    }

    async deleteTransaction(req, res) {
        try {
            if (!req?.query)
                return res.status(400).json({message: "Transaction information is required"});
            const {_id} = req.query;
            const result = await deleteTransactionService(_id);
            if (!result) return res.status(200).json({message: "No transaction be deleted"});

            res.status(200).json({
                rowsEffected: result,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({message: "Internal Server Error"});
        }
    }
}

module.exports = new TransactionController();
