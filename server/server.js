const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth');
const statsRoutes = require('./routes/stats');
const specialtyRoutes = require('./routes/specialties');
const doctorRoutes = require('./routes/doctors');
const appointmentRoutes = require('./routes/appointments');
const courseRoutes = require('./routes/courses');
const blogRoutes = require('./routes/blogs');
const activityRoutes = require('./routes/activities');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/specialties', specialtyRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/categories', require('./routes/categories'));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running successfully!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
