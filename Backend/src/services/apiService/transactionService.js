const Transaction = require('../../app/models/Transaction')

const getAllTransactionsService = async () => {
    return Transaction.find().lean()
}

const createTransactionService = async (transaction) => {
    const newTransaction = new Transaction(transaction)
    return await newTransaction.save()
}

const updateTransactionService = async (transaction) => {
    const {_id, ...updateFields} = transaction
    return Transaction.findByIdAndUpdate(
        _id,
        {$set: updateFields},
        {new: true}
    ).lean()
}

const deleteTransactionService = async (transactionId) => {
    return Transaction.deleteOne({
        _id: transactionId
    })
}

const getMonthlyRevenueService = async () => {
    const monthlyRevenue = await Transaction.aggregate([
        {
            $group: {
                _id: {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" }
                },
                totalAmount: { $sum: "$amount" },
                count: { $sum: 1 } // (tuỳ chọn) đếm số giao dịch
            }
        },
        {
            $sort: { "_id.year": 1, "_id.month": 1 } // sắp xếp theo thời gian
        }
    ]);

    return monthlyRevenue
}

const getAllRevenueService = async () => {
    const revenue = await Transaction.aggregate([
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: "$amount" }
            }
        }
    ]);
    return revenue
}

module.exports = {
    createTransactionService,
    updateTransactionService,
    deleteTransactionService,
    getAllTransactionsService,
    getMonthlyRevenueService,
    getAllRevenueService,
}
