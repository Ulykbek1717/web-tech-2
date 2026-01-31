const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware to verify JWT token and authenticate user
 * Adds user object to req.user if token is valid
 */
const authenticate = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: {
          message: 'Access denied. No token provided.',
          status: 401
        }
      });
    }
    
    // Extract token
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({
        error: {
          message: 'Invalid token. User not found.',
          status: 401
        }
      });
    }
    
    // Add user to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: {
          message: 'Invalid token.',
          status: 401
        }
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: {
          message: 'Token expired.',
          status: 401
        }
      });
    }
    next(error);
  }
};

module.exports = authenticate;
