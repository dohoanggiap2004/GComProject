const express = require('express')
const router = express.Router()
const TaskController = require('../../app/controllers/apiController/TaskController')
const verifyJWT = require('../../middlewares/verifyJWT')
const verifyRoles = require('../../middlewares/verifyRoles')

// router.get('/', verifyJWT, verifyRoles('user'), TaskController.getTasks)
router.post('/', TaskController.createTask)
router.put('/', TaskController.updateTask)
router.delete('/', TaskController.deleteTask)

module.exports = router
