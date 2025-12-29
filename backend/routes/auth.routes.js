const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { handleValidationErrors } = require('../utils/validators');

// Public routes
router.post(
	'/signup',
	[
		body('fullName').isString().isLength({ min: 2 }).withMessage('Full name must be at least 2 characters'),
		body('email').isEmail().withMessage('Invalid email'),
		body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
	],
	handleValidationErrors,
	authController.signup
);

router.post(
	'/login',
	[
		body('email').isEmail().withMessage('Invalid email'),
		body('password').notEmpty().withMessage('Password is required')
	],
	handleValidationErrors,
	authController.login
);

// Protected routes
router.get('/me', authenticateToken, authController.getCurrentUser);
router.post('/logout', authenticateToken, authController.logout);

module.exports = router;
