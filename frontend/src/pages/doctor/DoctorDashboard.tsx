
import React from 'react';
import Layout from '../../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Calendar, Users, Clock, TrendingUp, Eye, Edit, Trash2 } from 'lucide-react';
import { useAppointments } from '../../hooks/useAppointments';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';

const DoctorDashboard = () => {
  const { appointments, updateAppointmentStatus, loading } = useAppointments();
  const { user } = useAuth();

  // Filter appointments for current doctor
  const doctorAppointments = appointments.filter(apt => 
    apt.doctorId?._id === user?.id || apt.doctorId === user?.id
  );

  const todayAppointments = doctorAppointments.filter(apt => {
    const today = new Date().toDateString();
    const aptDate = new Date(apt.appointmentDate).toDateString();
    return today === aptDate;
  });

  const thisMonthAppointments = doctorAppointments.filter(apt => {
    const thisMonth = new Date().getMonth();
    const aptMonth = new Date(apt.appointmentDate).getMonth();
    return thisMonth === aptMonth;
  });

  const uniquePatients = [...new Set(doctorAppointments.map(apt => apt.patientEmail))];

  const handleStatusUpdate = async (appointmentId: string, status: string) => {
    try {
      await updateAppointmentStatus(appointmentId, status);
      toast.success(`Appointment ${status} successfully`);
    } catch (error) {
      toast.error('Failed to update appointment status');
    }
  };

  const handleDeleteAppointment = async (appointmentId: string) => {
    try {
      await updateAppointmentStatus(appointmentId, 'cancelled');
      toast.success('Appointment cancelled successfully');
    } catch (error) {
      toast.error('Failed to cancel appointment');
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
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Doctor Dashboard</h1>
            <p className="text-gray-600">Manage your appointments and patient care</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
                    <p className="text-2xl font-bold text-gray-900">{todayAppointments.length}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-rose-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Patients</p>
                    <p className="text-2xl font-bold text-gray-900">{uniquePatients.length}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending Appointments</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {doctorAppointments.filter(apt => apt.status === 'pending').length}
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">This Month</p>
                    <p className="text-2xl font-bold text-gray-900">{thisMonthAppointments.length}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Today's Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todayAppointments.length > 0 ? (
                    todayAppointments.slice(0, 5).map((appointment) => (
                      <div key={appointment._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{appointment.patientName}</p>
                          <p className="text-sm text-gray-600">{appointment.specialtyId?.name || 'Consultation'}</p>
                          <Badge variant={
                            appointment.status === 'confirmed' ? 'default' : 
                            appointment.status === 'pending' ? 'secondary' : 'destructive'
                          }>
                            {appointment.status}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <p className="font-medium">{appointment.appointmentTime}</p>
                          <div className="flex space-x-1">
                            <Button size="sm" variant="ghost" onClick={() => handleStatusUpdate(appointment._id, 'confirmed')}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleDeleteAppointment(appointment._id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No appointments scheduled for today</p>
                  )}
                </div>
                <Button className="w-full mt-4 bg-rose-600 hover:bg-rose-700">
                  View Full Schedule
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full bg-rose-600 hover:bg-rose-700" onClick={() => window.location.href = '/doctor/availability'}>
                  Manage Availability
                </Button>
                <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => window.location.href = '/doctor/chat'}>
                  📱 Chat Inbox
                </Button>
                <Button variant="outline" className="w-full" onClick={() => window.location.href = '/doctor/profile'}>
                  Update Profile
                </Button>
                <Button variant="outline" className="w-full" onClick={() => toast.info('Reports feature coming soon!')}>
                  Generate Reports
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    const pendingCount = doctorAppointments.filter(apt => apt.status === 'pending').length;
                    toast.info(`You have ${pendingCount} pending appointments to review`);
                  }}
                >
                  View Pending Approvals ({doctorAppointments.filter(apt => apt.status === 'pending').length})
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DoctorDashboard;
