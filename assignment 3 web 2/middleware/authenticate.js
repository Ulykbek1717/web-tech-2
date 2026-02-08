const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT token and attach user to request
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: {
          message: 'Access denied. No token provided.',
          status: 401
        }
      });
    }
    
    // Extract token from Bearer header
    const token = authHeader.substring(7);
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
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
