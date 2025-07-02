const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
  register,
  login,
  getProfile,
  logout,
  refreshToken
} = require('../controllers/authController');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user (patient, doctor, admin)
 * @access  Public
 * @body    { name, email, phone, password, role, dateOfBirth?, specialty?, licenseNumber?, experience?, bio? }
 */
router.post('/register', register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user with email/phone and password
 * @access  Public
 * @body    { identifier, password, role? }
 */
router.post('/login', login);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', authenticate, getProfile);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', authenticate, logout);

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh JWT token
 * @access  Private
 */
router.post('/refresh', authenticate, refreshToken);

module.exports = router;