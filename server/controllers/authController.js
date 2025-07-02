const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Generate JWT token
 */
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

/**
 * Register new user
 * POST /api/auth/register
 */
const register = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      role,
      dateOfBirth,
      specialty,
      licenseNumber,
      experience,
      bio
    } = req.body;

    // Check if user already exists with email or phone
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }]
    });

    if (existingUser) {
      const field = existingUser.email === email ? 'email' : 'phone number';
      return res.status(400).json({
        success: false,
        message: `User with this ${field} already exists.`
      });
    }

    // Create user data object
    const userData = {
      name,
      email,
      phone,
      password,
      role: role || 'patient'
    };

    // Add role-specific fields
    if (userData.role === 'patient') {
      userData.dateOfBirth = dateOfBirth;
    } else if (userData.role === 'doctor') {
      userData.specialty = specialty;
      userData.licenseNumber = licenseNumber;
      userData.experience = experience;
      userData.bio = bio;
      userData.verified = false; // Doctors need verification
    }

    // Create new user
    const user = new User(userData);
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      data: {
        user: user.toJSON(),
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join('. ')
      });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error during registration.'
    });
  }
};

/**
 * Login user
 * POST /api/auth/login
 */
const login = async (req, res) => {
  try {
    const { identifier, password, role } = req.body;

    // Validate input
    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email/phone and password are required.'
      });
    }

    // Determine if identifier is email or phone
    const isEmail = identifier.includes('@');
    const query = isEmail 
      ? { email: identifier.toLowerCase() }
      : { phone: identifier };

    // Add role filter if provided
    if (role) {
      query.role = role;
    }

    // Find user by email or phone
    const user = await User.findOne(query);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.'
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }

    // Check if doctor account is verified
    if (user.role === 'doctor' && !user.verified) {
      return res.status(401).json({
        success: false,
        message: 'Doctor account is pending verification. Please wait for admin approval.'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful.',
      data: {
        user: user.toJSON(),
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during login.'
    });
  }
};

/**
 * Get current user profile
 * GET /api/auth/me
 */
const getProfile = async (req, res) => {
  try {
    // User is already attached to req by auth middleware
    res.json({
      success: true,
      data: {
        user: req.user.toJSON()
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error.'
    });
  }
};

/**
 * Logout user (client-side handles token removal)
 * POST /api/auth/logout
 */
const logout = async (req, res) => {
  try {
    // In a JWT-based auth system, logout is primarily handled client-side
    // by removing the token. We can optionally implement token blacklisting here.
    
    res.json({
      success: true,
      message: 'Logout successful.'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during logout.'
    });
  }
};

/**
 * Refresh token
 * POST /api/auth/refresh
 */
const refreshToken = async (req, res) => {
  try {
    // Generate new token with current user ID
    const token = generateToken(req.user._id);
    
    res.json({
      success: true,
      message: 'Token refreshed successfully.',
      data: {
        token
      }
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during token refresh.'
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  logout,
  refreshToken
};