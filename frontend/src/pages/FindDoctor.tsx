
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
import { Star, MapPin, Clock, Phone, MessageCircle, Calendar } from 'lucide-react';
import { useDoctors } from '../hooks/useDoctors';
import { useSpecialties } from '../hooks/useSpecialties';
import { useNavigate } from 'react-router-dom';

const FindDoctor = () => {
  const { doctors, loading } = useDoctors();
  const { specialties } = useSpecialties();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === '' || doctor.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty && doctor.isActive;
  });

  const handleBookAppointment = (doctorId: string) => {
    navigate(`/book-appointment?doctorId=${doctorId}`);
  };

  const handleChatWithDoctor = (doctorId: string) => {
    navigate(`/chat?doctorId=${doctorId}`);
  };

  const getAvailabilityStatus = (availability: any) => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'lowercase' });
    const isAvailableToday = availability && availability[today];
    return isAvailableToday ? 'Available Today' : 'Not Available Today';
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading doctors...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Find a Doctor</h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Connect with our experienced healthcare professionals
              </p>
            </motion.div>

            {/* Search and Filter Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8 bg-white rounded-lg shadow-md p-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Doctors
                  </label>
                  <Input
                    type="text"
                    placeholder="Search by name or specialty..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filter by Specialty
                  </label>
                  <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Specialties" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Specialties</SelectItem>
                      {specialties.map((specialty) => (
                        <SelectItem key={specialty._id} value={specialty.name}>
                          {specialty.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </motion.div>

            {/* Doctors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDoctors.map((doctor, index) => (
                <motion.div
                  key={doctor._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="shadow-lg hover:shadow-xl transition-shadow h-full">
                    <CardHeader className="text-center">
                      <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200">
                        <img
                          src={doctor.image || '/placeholder.svg'}
                          alt={doctor.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardTitle className="text-xl">{doctor.name}</CardTitle>
                      <Badge variant="secondary" className="mx-auto">
                        {doctor.specialty}
                      </Badge>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-500 mr-1" />
                          <span className="text-sm font-medium">{doctor.rating}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-1" />
                          {doctor.experience} years exp.
                        </div>
                      </div>

                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>Available for consultation</span>
                      </div>

                      <div className="text-sm">
                        <Badge 
                          variant={getAvailabilityStatus(doctor.availability).includes('Available') ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {getAvailabilityStatus(doctor.availability)}
                        </Badge>
                      </div>

                      <div className="text-sm text-gray-600">
                        <strong>Consultation Fee:</strong> ${doctor.consultationFee}
                      </div>

                      {doctor.qualifications && doctor.qualifications.length > 0 && (
                        <div className="text-sm">
                          <strong>Qualifications:</strong>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {doctor.qualifications.slice(0, 2).map((qual, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {qual}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-2 pt-4">
                        <Button
                          onClick={() => handleBookAppointment(doctor._id)}
                          className="w-full text-sm"
                          size="sm"
                        >
                          <Calendar className="w-4 h-4 mr-1" />
                          Book
                        </Button>
                        <Button
                          onClick={() => handleChatWithDoctor(doctor._id)}
                          variant="outline"
                          className="w-full text-sm"
                          size="sm"
                        >
                          <MessageCircle className="w-4 h-4 mr-1" />
                          Chat
                        </Button>
                      </div>

                      <div className="text-center pt-2">
                        <Button variant="ghost" size="sm" className="text-xs">
                          <Phone className="w-3 h-3 mr-1" />
                          Contact: {doctor.email}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {filteredDoctors.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <p className="text-gray-600 text-lg">No doctors found matching your search criteria.</p>
                <p className="text-gray-500 mt-2">Try adjusting your search or filter options.</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FindDoctor;
