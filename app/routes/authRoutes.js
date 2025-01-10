const express = require('express');
const router = express.Router();
const AuthController = require("../controllers/authController");

const authController = new AuthController();

router.post('/signup', (req, res) => authController.signup(req, res)); 
router.post('/verify-otp', (req, res) => authController.verifyOtp(req, res)); 
router.post('/login', (req, res) => authController.loginRequest(req, res));
router.post('/verify-login', (req, res) => authController.loginVerify(req, res));

module.exports = router;
