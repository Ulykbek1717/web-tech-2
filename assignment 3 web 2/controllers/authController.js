const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * POST /api/auth/register - Register a new user
 */
exports.register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        error: {
          message: 'User with this email already exists',
          status: 400
        }
      });
    }
    
    // Create new user
    const user = new User({
      email,
      password, // Will be hashed by pre-save hook
      name
    });
    
    await user.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role
        },
        token
      }
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
 * POST /api/auth/login - Login user
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        error: {
          message: 'Email and password are required',
          status: 400
        }
      });
    }
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        error: {
          message: 'Invalid email or password',
          status: 401
        }
      });
    }
    
    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: {
          message: 'Invalid email or password',
          status: 401
        }
      });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/me - Get current user profile
 */
exports.getCurrentUser = async (req, res, next) => {
  try {
    // req.user is set by authenticate middleware
    res.json({
      success: true,
      data: req.user
    });
  } catch (error) {
    next(error);
  }
};
