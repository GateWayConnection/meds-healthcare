const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
 // Add to your phone field definition
phone: {
  type: String,
  required: [true, 'Phone number is required'],
  unique: true,
  trim: true,
  set: function(phone) {
    // Remove all non-digit characters
    let cleaned = phone.replace(/\D/g, '');
    // Ensure South Sudan format
    if (!cleaned.startsWith('249')) {
      cleaned = '249' + cleaned.slice(-9);
    }
    return '+' + cleaned;
  },
  validate: {
    validator: function(v) {
      return /^\+249\d{9}$/.test(v);
    },
    message: 'Please enter a valid South Sudan phone number (+249XXXXXXXXX)'
  }
},
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  role: {
    type: String,
    required: true,
    enum: ['patient', 'doctor', 'admin'],
    default: 'patient'
  },
  verified: {
    type: Boolean,
    default: function() {
      return this.role === 'patient';
    }
  },
  // Patient-specific fields
  dateOfBirth: {
    type: Date,
    required: function() {
      return this.role === 'patient';
    }
  },
  // Doctor-specific fields
  specialty: {
    type: String,
    required: function() {
      return this.role === 'doctor';
    }
  },
  licenseNumber: {
    type: String,
    required: function() {
      return this.role === 'doctor';
    },
    unique: true,
    sparse: true
  },
  experience: {
    type: Number,
    required: function() {
      return this.role === 'doctor';
    }
  },
  bio: {
    type: String
  },
  // Common fields
  avatar: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to check password
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Instance method to get user object without password
UserSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

module.exports = mongoose.model('User', UserSchema);