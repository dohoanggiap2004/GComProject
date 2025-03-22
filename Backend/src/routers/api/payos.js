const { payos } = require('../../config/payos')
const express = require('express')
const router = express.Router()
const PayOsController = require('../../app/controllers/apiController/PayOsController')

router.post('/create-payment-link', PayOsController.createPaymentLink)

module.exports = router
