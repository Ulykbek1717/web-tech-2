const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const authController = require('../controllers/authController');
const authenticate = require('../middleware/authenticate');

// Validation middleware
const validateRegistration = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('name')
    .optional()
    .trim()
];

const validateLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),
  body('password')
    .notEmpty().withMessage('Password is required')
];

// Helper function to handle validation errors
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

// POST /api/auth/register - Register new user
router.post('/register', validateRegistration, handleValidation, authController.register);

// POST /api/auth/login - Login user
router.post('/login', validateLogin, handleValidation, authController.login);

// GET /api/auth/me - Get current user (requires authentication)
router.get('/me', authenticate, authController.getCurrentUser);

module.exports = router;
