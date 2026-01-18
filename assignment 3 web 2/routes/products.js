const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const Product = require('../models/Product');

// Validation middleware
const validateProduct = [
  body('name')
    .trim()
    .notEmpty().withMessage('Product name is required')
    .isLength({ min: 3, max: 200 }).withMessage('Name must be 3-200 characters'),
  body('price')
    .notEmpty().withMessage('Price is required')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 10, max: 2000 }).withMessage('Description must be 10-2000 characters'),
  body('category')
    .notEmpty().withMessage('Category is required')
    .isIn(['electronics', 'apparel', 'home', 'other']).withMessage('Invalid category')
];

const validateId = [
  param('id').isMongoId().withMessage('Invalid product ID')
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

// GET /api/products - Retrieve all products
router.get('/', async (req, res, next) => {
  try {
    const { category, sort, limit } = req.query;
    
    // Build query
    let query = {};
    if (category) {
      query.category = category;
    }
    
    // Build sort
    let sortOption = { createdAt: -1 }; // Default: newest first
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };
    if (sort === 'name') sortOption = { name: 1 };
    
    // Execute query
    let productsQuery = Product.find(query).sort(sortOption);
    
    if (limit) {
      productsQuery = productsQuery.limit(parseInt(limit));
    }
    
    const products = await productsQuery;
    
    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/products/:id - Retrieve a single product by ID
router.get('/:id', validateId, handleValidation, async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        error: {
          message: 'Product not found',
          status: 404
        }
      });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/products - Create a new product
router.post('/', validateProduct, handleValidation, async (req, res, next) => {
  try {
    const { name, price, description, category, imageUrl, stock, featured } = req.body;
    
    const product = new Product({
      name,
      price,
      description,
      category,
      imageUrl,
      stock,
      featured
    });
    
    const savedProduct = await product.save();
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: savedProduct
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

// PUT /api/products/:id - Update an existing product
router.put('/:id', [...validateId, ...validateProduct], handleValidation, async (req, res, next) => {
  try {
    const { name, price, description, category, imageUrl, stock, featured } = req.body;
    
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        price,
        description,
        category,
        imageUrl,
        stock,
        featured
      },
      {
        new: true, // Return updated document
        runValidators: true // Run schema validators
      }
    );
    
    if (!product) {
      return res.status(404).json({
        error: {
          message: 'Product not found',
          status: 404
        }
      });
    }
    
    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product
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

// DELETE /api/products/:id - Delete a product
router.delete('/:id', validateId, handleValidation, async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        error: {
          message: 'Product not found',
          status: 404
        }
      });
    }
    
    res.json({
      success: true,
      message: 'Product deleted successfully',
      data: product
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
