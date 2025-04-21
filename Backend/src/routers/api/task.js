const express = require('express')
const router = express.Router()
const TaskController = require('../../app/controllers/apiController/TaskController')
const verifyJWT = require('../../middlewares/verifyJWT')
const verifyRoles = require('../../middlewares/verifyRoles')

// router.get('/', verifyJWT, verifyRoles('user'), TaskController.getTasks)
router.post('/', TaskController.createTask)
router.put('/', TaskController.updateTask)
router.put('/add-member', TaskController.addMemberToTask)
router.put('/remove-member', TaskController.removeMemberFromTask)
router.delete('/', TaskController.deleteTask)

module.exports = router
