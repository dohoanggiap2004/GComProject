const express = require('express')
const router = express.Router()
const UserController = require('../../app/controllers/apiController/UserController')
const verifyJWT = require('../../middlewares/verifyJWT')
const verifyRoles = require('../../middlewares/verifyRoles')

// router.get('/', verifyJWT, verifyRoles('user'), UserController.getUsers)
router.get('/', verifyRoles('admin'), UserController.getUsers)
router.get('/info', UserController.getUserById)
router.get('/search', UserController.searchUserByEmailAndName)
router.get('/role', UserController.userRoleInWorkspaceOrBoard)
router.get('/quantity-workspace', UserController.countUserWorkspaces)
router.post('/', verifyRoles('admin'), UserController.createUser)
router.put('/', verifyRoles('admin'), UserController.updateUser)
router.delete('/', verifyRoles('admin'), UserController.deleteUser)

module.exports = router
