
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Search, MapPin, Clock, Star, MessageCircle, Calendar } from 'lucide-react';
import { useDoctors } from '../hooks/useDoctors';
import { useSpecialties } from '../hooks/useSpecialties';

const FindDoctor = () => {
  const { doctors, loading: doctorsLoading } = useDoctors();
  const { specialties, loading: specialtiesLoading } = useSpecialties();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  const getAvailabilityStatus = (doctor: any) => {
    const today = new Date();
    const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });
    
    // Simple availability logic - you can make this more sophisticated
    const isAvailable = Math.random() > 0.3; // Random for demo
    const nextSlot = new Date(today.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000);
    
    return {
      isAvailable,
      nextSlot: nextSlot.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      }),
      status: isAvailable ? 'Available Today' : 'Next Available'
    };
  };

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = !selectedSpecialty || doctor.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty && doctor.isActive;
  });

  const handleBookAppointment = (doctorId: string) => {
    // Navigate to booking page with doctor ID
    console.log('Booking appointment with doctor:', doctorId);
  };

  const handleChatWithDoctor = (doctorId: string) => {
    // Navigate to chat with doctor
    console.log('Starting chat with doctor:', doctorId);
  };

  if (doctorsLoading || specialtiesLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-rose-50 to-teal-50 flex items-center justify-center">
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
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-teal-50">
        <div className="py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Find a Doctor</h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Connect with experienced healthcare professionals
              </p>
            </motion.div>

            <Card className="shadow-lg mb-8">
              <CardHeader>
                <CardTitle>Search & Filter</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search doctors or specialties..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Specialties</SelectItem>
                      {specialties.map((specialty) => (
                        <SelectItem key={specialty._id} value={specialty.name}>
                          {specialty.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      <SelectItem value="downtown">Downtown</SelectItem>
                      <SelectItem value="uptown">Uptown</SelectItem>
                      <SelectItem value="suburbs">Suburbs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDoctors.map((doctor, index) => {
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
                        <div className="w-20 h-20 bg-gradient-to-br from-rose-400 to-rose-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                          <span className="text-2xl font-bold text-white">
                            {doctor.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <CardTitle className="text-xl">{doctor.name}</CardTitle>
                        <Badge variant="secondary">{doctor.specialty}</Badge>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        <div className="text-sm text-gray-600">
                          <div className="flex items-center mb-2">
                            <Star className="w-4 h-4 mr-2 text-yellow-500" />
                            <span>4.8 (127 reviews)</span>
                          </div>
                          <div className="flex items-center mb-2">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span>Medical Center, Downtown</span>
                          </div>
                          <div className="flex items-center mb-2">
                            <Clock className="w-4 h-4 mr-2" />
                            <span>{doctor.experience} years experience</span>
                          </div>
                        </div>

                        <div className="border-t pt-4">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium">Availability:</span>
                            <Badge variant={availability.isAvailable ? "default" : "secondary"}>
                              {availability.status}
                            </Badge>
                          </div>
                          {!availability.isAvailable && (
                            <p className="text-xs text-gray-500 mb-3">
                              Next: {availability.nextSlot}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Button 
                            className="w-full bg-rose-600 hover:bg-rose-700"
                            onClick={() => handleBookAppointment(doctor._id)}
                          >
                            <Calendar className="w-4 h-4 mr-2" />
                            Book Appointment
                          </Button>
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => handleChatWithDoctor(doctor._id)}
                          >
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Chat with Doctor
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
                <p className="text-gray-500 mt-2">Try adjusting your search or filters.</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FindDoctor;
