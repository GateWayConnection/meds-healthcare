
const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Specialty = require('../models/Specialty');
const { authenticate } = require('../middleware/auth');
const nodemailer = require('nodemailer');

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'byiringirourban20@gmail.com',
    pass: 'zljw hslg rxpb mqpu'
  }
});

// GET /api/appointments - Get all appointments (admin only)
router.get('/', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }
    
    const appointments = await Appointment.find()
      .populate('doctorId', 'name specialty')
      .populate('specialtyId', 'name')
      .sort({ createdAt: -1 });
    
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

// GET /api/appointments/user - Get user's appointments
router.get('/user', authenticate, async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientEmail: req.user.email })
      .populate('doctorId', 'name specialty')
      .populate('specialtyId', 'name')
      .sort({ appointmentDate: 1 });
    
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching user appointments:', error);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

// POST /api/appointments - Create new appointment
router.post('/', async (req, res) => {
  try {
    const { 
      patientName, 
      patientEmail, 
      patientPhone, 
      doctorId, 
      specialtyId,
      appointmentDate,
      appointmentTime,
      notes 
    } = req.body;
    
    if (!patientName || !patientEmail || !patientPhone || !doctorId || !specialtyId || !appointmentDate || !appointmentTime) {
      return res.status(400).json({ 
        error: 'All required fields must be provided' 
      });
    }

    // Get doctor and specialty details for email
    const doctor = await Doctor.findById(doctorId);
    const specialty = await Specialty.findById(specialtyId);
    
    if (!doctor || !specialty) {
      return res.status(400).json({ error: 'Invalid doctor or specialty' });
    }

    const appointment = new Appointment({
      patientName,
      patientEmail,
      patientPhone,
      doctorId,
      specialtyId,
      appointmentDate,
      appointmentTime,
      notes: notes || ''
    });

    await appointment.save();
    
    // Send confirmation email
    const mailOptions = {
      from: 'byiringirourban20@gmail.com',
      to: patientEmail,
      subject: 'Appointment Confirmation - MEDS Healthcare',
      html: `
        <h2>Appointment Confirmation</h2>
        <p>Dear ${patientName},</p>
        <p>Your appointment has been successfully booked. Here are the details:</p>
        <ul>
          <li><strong>Doctor:</strong> ${doctor.name}</li>
          <li><strong>Specialty:</strong> ${specialty.name}</li>
          <li><strong>Date:</strong> ${new Date(appointmentDate).toLocaleDateString()}</li>
          <li><strong>Time:</strong> ${appointmentTime}</li>
          <li><strong>Phone:</strong> ${patientPhone}</li>
        </ul>
        ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
        <p>Please arrive 15 minutes before your scheduled appointment time.</p>
        <p>Thank you for choosing MEDS Healthcare!</p>
      `
    };

    await transporter.sendMail(mailOptions);
    
    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('doctorId', 'name specialty')
      .populate('specialtyId', 'name');
    
    res.status(201).json(populatedAppointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ error: 'Failed to create appointment' });
  }
});

// PUT /api/appointments/:id - Update appointment status (admin only)
router.put('/:id', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }

    const { status, notes } = req.body;
    
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    if (status !== undefined) appointment.status = status;
    if (notes !== undefined) appointment.notes = notes;

    await appointment.save();
    
    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('doctorId', 'name specialty')
      .populate('specialtyId', 'name');
    
    res.json(populatedAppointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ error: 'Failed to update appointment' });
  }
});

// DELETE /api/appointments/:id - Cancel appointment (admin only)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }

    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.json({ message: 'Appointment cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(500).json({ error: 'Failed to cancel appointment' });
  }
});

module.exports = router;
