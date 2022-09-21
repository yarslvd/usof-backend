const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');
const userController = require('../controller/userController');
const postController = require('../controller/postController');
const categoryController = require('../controller/categoryController');
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
router.post('/api/users', authenticateToken, userController.createUser);
router.patch('/api/users/:user_id', authenticateToken, userController.updateUserData);
router.delete('/api/users/:user_id', authenticateToken, userController.deleteUser);

//POST CONTROLLER
router.get('/api/posts', postController.getAllPosts);
router.get('/api/posts/:post_id', postController.getPost);
router.get('/api/posts/:post_id/comments', postController.getComments);
router.post('/api/posts/:post_id/comments', authenticateToken, postController.addComment);
router.get('/api/posts/:post_id/categories', authenticateToken, postController.getCategories);
router.get('/api/posts/:post_id/like', authenticateToken, postController.getLikes);
router.post('/api/posts/', authenticateToken, postController.createPost);
router.post('/api/posts/:post_id/like', authenticateToken, postController.addLike);
router.patch('/api/posts/:post_id', authenticateToken, postController.editPost);
router.delete('/api/posts/:post_id', authenticateToken, postController.deletePost);
router.delete('/api/posts/:post_id/like', authenticateToken, postController.deleteLike);

//CATEGORY CONTROLLER
router.get('/api/categories', authenticateToken, categoryController.getAllCategories);
router.get('/api/categories/:category_id', authenticateToken, categoryController.getCategory);
router.get('/api/categories/:category_id/posts', authenticateToken, categoryController.getPostsCategory);
router.post('/api/categories', authenticateToken, categoryController.createCategory);
router.patch('/api/categories/:category_id', authenticateToken, categoryController.editCategory);
router.delete('/api/categories/:category_id', authenticateToken, categoryController.deleteCategory);

module.exports = router;