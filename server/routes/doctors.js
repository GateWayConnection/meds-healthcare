const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const Specialty = require('../models/Specialty');
const auth = require('../middleware/auth');

// GET /api/doctors - Get all active doctors
router.get('/', async (req, res) => {
  try {
    const { specialty } = req.query;
    let query = { isActive: true };
    
    if (specialty) {
      query.specialty = specialty;
    }
    
    const doctors = await Doctor.find(query)
      .populate('specialtyId', 'name description')
      .sort({ name: 1 });
    
    res.json(doctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ error: 'Failed to fetch doctors' });
  }
});

// GET /api/doctors/all - Get all doctors (admin only)
router.get('/all', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }
    
    const doctors = await Doctor.find()
      .populate('specialtyId', 'name description')
      .sort({ name: 1 });
    
    res.json(doctors);
  } catch (error) {
    console.error('Error fetching all doctors:', error);
    res.status(500).json({ error: 'Failed to fetch doctors' });
  }
});

// GET /api/doctors/:id - Get doctor by ID
router.get('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate('specialtyId', 'name description');
    
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    
    res.json(doctor);
  } catch (error) {
    console.error('Error fetching doctor:', error);
    res.status(500).json({ error: 'Failed to fetch doctor' });
  }
});

// POST /api/doctors - Create new doctor (admin only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }

    const { 
      name, 
      email, 
      specialtyId, 
      experience, 
      rating, 
      image, 
      qualifications, 
      availability, 
      consultationFee 
    } = req.body;
    
    if (!name || !email || !specialtyId || !experience || !consultationFee) {
      return res.status(400).json({ 
        error: 'Name, email, specialty, experience, and consultation fee are required' 
      });
    }

    // Get specialty name
    const specialty = await Specialty.findById(specialtyId);
    if (!specialty) {
      return res.status(400).json({ error: 'Invalid specialty' });
    }

    const doctor = new Doctor({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      specialtyId,
      specialty: specialty.name,
      experience,
      rating: rating || 4.5,
      image: image || '/placeholder.svg',
      qualifications: qualifications || [],
      availability: availability || {},
      consultationFee
    });

    await doctor.save();
    
    const populatedDoctor = await Doctor.findById(doctor._id)
      .populate('specialtyId', 'name description');
    
    res.status(201).json(populatedDoctor);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    console.error('Error creating doctor:', error);
    res.status(500).json({ error: 'Failed to create doctor' });
  }
});

// PUT /api/doctors/:id - Update doctor (admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }

    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    const { 
      name, 
      email, 
      specialtyId, 
      experience, 
      rating, 
      image, 
      qualifications, 
      availability, 
      consultationFee,
      isActive 
    } = req.body;

    // Update specialty if changed
    if (specialtyId && specialtyId !== doctor.specialtyId.toString()) {
      const specialty = await Specialty.findById(specialtyId);
      if (!specialty) {
        return res.status(400).json({ error: 'Invalid specialty' });
      }
      doctor.specialtyId = specialtyId;
      doctor.specialty = specialty.name;
    }

    if (name !== undefined) doctor.name = name.trim();
    if (email !== undefined) doctor.email = email.toLowerCase().trim();
    if (experience !== undefined) doctor.experience = experience;
    if (rating !== undefined) doctor.rating = rating;
    if (image !== undefined) doctor.image = image;
    if (qualifications !== undefined) doctor.qualifications = qualifications;
    if (availability !== undefined) doctor.availability = { ...doctor.availability, ...availability };
    if (consultationFee !== undefined) doctor.consultationFee = consultationFee;
    if (isActive !== undefined) doctor.isActive = isActive;

    await doctor.save();
    
    const populatedDoctor = await Doctor.findById(doctor._id)
      .populate('specialtyId', 'name description');
    
    res.json(populatedDoctor);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    console.error('Error updating doctor:', error);
    res.status(500).json({ error: 'Failed to update doctor' });
  }
});

// DELETE /api/doctors/:id - Delete doctor (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }

    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    res.json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    console.error('Error deleting doctor:', error);
    res.status(500).json({ error: 'Failed to delete doctor' });
  }
});

module.exports = router;