const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userController = require('../controllers/user.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { handleValidationErrors } = require('../utils/validators');

// All user routes require authentication
router.use(authenticateToken);

router.get('/profile', userController.getProfile);
router.put(
	'/profile',
	[
		body('fullName').optional().isString().isLength({ min: 2 }).withMessage('Full name must be at least 2 characters'),
		body('email').optional().isEmail().withMessage('Invalid email')
	],
	handleValidationErrors,
	userController.updateProfile
);

router.put(
	'/change-password',
	[
		body('currentPassword').notEmpty().withMessage('Current password is required'),
		body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
	],
	handleValidationErrors,
	userController.changePassword
);

module.exports = router;
