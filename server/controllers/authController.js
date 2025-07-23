const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Specialty = require('../models/Specialty');
const validator = require('validator');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const register = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      password, 
      phone,
      role = 'patient',
      dateOfBirth,
      specialty,
      licenseNumber,
      experience,
      bio
    } = req.body;

    console.log('Registration request body:', req.body);

    // Validation
    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, password, and phone number are required'
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { phone: phone }
      ]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email or phone number already exists'
      });
    }

    // Create user
    const userData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password, // Will be hashed by the pre-save middleware
      phone: phone.trim(),
      role
    };

    // Add role-specific fields
    if (role === 'patient' && dateOfBirth) {
      userData.dateOfBirth = new Date(dateOfBirth);
    }

    if (role === 'doctor') {
      if (!specialty || !licenseNumber || !experience) {
        return res.status(400).json({
          success: false,
          message: 'Specialty, license number, and experience are required for doctors'
        });
      }
      userData.specialty = specialty.trim();
      userData.licenseNumber = licenseNumber.trim();
      userData.experience = parseInt(experience);
      userData.bio = bio?.trim() || '';
      userData.verified = false; // Doctors need admin verification
    }

    const user = new User(userData);
    await user.save();

    // If doctor registration, also create entry in Doctor collection for homepage display
    if (role === 'doctor') {
      try {
        // Find or create specialty
        let specialtyDoc = await Specialty.findOne({ name: specialty });
        if (!specialtyDoc) {
          specialtyDoc = new Specialty({ 
            name: specialty, 
            description: `${specialty} specialty` 
          });
          await specialtyDoc.save();
        }

        // Create doctor entry for homepage display
        const doctorEntry = new Doctor({
          name: user.name,
          email: user.email,
          specialtyId: specialtyDoc._id,
          specialty: specialty,
          experience: experience,
          consultationFee: 50, // Default fee
          rating: 4.5, // Default rating
          qualifications: bio ? [bio] : [],
          isAvailable: false, // Initially false until verified
          isActive: false // Initially false until verified
        });
        
        await doctorEntry.save();
      } catch (doctorCreationError) {
        console.error('Error creating doctor entry:', doctorCreationError);
        // Don't fail the registration if doctor entry creation fails
      }
    }

    // Generate token
    const token = generateToken(user._id);

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: role === 'doctor' 
        ? 'Doctor account created successfully. Please wait for admin verification.' 
        : 'Account created successfully',
      data: {
        user: userResponse,
        token: role === 'patient' ? token : null // Only provide token for patients
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during registration'
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user by email
    const user = await User.findOne({ 
      email: email.toLowerCase().trim() 
    }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }

    // Check if doctor is verified
    if (user.role === 'doctor' && !user.verified) {
      return res.status(401).json({
        success: false,
        message: 'Doctor account is pending verification. Please contact admin.'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userResponse,
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during login'
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const logout = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during logout'
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    const token = generateToken(req.user._id);
    
    res.json({
      success: true,
      data: { token }
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
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
