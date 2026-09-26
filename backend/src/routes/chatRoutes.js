const express = require('express');
const { protect, optionalAuth } = require('../middlewares/authMiddleware');
const { chat, getChatHistory } = require('../controllers/chatController');

const router = express.Router();

router.post('/',        optionalAuth, chat);
router.get('/history',  protect, getChatHistory);

module.exports = router;
