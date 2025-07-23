
import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  User, 
  MapPin, 
  Bell, 
  Phone,
  Video,
  MessageCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useAppointments } from '../../hooks/useAppointments';
import { useToast } from '@/hooks/use-toast';

const PatientDashboard = () => {
  const { user } = useAuth();
  const { userAppointments, loading, fetchUserAppointments } = useAppointments();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showCallOptions, setShowCallOptions] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserAppointments();
      // Check for new appointment status updates
      checkNotifications();
    }
  }, [user]);

  const checkNotifications = () => {
    // Simulate checking for notifications based on appointment status changes
    const recentNotifications = userAppointments.filter(apt => 
      apt.status === 'confirmed' || apt.status === 'cancelled'
    ).slice(0, 3);
    setNotifications(recentNotifications);
  };

  const handleCallNow = (type: 'emergency' | 'consultation' | 'support') => {
    setShowCallOptions(false);
    
    switch (type) {
      case 'emergency':
        // For emergency calls - could integrate with actual emergency services
        window.open('tel:911', '_self');
        toast({
          title: "Emergency Call",
          description: "Connecting to emergency services...",
          variant: "destructive"
        });
        break;
        
      case 'consultation':
        // Navigate to chat/call interface for doctor consultation
        toast({
          title: "Starting Consultation",
          description: "Connecting you to available doctors...",
        });
        // Navigate to chat where patients can call doctors
        window.location.href = '/chat';
        break;
        
      case 'support':
        // For general support
        window.open('tel:+1-800-HEALTH', '_self');
        toast({
          title: "Calling Support",
          description: "Connecting to customer support...",
        });
        break;
        
      default:
        break;
    }
  };

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
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const upcomingAppointments = userAppointments
    .filter(apt => apt.status === 'confirmed' || apt.status === 'pending')
    .slice(0, 3);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-teal-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-gray-600">Here's an overview of your health journey</p>
          </motion.div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-gradient-to-r from-rose-500 to-pink-500 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-rose-100">Quick Access</p>
                      <h3 className="text-2xl font-bold">Call Now</h3>
                    </div>
                    <Phone className="w-8 h-8 text-rose-100" />
                  </div>
                  <div className="relative mt-4">
                    <Button 
                      className="w-full bg-white text-rose-600 hover:bg-rose-50"
                      onClick={() => setShowCallOptions(!showCallOptions)}
                    >
                      Call Options
                    </Button>
                    
                    {showCallOptions && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border p-2 z-10">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start text-red-600 hover:bg-red-50"
                          onClick={() => handleCallNow('emergency')}
                        >
                          <AlertCircle className="w-4 h-4 mr-2" />
                          Emergency (911)
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start text-blue-600 hover:bg-blue-50"
                          onClick={() => handleCallNow('consultation')}
                        >
                          <Video className="w-4 h-4 mr-2" />
                          Video Consultation
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start text-green-600 hover:bg-green-50"
                          onClick={() => handleCallNow('support')}
                        >
                          <Phone className="w-4 h-4 mr-2" />
                          Support Line
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500">Total Appointments</p>
                      <h3 className="text-2xl font-bold">{userAppointments.length}</h3>
                    </div>
                    <Calendar className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500">Upcoming</p>
                      <h3 className="text-2xl font-bold">{upcomingAppointments.length}</h3>
                    </div>
                    <Clock className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500">Notifications</p>
                      <h3 className="text-2xl font-bold">{notifications.length}</h3>
                    </div>
                    <Bell className="w-8 h-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Notifications */}
          {notifications.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-8"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="w-5 h-5 mr-2 text-orange-500" />
                    Recent Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {notifications.map((notification, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                        <Bell className="w-4 h-4 text-blue-500" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            Appointment {notification.status === 'confirmed' ? 'Approved' : 'Status Updated'}
                          </p>
                          <p className="text-xs text-gray-600">
                            Your appointment on {formatDate(notification.appointmentDate)} has been {notification.status}
                          </p>
                        </div>
                        <Badge className={getStatusColor(notification.status)}>
                          {notification.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Upcoming Appointments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Upcoming Appointments</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.location.href = '/patient/appointments'}
                >
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : upcomingAppointments.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                    <p className="text-gray-500">No upcoming appointments</p>
                <div className="flex gap-2 mt-3">
                  <Button 
                    onClick={() => window.location.href = '/book-appointment'}
                  >
                    Book Appointment
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => window.location.href = '/chat'}
                  >
                    💬 Chat with Doctor
                  </Button>
                </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingAppointments.map((appointment, index) => (
                      <div key={appointment._id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex-shrink-0">
                          <User className="w-8 h-8 text-blue-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900">
                            Dr. {appointment.doctorId?.name || 'Doctor Name'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDate(appointment.appointmentDate)} at {appointment.appointmentTime}
                          </p>
                          <p className="text-sm text-gray-500">
                            {appointment.specialtyId?.name || 'General'}
                          </p>
                        </div>
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default PatientDashboard;
