const express = require('express')
const router = express.Router()
const ListController = require('../../app/controllers/apiController/ListController')
const verifyJWT = require('../../middlewares/verifyJWT')
const verifyRoles = require('../../middlewares/verifyRoles')

// router.get('/', verifyJWT, verifyRoles('user'), BoardController.getBoards)
// router.get('/:_id', ListController.getListByBoardId)
router.post('/', ListController.createList)
router.put('/', ListController.updateList)
router.delete('/', ListController.deleteList)

module.exports = router
