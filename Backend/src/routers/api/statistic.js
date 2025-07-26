const express = require('express')
const router = express.Router()
const StatisticController = require('../../app/controllers/apiController/StatisticController')
const verifyJWT = require('../../middlewares/verifyJWT')
const verifyRoles = require('../../middlewares/verifyRoles')
const checkBoardPermission = require("../../middlewares/checkBoardPermission");

// router.get('/', verifyJWT, verifyRoles('user'), StatisticController.getStatistics)
router.get('/member-quantity/:boardId', checkBoardPermission, StatisticController.getMemberQuantityInBoard)
router.get('/card-quantity/:boardId', checkBoardPermission, StatisticController.getCardQuantityInBoard)
router.get('/task-quantity/:boardId', checkBoardPermission, StatisticController.getTaskQuantityInBoard)
router.get('/productive-member/:boardId', checkBoardPermission, StatisticController.getProductiveMembers)
router.get('/monthly-progress/:boardId', checkBoardPermission, StatisticController.getMonthlyProgress)
router.get('/task-in-list/:boardId', checkBoardPermission, StatisticController.getTaskQuantityInList)

//for admin dashboard
router.get('/monthly-revenue', StatisticController.getMonthlyRevenue)
router.get('/revenue', StatisticController.getRevenue)
router.get('/workspace-quantity', StatisticController.getWorkspaceQuantityInWeb)
router.get('/user-quantity', StatisticController.getUserQuantityInWeb)

module.exports = router
