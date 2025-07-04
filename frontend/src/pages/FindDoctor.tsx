
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
import { Search, MapPin, Clock, Star, Phone, Calendar, MessageCircle } from 'lucide-react';
import { useDoctors } from '../hooks/useDoctors';
import { useSpecialties } from '../hooks/useSpecialties';

const FindDoctor = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const { doctors, loading: doctorsLoading } = useDoctors();
  const { specialties, loading: specialtiesLoading } = useSpecialties();

  const filteredDoctors = doctors.filter((doctor: any) => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = !selectedSpecialty || doctor.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty && doctor.isActive;
  });

  const getAvailabilityStatus = (doctor: any) => {
    if (!doctor.isAvailable) return { status: 'Unavailable', color: 'bg-red-100 text-red-800' };
    
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const availability = doctor.availability && doctor.availability[today];
    
    if (availability && availability.isAvailable) {
      return { status: 'Available Today', color: 'bg-green-100 text-green-800' };
    }
    
    return { status: 'Available', color: 'bg-yellow-100 text-yellow-800' };
  };

  const handleBookAppointment = (doctor: any) => {
    // Navigate to book appointment with doctor info
    window.location.href = `/book-appointment?doctorId=${doctor._id}`;
  };

  const handleChatDoctor = (doctor: any) => {
    // Navigate to chat with doctor
    window.location.href = `/chat?doctorId=${doctor._id}`;
  };

  if (doctorsLoading || specialtiesLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading doctors...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        <div className="py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Find a Doctor</h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Connect with qualified healthcare professionals in your area
              </p>
            </motion.div>

            <Card className="shadow-lg mb-8">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search by doctor name or specialty..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                    <SelectTrigger className="w-full md:w-64">
                      <SelectValue placeholder="Select specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Specialties</SelectItem>
                      {specialties.map((specialty: any) => (
                        <SelectItem key={specialty._id} value={specialty.name}>
                          {specialty.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDoctors.map((doctor: any, index: number) => {
                const availability = getAvailabilityStatus(doctor);
                return (
                  <motion.div
                    key={doctor._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="shadow-lg hover:shadow-xl transition-shadow h-full">
                      <CardHeader className="text-center">
                        <div className="mx-auto mb-4">
                          <img
                            src={doctor.image || '/placeholder.svg'}
                            alt={doctor.name}
                            className="w-20 h-20 rounded-full mx-auto object-cover"
                          />
                        </div>
                        <CardTitle className="text-xl">{doctor.name}</CardTitle>
                        <p className="text-blue-600 font-medium">{doctor.specialty}</p>
                        <div className="flex items-center justify-center mt-2">
                          <Star className="w-4 h-4 text-yellow-500 mr-1" />
                          <span className="text-sm text-gray-600">{doctor.rating || 4.5}</span>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Badge className={availability.color}>
                            {availability.status}
                          </Badge>
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="w-4 h-4 mr-1" />
                            {doctor.experience} years exp.
                          </div>
                        </div>

                        {doctor.qualifications && doctor.qualifications.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">Qualifications:</p>
                            <p className="text-sm text-gray-600">{doctor.qualifications.join(', ')}</p>
                          </div>
                        )}

                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span>Consultation Fee: ${doctor.consultationFee}</span>
                        </div>

                        <div className="flex space-x-2 pt-4">
                          <Button
                            onClick={() => handleBookAppointment(doctor)}
                            className="flex-1 bg-blue-600 hover:bg-blue-700"
                            size="sm"
                          >
                            <Calendar className="w-4 h-4 mr-2" />
                            Book Appointment
                          </Button>
                          <Button
                            onClick={() => handleChatDoctor(doctor)}
                            variant="outline"
                            size="sm"
                            className="flex-1"
                          >
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Chat
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {filteredDoctors.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <p className="text-gray-600 text-lg">No doctors found matching your criteria.</p>
                <p className="text-gray-500 mt-2">Try adjusting your search or specialty filter.</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FindDoctor;
