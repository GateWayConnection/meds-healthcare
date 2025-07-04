
import React, { useEffect } from 'react';
import Layout from '../../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, Calendar, User, Phone, Mail } from 'lucide-react';
import { useAppointments } from '../../hooks/useAppointments';
import { toast } from '@/hooks/use-toast';

const AppointmentManager = () => {
  const { appointments, loading, updateAppointmentStatus, refetch } = useAppointments();

  useEffect(() => {
    refetch();
  }, []);

  const handleStatusUpdate = async (appointmentId: string, newStatus: string) => {
    try {
      await updateAppointmentStatus(appointmentId, newStatus);
      
      if (newStatus === 'confirmed') {
        toast({ 
          title: "Appointment Approved!", 
          description: "Confirmation email sent to patient" 
        });
      } else if (newStatus === 'cancelled') {
        toast({ 
          title: "Appointment Rejected", 
          description: "Patient has been notified" 
        });
      }
      
      // Refresh the appointments list
      refetch();
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Failed to update appointment status", 
        variant: "destructive" 
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
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
          <Button onClick={refetch} variant="outline">
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {appointments.map((appointment) => (
            <Card key={appointment._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-primary" />
                    <span>{appointment.patientName}</span>
                    <Badge className={getStatusColor(appointment.status)}>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(appointment.status)}
                        <span className="capitalize">{appointment.status}</span>
                      </div>
                    </Badge>
                  </div>
                  <div className="flex space-x-2">
                    {appointment.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleStatusUpdate(appointment._id, 'confirmed')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleStatusUpdate(appointment._id, 'cancelled')}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                    {appointment.status === 'confirmed' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusUpdate(appointment._id, 'completed')}
                      >
                        Mark Complete
                      </Button>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{appointment.patientEmail}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{appointment.patientPhone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">
                        {new Date(appointment.appointmentDate).toLocaleDateString()} at {appointment.appointmentTime}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-medium">Doctor:</p>
                      <p className="text-sm text-gray-600">{appointment.doctorId.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Specialty:</p>
                      <p className="text-sm text-gray-600">{appointment.specialtyId.name}</p>
                    </div>
                    {appointment.notes && (
                      <div>
                        <p className="text-sm font-medium">Notes:</p>
                        <p className="text-sm text-gray-600">{appointment.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs text-gray-500">
                    Booked on: {new Date(appointment.createdAt).toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {appointments.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments yet</h3>
            <p className="text-gray-500">Appointments will appear here when patients book them.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AppointmentManager;
