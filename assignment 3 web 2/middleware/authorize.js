/**
 * Middleware to check if user has required role(s)
 * Usage: authorize('admin'), authorize(['admin', 'superadmin'])
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: {
          message: 'Authentication required',
          status: 401
        }
      });
    }

    const userRole = req.user.role;
    
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        error: {
          message: 'Access denied. Insufficient permissions.',
          status: 403,
          requiredRole: allowedRoles,
          yourRole: userRole
        }
      });
    }

    next();
  };
};

module.exports = authorize;
