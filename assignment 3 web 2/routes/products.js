const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const productController = require('../controllers/productController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

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

// GET /api/products - Retrieve all products (Public)
router.get('/', productController.getAllProducts);

// GET /api/products/:id - Retrieve a single product by ID (Public)
router.get('/:id', validateId, handleValidation, productController.getProductById);

// POST /api/products - Create a new product (Admin/Superadmin only)
router.post('/', authenticate, authorize('admin', 'superadmin'), validateProduct, handleValidation, productController.createProduct);

// PUT /api/products/:id - Update an existing product (Admin/Superadmin only)
router.put('/:id', authenticate, authorize('admin', 'superadmin'), [...validateId, ...validateProduct], handleValidation, productController.updateProduct);

// DELETE /api/products/:id - Delete a product (Admin/Superadmin only)
router.delete('/:id', authenticate, validateId, handleValidation, productController.deleteProduct);

module.exports = router;