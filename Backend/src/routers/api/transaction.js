const express = require('express')
const router = express.Router()
const TransactionController = require('../../app/controllers/apiController/TransactionController')
const verifyJWT = require('../../middlewares/verifyJWT')
const verifyRoles = require('../../middlewares/verifyRoles')

// router.get('/', verifyJWT, verifyRoles('user'), TransactionController.getCards)
router.get('/', TransactionController.getTransactions)
router.post('/', TransactionController.createTransaction)
router.put('/', TransactionController.updateTransaction)
router.delete('/', TransactionController.deleteTransaction)

module.exports = router
