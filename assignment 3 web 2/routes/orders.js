const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const orderController = require('../controllers/orderController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

// Validation middleware
const validateOrder = [
  body('items')
    .isArray({ min: 1 }).withMessage('Items must be a non-empty array'),
  body('items.*.productId')
    .notEmpty().withMessage('Product ID is required')
    .isMongoId().withMessage('Invalid product ID'),
  body('items.*.quantity')
    .isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('shippingAddress.fullName')
    .trim()
    .notEmpty().withMessage('Full name is required'),
  body('shippingAddress.address')
    .trim()
    .notEmpty().withMessage('Address is required'),
  body('shippingAddress.city')
    .trim()
    .notEmpty().withMessage('City is required'),
  body('shippingAddress.postalCode')
    .trim()
    .notEmpty().withMessage('Postal code is required'),
  body('shippingAddress.country')
    .trim()
    .notEmpty().withMessage('Country is required'),
  body('shippingAddress.phone')
    .trim()
    .notEmpty().withMessage('Phone is required'),
  body('paymentMethod')
    .optional()
    .isIn(['cash_on_delivery', 'card', 'bank_transfer'])
    .withMessage('Invalid payment method')
];

const validateId = [
  param('id').isMongoId().withMessage('Invalid order ID')
];

const validateStatus = [
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['pending', 'processing', 'paid', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Invalid status')
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

// POST /api/orders - Create order (All authenticated users)
router.post('/', authenticate, validateOrder, handleValidation, orderController.createOrder);

// GET /api/orders - Get all orders (Clients see only their orders, Admins see all)
router.get('/', authenticate, orderController.getAllOrders);

// GET /api/orders/:id - Get order by ID
router.get('/:id', authenticate, validateId, handleValidation, orderController.getOrderById);

// PUT /api/orders/:id/status - Update order status (Admin/Superadmin only)
router.put('/:id/status', authenticate, authorize('admin', 'superadmin'), [...validateId, ...validateStatus], handleValidation, orderController.updateOrderStatus);

// DELETE /api/orders/:id - Delete order (Superadmin only)
router.delete('/:id', authenticate, authorize('superadmin'), validateId, handleValidation, orderController.deleteOrder);

module.exports = router;
