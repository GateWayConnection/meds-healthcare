
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSpecialties } from '../hooks/useSpecialties';
import { useDoctors } from '../hooks/useDoctors';
import { apiService } from '../services/api';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Calendar, Clock, User, Stethoscope, CheckCircle } from 'lucide-react';

interface Doctor {
  _id: string;
  name: string;
  specialty: string;
  image: string;
  rating: number;
  experience: number;
  consultationFee: number;
  specialtyId: {
    _id: string;
    name: string;
  };
}

const BookAppointment = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    doctorId: '',
    doctorName: '',
    specialty: '',
    date: '',
    time: '',
    notes: ''
  });
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const { specialties, loading: specialtiesLoading } = useSpecialties();
  const { doctors, loading: doctorsLoading } = useDoctors(formData.specialty);

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

  const handleDoctorSelect = (doctorId: string) => {
    const doctor = doctors.find((doc) => doc._id === doctorId);
    setFormData({
      ...formData,
      doctorId,
      doctorName: doctor?.name || '',
      specialty: doctor?.specialty || ''
    });
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error('Please login to book an appointment');
      navigate('/login');
      return;
    }

    try {
      const appointmentData = {
        doctorId: formData.doctorId,
        appointmentDate: formData.date,
        appointmentTime: formData.time,
        notes: formData.notes
      };

      await apiService.createAppointment(appointmentData);
      toast.success('Appointment booked successfully! You will receive a confirmation email shortly.');
      setStep(4); // Success step
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to book appointment');
    }
  };

  const filteredDoctors = formData.specialty 
    ? doctors.filter((doc) => doc.specialty === formData.specialty)
    : doctors;

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-teal-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Progress Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-center space-x-4 mb-6">
              {[1, 2, 3].map((stepNum) => (
                <div key={stepNum} className="flex items-center">
                  <motion.div
                    animate={{
                      scale: step >= stepNum ? 1.1 : 1,
                      backgroundColor: step >= stepNum ? '#e11d48' : '#e5e7eb'
                    }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                      step >= stepNum ? 'text-white bg-rose-600' : 'text-gray-600 bg-gray-300'
                    }`}
                  >
                    {stepNum}
                  </motion.div>
                  {stepNum < 3 && (
                    <div className={`w-16 h-1 mx-2 ${step > stepNum ? 'bg-rose-600' : 'bg-gray-300'}`} />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Book an Appointment</h1>
              <p className="text-gray-600">
                {step === 1 && 'Choose your specialty and doctor'}
                {step === 2 && 'Select date and time'}
                {step === 3 && 'Confirm your appointment'}
                {step === 4 && 'Appointment confirmed!'}
              </p>
            </div>
          </motion.div>

          {/* Step 1: Doctor Selection */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-6"
            >
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Stethoscope className="w-5 h-5 mr-2 text-rose-600" />
                    Select Specialty & Doctor
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="specialty">Medical Specialty</Label>
                    <Select value={formData.specialty} onValueChange={(value) => setFormData({...formData, specialty: value, doctorId: '', doctorName: ''})}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Choose a specialty" />
                      </SelectTrigger>
                      <SelectContent>
                        {specialties.map((specialty) => (
                          <SelectItem key={specialty._id} value={specialty.name}>
                            {specialty.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.specialty && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Label>Available Doctors</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        {doctors.map((doctor) => (
                          <motion.div
                            key={doctor._id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleDoctorSelect(doctor._id)}
                            className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${
                              formData.doctorId === doctor._id
                                ? 'border-rose-500 bg-rose-50'
                                : 'border-gray-200 hover:border-rose-300'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <img
                                src={doctor.image}
                                alt={doctor.name}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                              <div>
                                <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
                                <p className="text-sm text-gray-600">{doctor.specialty}</p>
                                <div className="flex items-center mt-1">
                                  <span className="text-yellow-500">★</span>
                                  <span className="text-sm text-gray-600 ml-1">{doctor.rating}</span>
                                  <span className="text-sm text-gray-500 ml-2">
                                    {doctor.experience} years exp.
                                  </span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  <Button
                    onClick={() => setStep(2)}
                    disabled={!formData.doctorId}
                    className="w-full bg-rose-600 hover:bg-rose-700"
                  >
                    Continue
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 2: Date & Time Selection */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-6"
            >
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-rose-600" />
                    Select Date & Time
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="date">Appointment Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      min={new Date().toISOString().split('T')[0]}
                      className="mt-1"
                    />
                  </div>

                  {formData.date && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Label>Available Time Slots</Label>
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mt-2">
                        {timeSlots.map((time) => (
                          <motion.button
                            key={time}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setFormData({...formData, time})}
                            className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                              formData.time === time
                                ? 'border-rose-500 bg-rose-50 text-rose-700'
                                : 'border-gray-200 hover:border-rose-300'
                            }`}
                          >
                            {time}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  <div>
                    <Label htmlFor="notes">Additional Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      placeholder="Any specific concerns or information for the doctor..."
                      className="mt-1"
                    />
                  </div>

                  <div className="flex space-x-4">
                    <Button
                      variant="outline"
                      onClick={() => setStep(1)}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={() => setStep(3)}
                      disabled={!formData.date || !formData.time}
                      className="flex-1 bg-rose-600 hover:bg-rose-700"
                    >
                      Continue
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-6"
            >
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-rose-600" />
                    Confirm Your Appointment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Doctor:</span>
                      <span>{formData.doctorName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Specialty:</span>
                      <span>{formData.specialty}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Date:</span>
                      <span>{formData.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Time:</span>
                      <span>{formData.time}</span>
                    </div>
                    {formData.notes && (
                      <div>
                        <span className="font-medium text-gray-700">Notes:</span>
                        <p className="mt-1 text-gray-600">{formData.notes}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-4">
                    <Button
                      variant="outline"
                      onClick={() => setStep(2)}
                      className="flex-1"
                    >
                      Back
                    </Button>
                  <Button
                    onClick={handleSubmit}
                    className="flex-1 bg-rose-600 hover:bg-rose-700"
                  >
                    Confirm Appointment
                  </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-12">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center"
                  >
                    <CheckCircle className="w-12 h-12 text-green-600" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Appointment Confirmed!
                  </h2>
                  <p className="text-gray-600 mb-8">
                    Your appointment has been successfully booked. You will receive a confirmation shortly.
                  </p>
                  <div className="space-y-4">
                    <Button
                      onClick={() => navigate('/patient/appointments')}
                      className="bg-rose-600 hover:bg-rose-700 mr-4"
                    >
                      View My Appointments
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => navigate('/')}
                    >
                      Back to Home
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default BookAppointment;
