const { payos } = require('../../config/payos')
const express = require('express')
const router = express.Router()
const PayOsController = require('../../app/controllers/apiController/PayOsController')
const verifyJWT = require('../../middlewares/verifyJWT')

router.post('/create-payment-link', verifyJWT, PayOsController.createPaymentLink)
router.post('/receive-hook', PayOsController.ReceiveWebhook)

module.exports = router
