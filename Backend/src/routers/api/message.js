const express = require('express');
const router = express.Router();
const MessageController = require('../../app/controllers/apiController/MessageController');

router.get('/board-with-messages', MessageController.getBoardWithMessagesByMemberId)

module.exports = router;
