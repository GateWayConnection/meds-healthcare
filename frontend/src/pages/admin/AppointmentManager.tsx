
import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, User, Phone, Mail, CheckCircle, XCircle } from 'lucide-react';
import { useAppointments } from '../../hooks/useAppointments';
import { toast } from '@/hooks/use-toast';

const AppointmentManager = () => {
  const { appointments, loading, updateAppointmentStatus } = useAppointments();
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredAppointments = appointments.filter(appointment => {
    if (filterStatus === 'all') return true;
    return appointment.status === filterStatus;
  });

  const handleStatusChange = async (appointmentId: string, newStatus: string) => {
    try {
      await updateAppointmentStatus(appointmentId, newStatus);
      toast({ 
        title: "Appointment Updated", 
        description: `Appointment has been ${newStatus}` 
      });
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Failed to update appointment", 
        variant: "destructive" 
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
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
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Appointment Management</h1>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Appointments</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredAppointments.map((appointment) => (
            <Card key={appointment._id} className="shadow-lg">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="flex items-center text-lg">
                    <User className="w-5 h-5 mr-2" />
                    {appointment.patientName}
                  </CardTitle>
                  <Badge className={getStatusColor(appointment.status)}>
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="text-sm">{appointment.patientEmail}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="text-sm">{appointment.patientPhone}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="text-sm">
                      {new Date(appointment.appointmentDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="text-sm">{appointment.appointmentTime}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Doctor: {appointment.doctorId?.name}</p>
                  <p className="text-sm font-medium">Specialty: {appointment.specialtyId?.name}</p>
                  {appointment.notes && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Notes:</span> {appointment.notes}
                    </p>
                  )}
                </div>

                {appointment.status === 'pending' && (
                  <div className="flex space-x-2 pt-4">
                    <Button
                      onClick={() => handleStatusChange(appointment._id, 'confirmed')}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleStatusChange(appointment._id, 'cancelled')}
                      variant="destructive"
                      className="flex-1"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                )}

                {appointment.status !== 'pending' && appointment.status !== 'completed' && (
                  <div className="pt-4">
                    <Select
                      value={appointment.status}
                      onValueChange={(value) => handleStatusChange(appointment._id, value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAppointments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No appointments found.</p>
            <p className="text-gray-500 mt-2">Appointments will appear here when patients book them.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AppointmentManager;
