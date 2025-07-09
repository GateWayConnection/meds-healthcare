import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, MapPin, Calendar, MessageCircle, Phone } from 'lucide-react';
import { useDoctors } from '../hooks/useDoctors';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

const FindDoctorSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { doctors, loading, error } = useDoctors();

  // Show only first 3 doctors for homepage display
  const featuredDoctors = doctors.slice(0, 3);

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

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-600">Loading our expert doctors...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600">Unable to load doctors at this time</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-gray-900 mb-4"
          >
            Meet Our Expert Doctors
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Our team of experienced healthcare professionals is dedicated to providing you with the best medical care
          </motion.p>
        </div>

        {featuredDoctors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No doctors available at the moment.</p>
            <p className="text-gray-500 mt-2">Please check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredDoctors.map((doctor, index) => (
              <motion.div
                key={doctor._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <Card className="h-full shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <CardHeader className="text-center pb-4">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200 ring-4 ring-gray-100">
                      <img
                        src={doctor.image || '/placeholder.svg'}
                        alt={doctor.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                      />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{doctor.name}</h3>
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                        {doctor.specialty}
                      </Badge>
                      {doctor.isAvailable ? (
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          Available
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">
                          Busy
                        </Badge>
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
                        <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
                        {doctor.rating}
                      </div>
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-1" />
                      Consultation Fee: ${doctor.consultationFee}
                    </div>

                    {doctor.qualifications && doctor.qualifications.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {doctor.qualifications.map((qual, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {qual}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="space-y-3 pt-4">
                      <Button 
                        className="w-full bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white"
                        onClick={() => handleBookAppointment(doctor._id)}
                        disabled={!doctor.isAvailable}
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        Book Appointment
                      </Button>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          className="flex-1 text-sm"
                          onClick={() => handleChatWithDoctor(doctor._id)}
                          disabled={!doctor.isAvailable}
                        >
                          <MessageCircle className="w-4 h-4 mr-1" />
                          Chat
                        </Button>
                        <Button 
                          variant="outline" 
                          className="flex-1 text-sm"
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

        <div className="text-center mt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button 
              variant="outline"
              size="lg"
              className="border-rose-200 text-rose-600 hover:bg-rose-50 px-8 py-3"
              onClick={() => navigate('/find-doctor')}
            >
              View All Doctors
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FindDoctorSection;