
const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const { authenticate } = require('../middleware/auth');

// GET /api/courses - Get all active courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// GET /api/courses/all - Get all courses (admin only)
router.get('/all', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }
    
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    console.error('Error fetching all courses:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// GET /api/courses/:id - Get course by ID
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    res.json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ error: 'Failed to fetch course' });
  }
});

// POST /api/courses - Create new course (admin only)
router.post('/', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }

    const { 
      title, 
      description, 
      instructor, 
      duration, 
      level, 
      category, 
      image, 
      videoUrl, 
      price 
    } = req.body;
    
    if (!title || !description || !instructor || !duration || !category) {
      return res.status(400).json({ 
        error: 'Title, description, instructor, duration, and category are required' 
      });
    }

    const course = new Course({
      title: title.trim(),
      description: description.trim(),
      instructor: instructor.trim(),
      duration: duration.trim(),
      level: level || 'Beginner',
      category: category.trim(),
      image: image || '/placeholder.svg',
      videoUrl: videoUrl || '',
      price: price || 0
    });

    await course.save();
    res.status(201).json(course);
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ error: 'Failed to create course' });
  }
});

// PUT /api/courses/:id - Update course (admin only)
router.put('/:id', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }

    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const { 
      title, 
      description, 
      instructor, 
      duration, 
      level, 
      category, 
      image, 
      videoUrl, 
      price,
      isActive 
    } = req.body;

    if (title !== undefined) course.title = title.trim();
    if (description !== undefined) course.description = description.trim();
    if (instructor !== undefined) course.instructor = instructor.trim();
    if (duration !== undefined) course.duration = duration.trim();
    if (level !== undefined) course.level = level;
    if (category !== undefined) course.category = category.trim();
    if (image !== undefined) course.image = image;
    if (videoUrl !== undefined) course.videoUrl = videoUrl;
    if (price !== undefined) course.price = price;
    if (isActive !== undefined) course.isActive = isActive;

    await course.save();
    res.json(course);
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ error: 'Failed to update course' });
  }
});

// DELETE /api/courses/:id - Delete course (admin only)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }

    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ error: 'Failed to delete course' });
  }
});

module.exports = router;
