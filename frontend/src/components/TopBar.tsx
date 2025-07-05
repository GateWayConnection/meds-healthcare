
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Mail, Bell, HelpCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '../contexts/AuthContext';
import { useAppointments } from '../hooks/useAppointments';

const TopBar = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const { user } = useAuth();
  const { appointments } = useAppointments();

  // Get user-specific notifications
  const userNotifications = appointments.filter(apt => {
    if (user?.role === 'patient') {
      return apt.patientEmail === user.email && apt.status !== 'pending';
    }
    if (user?.role === 'doctor') {
      return apt.doctorId?._id === user.id && apt.status === 'pending';
    }
    return false;
  });

  const unreadCount = userNotifications.length;

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    setShowHelp(false);
  };

  const handleHelpClick = () => {
    setShowHelp(!showHelp);
    setShowNotifications(false);
  };

  return (
    <div className="relative">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-gradient-to-r from-rose-600 to-teal-600 text-white py-2 px-4"
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-1">
              <Phone size={14} />
              <span>Emergency: +249 123 456 789</span>
            </div>
            <div className="flex items-center space-x-1">
              <Mail size={14} />
              <span>info@medshealthcare.sd</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white hover:bg-white/20 h-8 relative"
                onClick={handleNotificationClick}
              >
                <Bell size={14} className="mr-1" />
                <span className="hidden sm:inline">Notifications</span>
                {unreadCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:bg-white/20 h-8"
              onClick={handleHelpClick}
            >
              <HelpCircle size={14} className="mr-1" />
              <span className="hidden sm:inline">Help</span>
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Notifications Dropdown */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-4 top-full mt-2 w-80 z-50"
          >
            <Card className="shadow-lg border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg">Notifications</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowNotifications(false)}
                >
                  <X size={16} />
                </Button>
              </CardHeader>
              <CardContent className="max-h-64 overflow-y-auto">
                {userNotifications.length > 0 ? (
                  <div className="space-y-3">
                    {userNotifications.map((notification) => (
                      <div key={notification._id} className="p-3 bg-gray-50 rounded-lg">
                        <p className="font-medium text-sm">
                          {user?.role === 'patient' 
                            ? `Appointment ${notification.status}` 
                            : 'New appointment request'
                          }
                        </p>
                        <p className="text-xs text-gray-600">
                          {user?.role === 'patient' 
                            ? `Your appointment with Dr. ${notification.doctorId?.name || 'Doctor'} has been ${notification.status}` 
                            : `${notification.patientName} has requested an appointment`
                          }
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(notification.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No new notifications</p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Help Dropdown */}
      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-4 top-full mt-2 w-80 z-50"
          >
            <Card className="shadow-lg border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg">Help & Support</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowHelp(false)}
                >
                  <X size={16} />
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => window.location.href = '/contact'}
                  >
                    Contact Support
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => window.open('tel:+249123456789')}
                  >
                    Emergency Hotline
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => window.location.href = '/about'}
                  >
                    About MEDS Healthcare
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => window.location.href = '/academics'}
                  >
                    Health Education
                  </Button>
                </div>
                <div className="border-t pt-3">
                  <p className="text-sm text-gray-600">
                    <strong>24/7 Emergency:</strong> +249 123 456 789
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Email:</strong> info@medshealthcare.sd
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TopBar;
