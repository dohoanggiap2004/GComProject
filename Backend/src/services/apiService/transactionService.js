const Transaction = require('../../app/models/Transaction')

const getAllTransactionsService = async () => {
    return Transaction.find().lean()
}

const createTransactionService = async (transaction) => {
    const newTransaction = new Transaction(transaction)
    return await newTransaction.save()
}

const updateTransactionService = async (transaction) => {
    const {_id, updateFields} = transaction
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

module.exports = {
    createTransactionService,
    updateTransactionService,
    deleteTransactionService,
    getAllTransactionsService
}
