
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  instructor: {
    type: String,
    required: true,
    trim: true
  },
  duration: {
    type: String,
    required: true
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  category: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: '/placeholder.svg'
  },
  videoUrl: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  enrollments: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 4.5,
    min: 0,
    max: 5
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Course', courseSchema);
