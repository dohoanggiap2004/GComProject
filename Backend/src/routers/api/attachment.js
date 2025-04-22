const express = require('express')
const router = express.Router()
const AttachmentController = require('../../app/controllers/apiController/AttachmentController')
const upload = require('../../middlewares/uploadFile');
const verifyJWT = require('../../middlewares/verifyJWT')
const verifyRoles = require('../../middlewares/verifyRoles')

// router.get('/', verifyJWT, verifyRoles('user'), AttachmentController.getAttachments)
router.get('/:cardId', AttachmentController.getAttachmentsByCardId)
router.post('/', upload.single('file'), AttachmentController.uploadAttachment)
router.delete('/', AttachmentController.deleteAttachment)

module.exports = router
