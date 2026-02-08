const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { generateVerificationCode, sendVerificationEmail, sendWelcomeEmail } = require('../utils/emailService');

// POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        error: {
          message: 'User with this email already exists',
          status: 400
        }
      });
    }
    
    // Generate 6-digit code with 10 min expiration
    const verificationCode = generateVerificationCode();
    const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);
    
    const user = new User({
      email,
      password,
      name,
      isVerified: false,
      verificationCode,
      verificationCodeExpires
    });
    
    await user.save();
    
    // Delete user if email fails to send
    try {
      await sendVerificationEmail(email, verificationCode, name);
    } catch (emailError) {
      await User.findByIdAndDelete(user._id);
      return res.status(500).json({
        error: {
          message: 'Failed to send verification email. Please try again.',
          status: 500
        }
      });
    }
    
    res.status(201).json({
      success: true,
      message: 'Registration successful. Please check your email for verification code.',
      data: {
        email: user.email,
        message: 'A verification code has been sent to your email. It will expire in 10 minutes.'
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

// POST /api/auth/verify
exports.verifyEmail = async (req, res, next) => {
  try {
    const { email, code } = req.body;
    
    if (!email || !code) {
      return res.status(400).json({
        error: {
          message: 'Email and verification code are required',
          status: 400
        }
      });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        error: {
          message: 'User not found',
          status: 404
        }
      });
    }
    
    if (user.isVerified) {
      return res.status(400).json({
        error: {
          message: 'Email already verified',
          status: 400
        }
      });
    }
    
    // Check code expiration
    if (user.verificationCodeExpires < new Date()) {
      return res.status(400).json({
        error: {
          message: 'Verification code has expired. Please request a new one.',
          status: 400
        }
      });
    }
    
    // Verify code match
    if (user.verificationCode !== code) {
      return res.status(400).json({
        error: {
          message: 'Invalid verification code',
          status: 400
        }
      });
    }
    
    // Mark user as verified and clear verification fields
    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();
    
    try {
      await sendWelcomeEmail(user.email, user.name);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
    }
    
    // Generate JWT token (24h expiration)
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      success: true,
      message: 'Email verified successfully',
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          isVerified: user.isVerified
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/resend-code
exports.resendVerificationCode = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        error: {
          message: 'Email is required',
          status: 400
        }
      });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        error: {
          message: 'User not found',
          status: 404
        }
      });
    }
    
    if (user.isVerified) {
      return res.status(400).json({
        error: {
          message: 'Email already verified',
          status: 400
        }
      });
    }
    
    // Generate new code
    const verificationCode = generateVerificationCode();
    const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);
    
    user.verificationCode = verificationCode;
    user.verificationCodeExpires = verificationCodeExpires;
    await user.save();
    
    await sendVerificationEmail(user.email, verificationCode, user.name);
    
    res.json({
      success: true,
      message: 'Verification code sent successfully',
      data: {
        message: 'A new verification code has been sent to your email.'
      }
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        error: {
          message: 'Email and password are required',
          status: 400
        }
      });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        error: {
          message: 'Invalid email or password',
          status: 401
        }
      });
    }
    
    // Only verified users can login
    if (!user.isVerified) {
      return res.status(403).json({
        error: {
          message: 'Please verify your email before logging in',
          status: 403
        }
      });
    }
    
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: {
          message: 'Invalid email or password',
          status: 401
        }
      });
    }
    
    // Generate JWT token (24h expiration)
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

// GET /api/auth/me
exports.getCurrentUser = async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: req.user
    });
  } catch (error) {
    next(error);
  }
};
