
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  summary: {
    type: String,
    required: true,
    maxlength: 300
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Disease Prevention',
      'Nutrition & Wellness', 
      'First Aid Basics',
      'Maternal & Child Health',
      'Mental Health Support',
      'Chronic Illness Management'
    ]
  },
  image: {
    type: String,
    default: '/placeholder.svg'
  },
  videoUrl: {
    type: String,
    default: ''
  },
  videoTitle: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Course', courseSchema);
