
import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Clock, Users, FileText, CheckCircle, XCircle } from 'lucide-react';
import { useAppointments } from '../../hooks/useAppointments';
import { useUsers } from '../../hooks/useUsers';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const { appointments, loading: appointmentsLoading, updateAppointment } = useAppointments();
  const { users, loading: usersLoading } = useUsers();
  const [selectedReport, setSelectedReport] = useState<string>('daily');

  const doctorAppointments = appointments.filter(apt => apt.doctorId === user?._id);
  const todayAppointments = doctorAppointments.filter(apt => {
    const today = new Date().toDateString();
    return new Date(apt.appointmentDate).toDateString() === today;
  });
  const pendingAppointments = doctorAppointments.filter(apt => apt.status === 'pending');
  const confirmedAppointments = doctorAppointments.filter(apt => apt.status === 'confirmed');

  const pendingUsers = users.filter(user => user.role === 'doctor' && !user.verified);

  const handleAppointmentAction = async (appointmentId: string, action: 'confirmed' | 'cancelled') => {
    try {
      await updateAppointment(appointmentId, { status: action });
      toast({
        title: "Success",
        description: `Appointment ${action} successfully.`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update appointment.",
        variant: "destructive"
      });
    }
  };

  const generateReport = () => {
    const reportData = {
      daily: {
        totalAppointments: todayAppointments.length,
        confirmedAppointments: todayAppointments.filter(apt => apt.status === 'confirmed').length,
        pendingAppointments: todayAppointments.filter(apt => apt.status === 'pending').length,
        cancelledAppointments: todayAppointments.filter(apt => apt.status === 'cancelled').length,
      },
      weekly: {
        totalAppointments: doctorAppointments.filter(apt => {
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return new Date(apt.appointmentDate) >= weekAgo;
        }).length,
        // ... similar calculations for weekly
      },
      monthly: {
        totalAppointments: doctorAppointments.filter(apt => {
          const monthAgo = new Date();
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return new Date(apt.appointmentDate) >= monthAgo;
        }).length,
        // ... similar calculations for monthly
      }
    };

    return reportData[selectedReport as keyof typeof reportData];
  };

  if (appointmentsLoading || usersLoading) {
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
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Doctor Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome back, Dr. {user?.name}</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{todayAppointments.length}</div>
                <p className="text-xs text-muted-foreground">
                  {confirmedAppointments.length} confirmed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingAppointments.length}</div>
                <p className="text-xs text-muted-foreground">
                  Awaiting your response
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Set(doctorAppointments.map(apt => apt.patientId)).size}
                </div>
                <p className="text-xs text-muted-foreground">
                  Unique patients served
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Users</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingUsers.length}</div>
                <p className="text-xs text-muted-foreground">
                  Require verification
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Pending Appointments */}
            <Card>
              <CardHeader>
                <CardTitle>Pending Appointments</CardTitle>
                <CardDescription>Appointments awaiting your approval</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingAppointments.length > 0 ? (
                    pendingAppointments.slice(0, 5).map((appointment) => (
                      <div key={appointment._id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{appointment.patientName}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(appointment.appointmentDate).toLocaleDateString()} at {appointment.timeSlot}
                          </p>
                          <p className="text-sm text-gray-500">{appointment.reason}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => handleAppointmentAction(appointment._id, 'confirmed')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleAppointmentAction(appointment._id, 'cancelled')}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No pending appointments</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Reports Section */}
            <Card>
              <CardHeader>
                <CardTitle>Generate Reports</CardTitle>
                <CardDescription>View detailed analytics and reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <Button
                      variant={selectedReport === 'daily' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedReport('daily')}
                    >
                      Daily
                    </Button>
                    <Button
                      variant={selectedReport === 'weekly' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedReport('weekly')}
                    >
                      Weekly
                    </Button>
                    <Button
                      variant={selectedReport === 'monthly' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedReport('monthly')}
                    >
                      Monthly
                    </Button>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-3">
                      {selectedReport.charAt(0).toUpperCase() + selectedReport.slice(1)} Report
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Total Appointments</p>
                        <p className="font-bold text-lg">{generateReport().totalAppointments}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Confirmed</p>
                        <p className="font-bold text-lg text-green-600">{generateReport().confirmedAppointments}</p>
                      </div>
                    </div>
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full">
                        <FileText className="w-4 h-4 mr-2" />
                        Generate Detailed Report
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Detailed {selectedReport.charAt(0).toUpperCase() + selectedReport.slice(1)} Report</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <p className="text-blue-800 font-medium">Total Appointments</p>
                            <p className="text-2xl font-bold text-blue-900">{generateReport().totalAppointments}</p>
                          </div>
                          <div className="bg-green-50 p-4 rounded-lg">
                            <p className="text-green-800 font-medium">Confirmed</p>
                            <p className="text-2xl font-bold text-green-900">{generateReport().confirmedAppointments}</p>
                          </div>
                        </div>
                        <Button className="w-full">Download PDF Report</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DoctorDashboard;
