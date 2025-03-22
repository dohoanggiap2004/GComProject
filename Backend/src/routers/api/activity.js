const express = require('express')
const router = express.Router()
const ActivityController = require('../../app/controllers/apiController/ActivityController')
const verifyJWT = require('../../middlewares/verifyJWT')
const verifyRoles = require('../../middlewares/verifyRoles')

// router.get('/', verifyJWT, verifyRoles('user'), ActivityController.getActivitys)
router.get('/:_id', ActivityController.getActivityByCardId)
router.post('/', ActivityController.createActivity)


module.exports = router
