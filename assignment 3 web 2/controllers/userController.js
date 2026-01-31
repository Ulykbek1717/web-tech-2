const User = require('../models/User');

/**
 * GET /api/users - Get all users (Superadmin only)
 */
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/users/:id - Get user by ID (Superadmin only)
 */
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        error: {
          message: 'User not found',
          status: 404
        }
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/users/:id/role - Update user role (Superadmin only)
 */
exports.updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    
    const validRoles = ['client', 'admin', 'superadmin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        error: {
          message: 'Invalid role',
          status: 400,
          validRoles
        }
      });
    }

    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        error: {
          message: 'User not found',
          status: 404
        }
      });
    }

    user.role = role;
    await user.save();

    res.json({
      success: true,
      message: 'User role updated successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/users/:id - Delete user (Superadmin only)
 */
exports.deleteUser = async (req, res, next) => {
  try {
    // Prevent superadmin from deleting themselves
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({
        error: {
          message: 'Cannot delete your own account',
          status: 400
        }
      });
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        error: {
          message: 'User not found',
          status: 404
        }
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
