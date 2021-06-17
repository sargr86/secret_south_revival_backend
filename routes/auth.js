const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validateRegister = require('../validators/validateRegister');
const validateLogin = require('../validators/validateLogin');

router.post('/register', validateRegister.rules, authController.register);
router.post('/login', validateLogin.rules, authController.login);

module.exports = router;
