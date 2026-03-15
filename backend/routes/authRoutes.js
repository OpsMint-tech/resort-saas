const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/verify-otp', authController.verifyOTP);
router.get('/verify-link', authController.verifyLink);
router.post('/login', authController.login);

module.exports = router;
