
import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, FileText, AlertTriangle, Activity } from 'lucide-react';
import { useAppointments } from '../../hooks/useAppointments';
import { useUsers } from '../../hooks/useUsers';
import { useAuth } from '../../contexts/AuthContext';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const { appointments, loading: appointmentsLoading } = useAppointments();
  const { users, loading: usersLoading } = useUsers();
  const [selectedTab, setSelectedTab] = useState('overview');

  // Filter appointments for current doctor
  const doctorAppointments = appointments.filter(apt => 
    apt.doctorId === user?._id || apt.doctor === user?.name
  );

  // Filter for today's appointments
  const todaysAppointments = doctorAppointments.filter(apt => {
    const aptDate = new Date(apt.date);
    const today = new Date();
    return aptDate.toDateString() === today.toDateString();
  });

  // Filter pending appointments
  const pendingAppointments = doctorAppointments.filter(apt => 
    apt.status === 'pending'
  );

  // Filter pending user approvals (doctors waiting for approval)
  const pendingUsers = users.filter(u => 
    u.role === 'doctor' && !u.verified
  );

  const generateReport = () => {
    const reportData = {
      totalAppointments: doctorAppointments.length,
      todaysAppointments: todaysAppointments.length,
      pendingAppointments: pendingAppointments.length,
      completedAppointments: doctorAppointments.filter(apt => apt.status === 'completed').length,
      cancelledAppointments: doctorAppointments.filter(apt => apt.status === 'cancelled').length,
      reportDate: new Date().toISOString().split('T')[0]
    };

    console.log('Generated Report:', reportData);
    
    // Create downloadable report
    const reportContent = `
DOCTOR DASHBOARD REPORT
Generated on: ${new Date().toLocaleDateString()}
Doctor: ${user?.name}

=== APPOINTMENTS SUMMARY ===
Total Appointments: ${reportData.totalAppointments}
Today's Appointments: ${reportData.todaysAppointments}
Pending Appointments: ${reportData.pendingAppointments}
Completed Appointments: ${reportData.completedAppointments}
Cancelled Appointments: ${reportData.cancelledAppointments}

=== RECENT APPOINTMENTS ===
${doctorAppointments.slice(0, 10).map(apt => 
  `- ${apt.patientName} | ${apt.date} | ${apt.status}`
).join('\n')}
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `doctor-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, Dr. {user?.name}
            </h1>
            <p className="text-gray-600">
              Here's what's happening with your practice today.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{todaysAppointments.length}</div>
                <p className="text-xs text-muted-foreground">
                  {todaysAppointments.length > 0 ? 'Active schedule' : 'No appointments today'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingAppointments.length}</div>
                <p className="text-xs text-muted-foreground">
                  Appointments awaiting confirmation
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
                  {new Set(doctorAppointments.map(apt => apt.patientName)).size}
                </div>
                <p className="text-xs text-muted-foreground">
                  Unique patients served
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Month</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {doctorAppointments.filter(apt => {
                    const aptDate = new Date(apt.date);
                    const now = new Date();
                    return aptDate.getMonth() === now.getMonth() && 
                           aptDate.getFullYear() === now.getFullYear();
                  }).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Appointments this month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-8">
            <Button onClick={generateReport} className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Generate Report
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setSelectedTab('pending')}
              className="flex items-center gap-2"
            >
              <AlertTriangle className="h-4 w-4" />
              View Pending ({pendingUsers.length + pendingAppointments.length})
            </Button>
          </div>

          {/* Content Tabs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Appointments */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Appointments</CardTitle>
                <CardDescription>Your latest scheduled appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {doctorAppointments.slice(0, 5).map((appointment) => (
                    <div key={appointment._id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{appointment.patientName}</p>
                        <p className="text-sm text-muted-foreground">
                          {appointment.date} at {appointment.time}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {appointment.reason}
                        </p>
                      </div>
                      <Badge variant={
                        appointment.status === 'confirmed' ? 'default' :
                        appointment.status === 'pending' ? 'secondary' :
                        appointment.status === 'completed' ? 'outline' : 'destructive'
                      }>
                        {appointment.status}
                      </Badge>
                    </div>
                  ))}
                  {doctorAppointments.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">
                      No appointments scheduled
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Pending Items */}
            <Card>
              <CardHeader>
                <CardTitle>Pending Items</CardTitle>
                <CardDescription>Items requiring your attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Pending Appointments */}
                  {pendingAppointments.map((appointment) => (
                    <div key={appointment._id} className="flex items-center justify-between p-3 border rounded-lg bg-yellow-50">
                      <div>
                        <p className="font-medium">Appointment Request</p>
                        <p className="text-sm text-muted-foreground">
                          {appointment.patientName} - {appointment.date}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">Approve</Button>
                        <Button size="sm" variant="destructive">Decline</Button>
                      </div>
                    </div>
                  ))}

                  {/* Pending Doctor Approvals */}
                  {pendingUsers.map((doctor) => (
                    <div key={doctor._id} className="flex items-center justify-between p-3 border rounded-lg bg-blue-50">
                      <div>
                        <p className="font-medium">Doctor Registration</p>
                        <p className="text-sm text-muted-foreground">
                          {doctor.name} - {doctor.specialty}
                        </p>
                      </div>
                      <Badge variant="secondary">Pending Review</Badge>
                    </div>
                  ))}

                  {(pendingAppointments.length === 0 && pendingUsers.length === 0) && (
                    <p className="text-center text-muted-foreground py-4">
                      No pending items
                    </p>
                  )}
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
