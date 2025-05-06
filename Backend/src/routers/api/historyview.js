const express = require('express')
const router = express.Router()
const HistoryViewController = require('../../app/controllers/apiController/HistoryViewController')
const verifyJWT = require('../../middlewares/verifyJWT')
const verifyRoles = require('../../middlewares/verifyRoles')

router.get('/', HistoryViewController.getBoardsInHistoryViewByUserId)
router.post('/', HistoryViewController.createHistoryView)
// router.put('/', HistoryViewController.updateHistoryView)


module.exports = router
