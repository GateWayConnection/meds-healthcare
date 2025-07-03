const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');
const nodemailer = require('nodemailer');

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'byiringirourban20@gmail.com',
    pass: process.env.EMAIL_PASS || 'zljw hslg rxpb mqpu'
  }
});

// Function to send appointment confirmation email
const sendConfirmationEmail = async (appointment) => {
  try {
    const mailOptions = {
      from: 'byiringirourban20@gmail.com',
      to: appointment.patientEmail,
      subject: 'Appointment Confirmation - MedsHealthcare',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #e11d48;">Appointment Confirmed!</h2>
          <p>Dear ${appointment.patientName},</p>
          <p>Your appointment has been successfully booked. Here are the details:</p>
          
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">Appointment Details</h3>
            <p><strong>Doctor:</strong> ${appointment.doctorName}</p>
            <p><strong>Specialty:</strong> ${appointment.specialty}</p>
            <p><strong>Date:</strong> ${new Date(appointment.appointmentDate).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${appointment.appointmentTime}</p>
            ${appointment.notes ? `<p><strong>Notes:</strong> ${appointment.notes}</p>` : ''}
          </div>
          
          <p>Please arrive 15 minutes before your appointment time.</p>
          <p>If you need to reschedule or cancel, please contact us as soon as possible.</p>
          
          <p>Thank you for choosing MedsHealthcare!</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px;">
              This is an automated email. Please do not reply to this message.
            </p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

// GET /api/appointments - Get user's appointments
router.get('/', authenticate, async (req, res) => {
  try {
    let query = {};
    
    if (req.user.role === 'patient') {
      query.patientId = req.user.id;
    } else if (req.user.role === 'doctor') {
      // Assuming doctor users have a corresponding doctor record
      const doctor = await Doctor.findOne({ email: req.user.email });
      if (doctor) {
        query.doctorId = doctor._id;
      }
    } else if (req.user.role === 'admin') {
      // Admin can see all appointments
    }
    
    const appointments = await Appointment.find(query)
      .populate('doctorId', 'name specialty consultationFee')
      .populate('patientId', 'name email phoneNumber')
      .sort({ appointmentDate: 1, appointmentTime: 1 });
    
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

// POST /api/appointments - Create new appointment
router.post('/', authenticate, async (req, res) => {
  try {
    const { doctorId, appointmentDate, appointmentTime, notes } = req.body;
    
    if (!doctorId || !appointmentDate || !appointmentTime) {
      return res.status(400).json({ 
        error: 'Doctor, appointment date, and time are required' 
      });
    }

    // Get doctor details
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    // Get patient details
    const patient = await User.findById(req.user.id);
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    // Check if appointment slot is already taken
    const existingAppointment = await Appointment.findOne({
      doctorId,
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
      status: { $in: ['confirmed', 'pending'] }
    });

    if (existingAppointment) {
      return res.status(400).json({ error: 'This time slot is already booked' });
    }

    const appointment = new Appointment({
      patientId: req.user.id,
      doctorId,
      patientName: patient.name,
      patientEmail: patient.email,
      doctorName: doctor.name,
      specialty: doctor.specialty,
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
      notes: notes || '',
      status: 'confirmed'
    });

    await appointment.save();

    // Send confirmation email
    const emailSent = await sendConfirmationEmail(appointment);
    if (emailSent) {
      appointment.emailSent = true;
      await appointment.save();
    }

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('doctorId', 'name specialty consultationFee')
      .populate('patientId', 'name email phoneNumber');

    res.status(201).json(populatedAppointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ error: 'Failed to create appointment' });
  }
});

// PUT /api/appointments/:id - Update appointment
router.put('/:id', authenticate, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // Check permissions
    if (req.user.role === 'patient' && appointment.patientId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { status, appointmentDate, appointmentTime, notes } = req.body;

    if (status !== undefined) appointment.status = status;
    if (appointmentDate !== undefined) appointment.appointmentDate = new Date(appointmentDate);
    if (appointmentTime !== undefined) appointment.appointmentTime = appointmentTime;
    if (notes !== undefined) appointment.notes = notes;

    await appointment.save();

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('doctorId', 'name specialty consultationFee')
      .populate('patientId', 'name email phoneNumber');

    res.json(populatedAppointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ error: 'Failed to update appointment' });
  }
});

// DELETE /api/appointments/:id - Cancel appointment
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // Check permissions
    if (req.user.role === 'patient' && appointment.patientId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    res.json({ message: 'Appointment cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(500).json({ error: 'Failed to cancel appointment' });
  }
});

module.exports = router;