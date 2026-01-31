const Review = require('../models/Review');
const Product = require('../models/Product');

/**
 * GET /api/reviews - Get all reviews (optionally filtered by productId)
 */
exports.getAllReviews = async (req, res, next) => {
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
};

/**
 * GET /api/reviews/:id - Get a single review by ID
 */
exports.getReviewById = async (req, res, next) => {
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
};

/**
 * POST /api/reviews - Create a new review (Authenticated users)
 */
exports.createReview = async (req, res, next) => {
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
    
    // Update product ratings
    const avgRating = await Review.getAverageRating(productId);
    await Product.findByIdAndUpdate(productId, {
      'ratings.average': avgRating,
      $inc: { 'ratings.count': 1 }
    });
    
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
};

/**
 * PUT /api/reviews/:id - Update a review (Admin only)
 */
exports.updateReview = async (req, res, next) => {
  try {
    const { author, rating, comment, verified, helpful } = req.body;
    
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      {
        author,
        rating,
        comment,
        verified,
        helpful
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
    
    // Recalculate product ratings
    const avgRating = await Review.getAverageRating(review.productId);
    await Product.findByIdAndUpdate(review.productId, {
      'ratings.average': avgRating
    });
    
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
};

/**
 * DELETE /api/reviews/:id - Delete a review (Admin only)
 */
exports.deleteReview = async (req, res, next) => {
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
    
    // Recalculate product ratings
    const avgRating = await Review.getAverageRating(review.productId);
    const reviewCount = await Review.countDocuments({ productId: review.productId });
    await Product.findByIdAndUpdate(review.productId, {
      'ratings.average': avgRating,
      'ratings.count': reviewCount
    });
    
    res.json({
      success: true,
      message: 'Review deleted successfully',
      data: review
    });
  } catch (error) {
    next(error);
  }
};
