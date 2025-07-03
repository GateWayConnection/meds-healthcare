const express = require('express');
const router = express.Router();
const Specialty = require('../models/Specialty');
const auth = require('../middleware/auth');

// GET /api/specialties - Get all active specialties
router.get('/', async (req, res) => {
  try {
    const specialties = await Specialty.find({ isActive: true }).sort({ name: 1 });
    res.json(specialties);
  } catch (error) {
    console.error('Error fetching specialties:', error);
    res.status(500).json({ error: 'Failed to fetch specialties' });
  }
});

// GET /api/specialties/all - Get all specialties (admin only)
router.get('/all', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }
    
    const specialties = await Specialty.find().sort({ name: 1 });
    res.json(specialties);
  } catch (error) {
    console.error('Error fetching all specialties:', error);
    res.status(500).json({ error: 'Failed to fetch specialties' });
  }
});

// POST /api/specialties - Create new specialty (admin only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }

    const { name, description, icon } = req.body;
    
    if (!name || !description) {
      return res.status(400).json({ error: 'Name and description are required' });
    }

    const specialty = new Specialty({
      name: name.trim(),
      description: description.trim(),
      icon: icon || 'stethoscope'
    });

    await specialty.save();
    res.status(201).json(specialty);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Specialty name already exists' });
    }
    console.error('Error creating specialty:', error);
    res.status(500).json({ error: 'Failed to create specialty' });
  }
});

// PUT /api/specialties/:id - Update specialty (admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }

    const { name, description, icon, isActive } = req.body;
    
    const specialty = await Specialty.findById(req.params.id);
    if (!specialty) {
      return res.status(404).json({ error: 'Specialty not found' });
    }

    if (name !== undefined) specialty.name = name.trim();
    if (description !== undefined) specialty.description = description.trim();
    if (icon !== undefined) specialty.icon = icon;
    if (isActive !== undefined) specialty.isActive = isActive;

    await specialty.save();
    res.json(specialty);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Specialty name already exists' });
    }
    console.error('Error updating specialty:', error);
    res.status(500).json({ error: 'Failed to update specialty' });
  }
});

// DELETE /api/specialties/:id - Delete specialty (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }

    const specialty = await Specialty.findByIdAndDelete(req.params.id);
    if (!specialty) {
      return res.status(404).json({ error: 'Specialty not found' });
    }

    res.json({ message: 'Specialty deleted successfully' });
  } catch (error) {
    console.error('Error deleting specialty:', error);
    res.status(500).json({ error: 'Failed to delete specialty' });
  }
});

module.exports = router;