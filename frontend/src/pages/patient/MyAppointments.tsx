
import React, { useEffect } from 'react';
import Layout from '../../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, MapPin, Bell } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useAppointments } from '../../hooks/useAppointments';
import { useToast } from '@/hooks/use-toast';

const MyAppointments = () => {
  const { user } = useAuth();
  const { userAppointments, loading, error, fetchUserAppointments } = useAppointments();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchUserAppointments();
    }
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-teal-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-4">My Appointments</h1>
            <p className="text-gray-600">View and manage your upcoming appointments</p>
          </motion.div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {userAppointments.length === 0 ? (
            <Card className="shadow-lg text-center py-12">
              <CardContent>
                <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No appointments yet</h3>
                <p className="text-gray-600 mb-4">Book your first appointment to get started</p>
                <Button 
                  className="bg-rose-600 hover:bg-rose-700"
                  onClick={() => window.location.href = '/book-appointment'}
                >
                  Book Appointment
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {userAppointments.map((appointment, index) => (
                <motion.div
                  key={appointment._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="flex items-center">
                        <User className="w-5 h-5 mr-2 text-rose-600" />
                        Dr. {appointment.doctorId?.name || 'Doctor Name'}
                      </CardTitle>
                      <div className="flex items-center space-x-2">
                        {appointment.status === 'confirmed' && (
                          <Bell className="w-4 h-4 text-green-600" />
                        )}
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center text-gray-600">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>{formatDate(appointment.appointmentDate)}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Clock className="w-4 h-4 mr-2" />
                            <span>{appointment.appointmentTime}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span>{appointment.specialtyId?.name || 'General'}</span>
                          </div>
                        </div>
                        {appointment.notes && (
                          <div>
                            <h4 className="font-medium text-gray-900 mb-1">Notes:</h4>
                            <p className="text-gray-600 text-sm">{appointment.notes}</p>
                          </div>
                        )}
                      </div>
                      
                      {appointment.status === 'confirmed' && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-green-800 text-sm font-medium">
                            ✅ Your appointment has been confirmed! Please arrive 15 minutes early.
                          </p>
                        </div>
                      )}
                      
                      {appointment.status === 'cancelled' && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-red-800 text-sm font-medium">
                            ❌ This appointment has been cancelled. Please contact us for rescheduling.
                          </p>
                        </div>
                      )}

                      <div className="flex space-x-2 mt-4">
                        {appointment.status === 'pending' && (
                          <Button variant="outline" size="sm" disabled>
                            Awaiting Approval
                          </Button>
                        )}
                        {appointment.status === 'confirmed' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              toast({
                                title: "Contact Support",
                                description: "Please call our support team to reschedule your appointment.",
                              });
                            }}
                          >
                            Reschedule
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MyAppointments;
