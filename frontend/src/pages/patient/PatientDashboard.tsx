
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, Heart, AlertCircle, Plus } from 'lucide-react';

const PatientDashboard = () => {
  const { user } = useAuth();

  const upcomingAppointments = JSON.parse(localStorage.getItem('appointments') || '[]')
    .filter((apt: any) => apt.patientId === user?.id && apt.status === 'confirmed')
    .slice(0, 3);

  const quickActions = [
    {
      title: 'Book Appointment',
      description: 'Schedule a new appointment',
      icon: Calendar,
      link: '/book-appointment',
      color: 'from-rose-500 to-pink-500'
    },
    {
      title: 'Health Navigation',
      description: 'Get health guidance',
      icon: Heart,
      link: '/health-navigation',
      color: 'from-teal-500 to-cyan-500'
    },
    {
      title: 'Find Doctor',
      description: 'Search for specialists',
      icon: User,
      link: '/find-doctor',
      color: 'from-purple-500 to-indigo-500'
    }
  ];

  const healthTips = [
    'Stay hydrated - drink at least 8 glasses of water daily',
    'Take regular breaks from screen time to rest your eyes',
    'Maintain a balanced diet with plenty of fruits and vegetables',
    'Get 7-9 hours of quality sleep each night'
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-teal-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, <span className="text-rose-600">{user?.name}</span>!
            </h1>
            <p className="text-gray-600">
              Here's your health dashboard overview
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {quickActions.map((action, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      className="group"
                    >
                      <Link to={action.link}>
                        <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
                          <CardContent className="p-6 text-center">
                            <div className={`w-12 h-12 mx-auto mb-4 bg-gradient-to-r ${action.color} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                              <action.icon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">
                              {action.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {action.description}
                            </p>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Upcoming Appointments */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Upcoming Appointments</h2>
                  <Link to="/patient/appointments">
                    <Button variant="outline" size="sm">
                      View All
                    </Button>
                  </Link>
                </div>
                
                {upcomingAppointments.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingAppointments.map((appointment: any, index: number) => (
                      <motion.div
                        key={appointment.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <Card className="shadow-md hover:shadow-lg transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 bg-gradient-to-r from-rose-500 to-teal-500 rounded-full flex items-center justify-center">
                                  <User className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-gray-900">
                                    {appointment.doctorName}
                                  </h3>
                                  <p className="text-sm text-gray-600">
                                    {appointment.specialty}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="flex items-center text-sm text-gray-600 mb-1">
                                  <Calendar className="w-4 h-4 mr-1" />
                                  {appointment.date}
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                  <Clock className="w-4 h-4 mr-1" />
                                  {appointment.time}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <Card className="shadow-md">
                    <CardContent className="p-8 text-center">
                      <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No upcoming appointments
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Book your next appointment to stay on top of your health
                      </p>
                      <Link to="/book-appointment">
                        <Button className="bg-rose-600 hover:bg-rose-700">
                          <Plus className="w-4 h-4 mr-2" />
                          Book Now
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Health Tips */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="shadow-lg border-0 bg-gradient-to-br from-teal-500 to-cyan-600 text-white">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Heart className="w-5 h-5 mr-2" />
                      Daily Health Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {healthTips.map((tip, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + index * 0.1 }}
                          className="text-sm opacity-90 flex items-start"
                        >
                          <span className="inline-block w-1.5 h-1.5 bg-white rounded-full mt-2 mr-2 flex-shrink-0" />
                          {tip}
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Emergency Contact */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="shadow-lg border-0 bg-gradient-to-br from-rose-500 to-pink-600 text-white">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <AlertCircle className="w-5 h-5 mr-2" />
                      Emergency Contact
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm opacity-90 mb-4">
                      For medical emergencies, call our 24/7 hotline
                    </p>
                    <div className="text-2xl font-bold mb-2">
                      +249 911 123 456
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-white/20 hover:bg-white/30 text-white border-white/20"
                    >
                      Call Now
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PatientDashboard;
