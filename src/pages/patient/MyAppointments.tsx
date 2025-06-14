
import React from 'react';
import Layout from '../../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, MapPin } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const MyAppointments = () => {
  const { user } = useAuth();
  const appointments = JSON.parse(localStorage.getItem('appointments') || '[]')
    .filter((apt: any) => apt.patientId === user?.id);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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

          {appointments.length === 0 ? (
            <Card className="shadow-lg text-center py-12">
              <CardContent>
                <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No appointments yet</h3>
                <p className="text-gray-600 mb-4">Book your first appointment to get started</p>
                <Button className="bg-rose-600 hover:bg-rose-700">
                  Book Appointment
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {appointments.map((appointment: any, index: number) => (
                <motion.div
                  key={appointment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="flex items-center">
                        <User className="w-5 h-5 mr-2 text-rose-600" />
                        Dr. {appointment.doctorName}
                      </CardTitle>
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status}
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center text-gray-600">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>{appointment.date}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Clock className="w-4 h-4 mr-2" />
                            <span>{appointment.time}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span>{appointment.specialty}</span>
                          </div>
                        </div>
                        {appointment.notes && (
                          <div>
                            <h4 className="font-medium text-gray-900 mb-1">Notes:</h4>
                            <p className="text-gray-600 text-sm">{appointment.notes}</p>
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2 mt-4">
                        <Button variant="outline" size="sm">
                          Reschedule
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          Cancel
                        </Button>
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
