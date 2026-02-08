const Order = require('../models/Order');
const Product = require('../models/Product');

// POST /api/orders
exports.createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod, notes } = req.body;
    
    if (!items || items.length === 0) {
      return res.status(400).json({
        error: {
          message: 'Order must contain at least one item',
          status: 400
        }
      });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({
          error: {
            message: `Product not found: ${item.productId}`,
            status: 404
          }
        });
      }

      orderItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity
      });

      totalAmount += product.price * item.quantity;
    }

    const order = new Order({
      userId: req.user._id,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod,
      notes,
      status: 'pending'
    });

    await order.save();

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  } catch (error) {
    next(error);
  }
};
// DELETE /api/orders/:id (Admin only)// GET /api/orders (clients see only their orders, admins see all)
exports.getAllOrders = async (req, res, next) => {
  try {
    let query = {};
    
    if (req.user.role === 'client') {
      query.userId = req.user._id;
    }

    const orders = await Order.find(query)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/orders/:id
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('userId', 'name email');

    if (!order) {
      return res.status(404).json({
        error: {
          message: 'Order not found',
          status: 404
        }
      });
    }

    // Check permission to view order
    if (req.user.role === 'client' && order.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: {
          message: 'Access denied',
          status: 403
        }
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/orders/:id/status (Admin only)
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    const validStatuses = ['pending', 'processing', 'paid', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: {
          message: 'Invalid status',
          status: 400,
          validStatuses
        }
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        error: {
          message: 'Order not found',
          status: 404
        }
      });
    }

    order.status = status;
    await order.save();

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error) {
    next(error);
  }
};


exports.deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({
        error: {
          message: 'Order not found',
          status: 404
        }
      });
    }

    res.json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
