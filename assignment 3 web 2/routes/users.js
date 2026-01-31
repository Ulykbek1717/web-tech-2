const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const userController = require('../controllers/userController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

// Validation middleware
const validateId = [
  param('id').isMongoId().withMessage('Invalid user ID')
];

const validateRole = [
  body('role')
    .notEmpty().withMessage('Role is required')
    .isIn(['client', 'admin', 'superadmin'])
    .withMessage('Invalid role')
];

// Helper function
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: {
        message: 'Validation failed',
        details: errors.array()
      }
    });
  }
  next();
};

// All routes require superadmin role
// GET /api/users - Get all users
router.get('/', authenticate, authorize('superadmin'), userController.getAllUsers);

// GET /api/users/:id - Get user by ID
router.get('/:id', authenticate, authorize('superadmin'), validateId, handleValidation, userController.getUserById);

// PUT /api/users/:id/role - Update user role
router.put('/:id/role', authenticate, authorize('superadmin'), [...validateId, ...validateRole], handleValidation, userController.updateUserRole);

// DELETE /api/users/:id - Delete user
router.delete('/:id', authenticate, authorize('superadmin'), validateId, handleValidation, userController.deleteUser);

module.exports = router;
