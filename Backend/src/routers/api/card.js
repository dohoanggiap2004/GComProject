const express = require('express')
const router = express.Router()
const CardController = require('../../app/controllers/apiController/CardController')
const verifyJWT = require('../../middlewares/verifyJWT')
const verifyRoles = require('../../middlewares/verifyRoles')

// router.get('/', verifyJWT, verifyRoles('user'), CardController.getCards)
// router.get('/', CardController.getCards)
router.get('/', CardController.getCardByIdWithTasks)
router.post('/', CardController.createCard)
router.put('/', CardController.updateCard)
router.put('/add-member', CardController.addMemberToCard)
router.put('/remove-member', CardController.removeMemberFromCard)
router.delete('/', CardController.deleteCard)

module.exports = router
