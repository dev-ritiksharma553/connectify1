const express = require('express');
const isAuth = require('../middleware/isAuth');
const router = express.Router();
const messageController = require('../controllers/messageController')

router.route('/send/:id').post(isAuth,messageController.sendMessage);
router.route('/getallmessage/:id').get(isAuth,messageController.getAllMessages);

module.exports = router;