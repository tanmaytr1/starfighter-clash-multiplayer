const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// New endpoint for OTP verification and final user creation
router.post("/verify-and-create-user", authController.verifyAndCreateUser);

module.exports = router;
