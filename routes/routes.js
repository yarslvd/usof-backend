const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');
const userController = require('../controller/userController');
const { authenticateToken } = require("../utils/jwt");

//pages
router.get('/', authenticateToken, authController.homePage);
router.get('/signup', authController.signUpPage);
router.get('/login', authController.loginPage);


//AUTH CONTROLLERS
router.post('/api/auth/register', authController.register);
router.post('/api/auth/confirm/:token', authController.confirmEmail);
router.post('/api/auth/login', authController.login);
router.post('/api/auth/logout', authenticateToken, authController.logout);
router.post('/api/auth/password-reset', authController.passwordReset);
router.post('/api/auth/password-reset/:token', authController.confirmPasswordReset);

//USER CONTROLLERS
router.get('/api/users', authenticateToken, userController.getAllUsers);
router.get('/api/users/:user_id', authenticateToken, userController.getUser);

module.exports = router;