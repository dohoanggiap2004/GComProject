const express = require('express')
const router = express.Router()
const BoardController = require('../../app/controllers/apiController/BoardController')
const verifyJWT = require('../../middlewares/verifyJWT')
const verifyRoles = require('../../middlewares/verifyRoles')

// router.get('/', verifyJWT, verifyRoles('user'), BoardController.getBoards)
router.get('/', BoardController.getBoards)
router.get('/:_id', BoardController.getBoardById)
router.get('/workspace/:workspaceId', BoardController.getBoardByWorkspaceId)
router.post('/', BoardController.createBoard)
router.put('/re-card', BoardController.reorderCard)
router.put('/', BoardController.updateBoard)
router.delete('/', BoardController.deleteBoard)

module.exports = router
