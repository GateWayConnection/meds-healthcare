const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');

// PUT /api/admin/verify-doctor/:id - Verify doctor and enable them
router.put('/verify-doctor/:id', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }

    const { id } = req.params;
    
    // Update Doctor collection
    const doctor = await Doctor.findByIdAndUpdate(
      id,
      { 
        isActive: true,
        isAvailable: true 
      },
      { new: true }
    ).populate('specialtyId', 'name description');

    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    // Update corresponding User account if exists
    await User.findOneAndUpdate(
      { email: doctor.email },
      { 
        verified: true,
        isActive: true 
      }
    );

    res.json({ 
      message: 'Doctor verified successfully',
      doctor 
    });
  } catch (error) {
    console.error('Error verifying doctor:', error);
    res.status(500).json({ error: 'Failed to verify doctor' });
  }
});

// PUT /api/admin/unverify-doctor/:id - Unverify doctor and disable them
router.put('/unverify-doctor/:id', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }

    const { id } = req.params;
    
    // Update Doctor collection
    const doctor = await Doctor.findByIdAndUpdate(
      id,
      { 
        isActive: false,
        isAvailable: false 
      },
      { new: true }
    ).populate('specialtyId', 'name description');

    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    // Update corresponding User account if exists
    await User.findOneAndUpdate(
      { email: doctor.email },
      { 
        verified: false,
        isActive: false 
      }
    );

    res.json({ 
      message: 'Doctor unverified successfully',
      doctor 
    });
  } catch (error) {
    console.error('Error unverifying doctor:', error);
    res.status(500).json({ error: 'Failed to unverify doctor' });
  }
});

module.exports = router;