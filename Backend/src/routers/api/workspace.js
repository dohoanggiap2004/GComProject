const express = require('express')
const router = express.Router()
const WorkspaceController = require('../../app/controllers/apiController/WorkspaceController')
const verifyJWT = require('../../middlewares/verifyJWT')
const verifyRoles = require('../../middlewares/verifyRoles')

// router.get('/', verifyJWT, verifyRoles('user'), WorkspaceController.getWorkspaces)
// router.all('*', verifyJWT)
router.get('/member', WorkspaceController.getWorkspaceByMemberId)
router.get('/:workspaceId', WorkspaceController.getWorkspaceByWorkspaceId)
router.get('/member-board/:workspaceId', WorkspaceController.getMemberInBoardsByWorkspaceId)
router.post('/', WorkspaceController.createWorkspace)
router.put('/', WorkspaceController.updateWorkspace)
router.delete('/', WorkspaceController.deleteWorkspace)

module.exports = router
