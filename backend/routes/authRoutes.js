const express = require('express');
const { registerUser, loginUser, verifyEmail, resendVerification } = require('../controllers/authController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/verify/:token', verifyEmail);
router.post('/resend-verification', resendVerification);

module.exports = router;
