const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validateRegister = require('../validators/validateRegister');
const validateLogin = require('../validators/validateLogin');
const validateVerificationCode = require('../validators/validateVerificationCode');

router.post('/send-verification-code', validateRegister.rules, authController.sendVerificationCode);
router.post('/send-forgot-pass', validateRegister.rules, authController.sendForgotPassEmail);
router.post('/verify-code', validateVerificationCode.rules, authController.verifyCode);
router.post('/login', validateLogin.rules, authController.login);

module.exports = router;
