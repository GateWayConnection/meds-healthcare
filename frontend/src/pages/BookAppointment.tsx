
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, Mail, Phone, FileText } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useSpecialties } from '../hooks/useSpecialties';
import { useDoctors } from '../hooks/useDoctors';
import { apiService } from '../services/api';
import { toast } from 'sonner';
import { useLocation } from 'react-router-dom';

const BookAppointment = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const selectedDoctor = location.state?.selectedDoctor;
  
  const { specialties } = useSpecialties();
  const { doctors } = useDoctors();
  
  const [formData, setFormData] = useState({
    patientName: '',
    patientEmail: '',
    patientPhone: '',
    specialtyId: selectedDoctor?.specialty || '',
    doctorId: selectedDoctor?._id || '',
    appointmentDate: '',
    appointmentTime: '',
    notes: ''
  });

  const [loading, setLoading] = useState(false);

  const availableSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

  const filteredDoctors = doctors.filter(doctor => 
    !formData.specialtyId || doctor.specialty === formData.specialtyId
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.patientName || !formData.patientEmail || !formData.patientPhone || 
        !formData.specialtyId || !formData.doctorId || !formData.appointmentDate || !formData.appointmentTime) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      
      // Find the specialty by name to get its ID
      const selectedSpecialty = specialties.find(s => s.name === formData.specialtyId);
      
      const appointmentData = {
        ...formData,
        specialtyId: selectedSpecialty?._id || formData.specialtyId
      };

      await apiService.createAppointment(appointmentData);
      
      toast.success('Appointment booked successfully! Confirmation email sent.');
      
      // Reset form
      setFormData({
        patientName: '',
        patientEmail: '',
        patientPhone: '',
        specialtyId: '',
        doctorId: '',
        appointmentDate: '',
        appointmentTime: '',
        notes: ''
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Book an Appointment</h1>
              <p className="text-xl text-gray-600">Schedule your consultation with our expert doctors</p>
            </motion.div>

            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <Calendar className="w-6 h-6 mr-2 text-blue-600" />
                  Appointment Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <User className="w-4 h-4 inline mr-2" />
                        Full Name *
                      </label>
                      <Input
                        value={formData.patientName}
                        onChange={(e) => setFormData({...formData, patientName: e.target.value})}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Mail className="w-4 h-4 inline mr-2" />
                        Email Address *
                      </label>
                      <Input
                        type="email"
                        value={formData.patientEmail}
                        onChange={(e) => setFormData({...formData, patientEmail: e.target.value})}
                        placeholder="Enter your email"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Phone className="w-4 h-4 inline mr-2" />
                        Phone Number *
                      </label>
                      <Input
                        value={formData.patientPhone}
                        onChange={(e) => setFormData({...formData, patientPhone: e.target.value})}
                        placeholder="Enter your phone number"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Medical Specialty *
                      </label>
                      <Select
                        value={formData.specialtyId}
                        onValueChange={(value) => setFormData({...formData, specialtyId: value, doctorId: ''})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select specialty" />
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

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Doctor *
                      </label>
                      <Select
                        value={formData.doctorId}
                        onValueChange={(value) => setFormData({...formData, doctorId: value})}
                        disabled={!formData.specialtyId}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select doctor" />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredDoctors.map((doctor) => (
                            <SelectItem key={doctor._id} value={doctor._id}>
                              {doctor.name} - {doctor.experience} years exp
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Calendar className="w-4 h-4 inline mr-2" />
                        Appointment Date *
                      </label>
                      <Input
                        type="date"
                        value={formData.appointmentDate}
                        onChange={(e) => setFormData({...formData, appointmentDate: e.target.value})}
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Clock className="w-4 h-4 inline mr-2" />
                        Preferred Time *
                      </label>
                      <Select
                        value={formData.appointmentTime}
                        onValueChange={(value) => setFormData({...formData, appointmentTime: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableSlots.map((slot) => (
                            <SelectItem key={slot} value={slot}>
                              {slot}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FileText className="w-4 h-4 inline mr-2" />
                      Additional Notes (Optional)
                    </label>
                    <Textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      placeholder="Any specific concerns or symptoms you'd like to mention..."
                      rows={4}
                    />
                  </div>

                  <div className="flex justify-center">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
                    >
                      {loading ? 'Booking...' : 'Book Appointment'}
                      <Calendar className="ml-2 w-5 h-5" />
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BookAppointment;
