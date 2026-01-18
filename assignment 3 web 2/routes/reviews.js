const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const Review = require('../models/Review');
const Product = require('../models/Product');

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

// GET /api/reviews - Get all reviews (optionally filtered by productId)
router.get('/', async (req, res, next) => {
  try {
    const { productId } = req.query;
    
    let query = {};
    if (productId) {
      query.productId = productId;
    }
    
    const reviews = await Review.find(query)
      .populate('productId', 'name price')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/reviews/:id - Get a single review by ID
router.get('/:id', validateId, handleValidation, async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('productId', 'name price');
    
    if (!review) {
      return res.status(404).json({
        error: {
          message: 'Review not found',
          status: 404
        }
      });
    }
    
    res.json({
      success: true,
      data: review
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/reviews - Create a new review
router.post('/', validateReview, handleValidation, async (req, res, next) => {
  try {
    const { productId, author, rating, comment, verified } = req.body;
    
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        error: {
          message: 'Product not found',
          status: 404
        }
      });
    }
    
    const review = new Review({
      productId,
      author,
      rating,
      comment,
      verified
    });
    
    const savedReview = await review.save();
    
    // Update product rating
    await product.updateRating(rating);
    
    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: savedReview
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: {
          message: 'Validation failed',
          details: Object.values(error.errors).map(err => ({
            field: err.path,
            message: err.message
          }))
        }
      });
    }
    next(error);
  }
});

// PUT /api/reviews/:id - Update a review
router.put('/:id', [...validateId, ...validateReview], handleValidation, async (req, res, next) => {
  try {
    const { productId, author, rating, comment, verified } = req.body;
    
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      {
        productId,
        author,
        rating,
        comment,
        verified
      },
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!review) {
      return res.status(404).json({
        error: {
          message: 'Review not found',
          status: 404
        }
      });
    }
    
    res.json({
      success: true,
      message: 'Review updated successfully',
      data: review
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: {
          message: 'Validation failed',
          details: Object.values(error.errors).map(err => ({
            field: err.path,
            message: err.message
          }))
        }
      });
    }
    next(error);
  }
});

// DELETE /api/reviews/:id - Delete a review
router.delete('/:id', validateId, handleValidation, async (req, res, next) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        error: {
          message: 'Review not found',
          status: 404
        }
      });
    }
    
    res.json({
      success: true,
      message: 'Review deleted successfully',
      data: review
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
