const express = require('express');
const router = express.Router();
const { param } = require('express-validator');
const adminController = require('../controllers/admin.controller');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth.middleware');
const { handleValidationErrors } = require('../utils/validators');

// All admin routes require authentication and admin role
router.use(authenticateToken, authorizeAdmin);

router.get('/users', adminController.getAllUsers);
router.patch(
	'/users/:userId/activate',
	[param('userId').isMongoId().withMessage('Invalid user ID')],
	handleValidationErrors,
	adminController.activateUser
);
router.patch(
	'/users/:userId/deactivate',
	[param('userId').isMongoId().withMessage('Invalid user ID')],
	handleValidationErrors,
	adminController.deactivateUser
);

module.exports = router;
