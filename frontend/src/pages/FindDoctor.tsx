
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
import { Search, MapPin, Clock, Star, Calendar, MessageCircle, Phone } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { useDoctors } from '../hooks/useDoctors';
import { useSpecialties } from '../hooks/useSpecialties';

const FindDoctor = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  
  // Get dynamic data from hooks
  const { doctors, loading: doctorsLoading, error: doctorsError, fetchDoctors } = useDoctors();
  const { specialties, loading: specialtiesLoading } = useSpecialties();

  // Filter doctors based on search and specialty
  useEffect(() => {
    fetchDoctors(selectedSpecialty || undefined);
  }, [selectedSpecialty, fetchDoctors]);

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleBookAppointment = (doctorId: string) => {
    if (!user) {
      toast.error('Please login to book an appointment');
      navigate('/login');
      return;
    }
    navigate(`/book-appointment?doctor=${doctorId}`);
  };

  const handleChatWithDoctor = (doctorId: string) => {
    if (!user) {
      toast.error('Please login to chat with doctors');
      navigate('/login');
      return;
    }
    navigate(`/chat?doctor=${doctorId}`);
  };

  const handleCallDoctor = (doctorId: string) => {
    if (!user) {
      toast.error('Please login to contact doctors');
      navigate('/login');
      return;
    }
    navigate(`/call?doctor=${doctorId}&type=video`);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Find the Right Doctor</h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Search for qualified healthcare professionals by specialty, location, or name
              </p>
            </motion.div>

            {/* Search and Filter Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-6 rounded-lg shadow-sm mb-8"
            >
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search doctors by name or specialty..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="md:w-64">
                  <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Specialties" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Specialties</SelectItem>
                      {specialties.map(specialty => (
                        <SelectItem key={specialty._id} value={specialty.name}>
                          {specialty.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </motion.div>

            {/* Loading State */}
            {(doctorsLoading || specialtiesLoading) && (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">Loading doctors...</p>
              </div>
            )}

            {/* Error State */}
            {doctorsError && (
              <div className="text-center py-12">
                <p className="text-red-600 text-lg">Error: {doctorsError}</p>
              </div>
            )}

            {/* Results */}
            {!doctorsLoading && !specialtiesLoading && !doctorsError && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                          src={doctor.image}
                          alt={doctor.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardTitle className="text-xl">{doctor.name}</CardTitle>
                      <div className="flex items-center justify-center gap-2">
                        <Badge variant="secondary">{doctor.specialty}</Badge>
                        {doctor.isAvailable ? (
                          <Badge className="bg-green-100 text-green-800">Available</Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800">Busy</Badge>
                        )}
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {doctor.experience} years exp.
                        </div>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 mr-1 text-yellow-400" />
                          {doctor.rating}
                        </div>
                      </div>

                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-1" />
                        Consultation Fee: ${doctor.consultationFee}
                      </div>

                      {doctor.qualifications && (
                        <div className="flex flex-wrap gap-1">
                          {doctor.qualifications.map((qual, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {qual}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <div className="space-y-2 pt-4">
                        <Button 
                          className="w-full bg-rose-600 hover:bg-rose-700"
                          onClick={() => handleBookAppointment(doctor._id)}
                          disabled={!doctor.isAvailable}
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          Book Appointment
                        </Button>
                        
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => handleChatWithDoctor(doctor._id)}
                            disabled={!doctor.isAvailable}
                          >
                            <MessageCircle className="w-4 h-4 mr-1" />
                            Chat
                          </Button>
                          <Button 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => handleCallDoctor(doctor._id)}
                            disabled={!doctor.isAvailable}
                          >
                            <Phone className="w-4 h-4 mr-1" />
                            Call
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
                ))}
              </div>
            )}

            {!doctorsLoading && !specialtiesLoading && !doctorsError && filteredDoctors.length === 0 && (
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
