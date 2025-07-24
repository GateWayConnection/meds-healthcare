import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Calendar, Clock, Phone, Mail, User, CheckCircle, XCircle, Eye } from 'lucide-react';
import { useAppointments } from '../../hooks/useAppointments';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import { useSearchParams } from 'react-router-dom';

const DoctorAppointments = () => {
  const { appointments, updateAppointmentStatus, loading, fetchDoctorAppointments } = useAppointments();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [filter, setFilter] = useState(searchParams.get('status') || 'all');

  useEffect(() => {
    if (user?.role === 'doctor') {
      fetchDoctorAppointments();
    }
  }, [user, fetchDoctorAppointments]);

  const filteredAppointments = appointments.filter(apt => {
    if (filter === 'all') return true;
    return apt.status === filter;
  });

  const handleStatusUpdate = async (appointmentId: string, status: string) => {
    try {
      await updateAppointmentStatus(appointmentId, status);
      toast.success(`Appointment ${status} successfully`);
      fetchDoctorAppointments(); // Refresh the list
    } catch (error) {
      toast.error('Failed to update appointment status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'default';
      case 'pending': return 'secondary';
      case 'completed': return 'default';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-4">My Appointments</h1>
            <p className="text-gray-600">Manage your patient appointments</p>
          </motion.div>

          {/* Filter Buttons */}
          <div className="mb-6 flex flex-wrap gap-2">
            {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
              <Button
                key={status}
                variant={filter === status ? 'default' : 'outline'}
                onClick={() => setFilter(status)}
                className="capitalize"
              >
                {status} ({appointments.filter(apt => status === 'all' || apt.status === status).length})
              </Button>
            ))}
          </div>

          {/* Appointments List */}
          <div className="space-y-4">
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((appointment) => (
                <motion.div
                  key={appointment._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-3">
                            <div className="flex items-center gap-2">
                              <User className="w-5 h-5 text-gray-600" />
                              <h3 className="text-lg font-semibold">{appointment.patientName}</h3>
                            </div>
                            <Badge variant={getStatusColor(appointment.status)}>
                              {appointment.status}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4" />
                              <span>{appointment.patientEmail}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              <span>{appointment.patientPhone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(appointment.appointmentDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>{appointment.appointmentTime}</span>
                            </div>
                          </div>

                          {appointment.notes && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-700">
                                <strong>Notes:</strong> {appointment.notes}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-2 lg:min-w-[200px]">
                          {appointment.status === 'pending' && (
                            <>
                              <Button
                                onClick={() => handleStatusUpdate(appointment._id, 'confirmed')}
                                className="bg-green-600 hover:bg-green-700 w-full"
                                size="sm"
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Accept
                              </Button>
                              <Button
                                onClick={() => handleStatusUpdate(appointment._id, 'cancelled')}
                                variant="destructive"
                                className="w-full"
                                size="sm"
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                Reject
                              </Button>
                            </>
                          )}
                          
                          {appointment.status === 'confirmed' && (
                            <Button
                              onClick={() => handleStatusUpdate(appointment._id, 'completed')}
                              className="bg-blue-600 hover:bg-blue-700 w-full"
                              size="sm"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Mark Complete
                            </Button>
                          )}

                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => {
                              toast.info('Appointment details viewed');
                            }}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <Card className="shadow-lg">
                <CardContent className="p-12 text-center">
                  <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    No {filter !== 'all' ? filter : ''} appointments found
                  </h3>
                  <p className="text-gray-500">
                    {filter === 'all' 
                      ? "You don't have any appointments yet." 
                      : `No ${filter} appointments at this time.`
                    }
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DoctorAppointments;