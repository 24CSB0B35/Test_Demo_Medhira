import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // If no token, check for mock token (for development)
    if (!token) {
      // Check if it's a mock token from your current auth system
      if (req.headers.authorization && req.headers.authorization.startsWith('Bearer mock-jwt-token')) {
        // Create a mock user for development
        req.user = {
          _id: '65a1b2c3d4e5f6a7b8c9d0e1', // Mock user ID
          id: '65a1b2c3d4e5f6a7b8c9d0e1',
          username: 'testuser',
          email: 'test@test.com'
        };
        return next();
      }
      
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    try {
      // For real JWT tokens
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id);
      
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }
      
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error in authentication'
    });
  }
};