const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const reviewController = require('../controllers/reviewController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

// Validation middleware
const validateReview = [
  body('productId')
    .notEmpty().withMessage('Product ID is required')
    .isMongoId().withMessage('Invalid product ID'),
  body('author')
    .trim()
    .notEmpty().withMessage('Author name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Author name must be 2-100 characters'),
  body('rating')
    .notEmpty().withMessage('Rating is required')
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment')
    .trim()
    .notEmpty().withMessage('Comment is required')
    .isLength({ min: 10, max: 1000 }).withMessage('Comment must be 10-1000 characters')
];

const validateId = [
  param('id').isMongoId().withMessage('Invalid review ID')
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

// GET /api/reviews - Get all reviews (Public)
router.get('/', reviewController.getAllReviews);

// GET /api/reviews/:id - Get a single review by ID (Public)
router.get('/:id', validateId, handleValidation, reviewController.getReviewById);

// POST /api/reviews - Create a new review (Authenticated users)
router.post('/', authenticate, validateReview, handleValidation, reviewController.createReview);

// PUT /api/reviews/:id - Update a review (Admin/Superadmin only)
router.put('/:id', authenticate, authorize('admin', 'superadmin'), validateId, handleValidation, reviewController.updateReview);

// DELETE /api/reviews/:id - Delete a review (Admin/Superadmin only)
router.delete('/:id', authenticate, validateId, handleValidation, reviewController.deleteReview);

module.exports = router;
