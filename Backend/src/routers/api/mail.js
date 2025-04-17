const express = require('express')
const router = express.Router()
const { sendMail } = require('../../app/controllers/apiController/MailController')
const verifyRoles = require('../../middlewares/verifyRoles')

router.post('/send-mail', sendMail)

module.exports = router
