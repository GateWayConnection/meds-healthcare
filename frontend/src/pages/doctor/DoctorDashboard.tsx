
import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Users, 
  Clock, 
  MessageCircle, 
  Phone, 
  Video,
  Activity,
  UserCheck,
  Bell
} from 'lucide-react';
import { useDoctorDashboard } from '../../hooks/useDoctorDashboard';
import { toast } from 'sonner';
import DoctorChatInterface from '../../components/DoctorChatInterface';

const DoctorDashboard = () => {
  const { stats, pendingUsers, loading, error, approveUser } = useDoctorDashboard();
  const [activeTab, setActiveTab] = useState('overview');

  const handleApproveUser = async (userId: string) => {
    try {
      await approveUser(userId);
      toast.success('User approved successfully!');
    } catch (error) {
      toast.error('Failed to approve user');
    }
  };

  const handleStartCall = (receiverId: string, type: 'audio' | 'video') => {
    // This would integrate with your existing call system
    toast.info(`Starting ${type} call...`);
    // Add your call initiation logic here
  };

  if (loading && !stats) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center text-red-600">
            <p>Error loading dashboard: {error}</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-teal-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Doctor Dashboard</h1>
            <p className="text-gray-600">Manage your patients and appointments</p>
          </motion.div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="chat" className="flex items-center space-x-2">
                <MessageCircle className="w-4 h-4" />
                <span>Patient Chat</span>
              </TabsTrigger>
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
              <TabsTrigger value="approvals" className="relative">
                Approvals
                {pendingUsers.length > 0 && (
                  <Badge className="ml-2 bg-red-500 text-white text-xs">
                    {pendingUsers.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-100">Total Patients</p>
                          <p className="text-3xl font-bold">{stats?.totalPatients || 0}</p>
                        </div>
                        <Users className="w-8 h-8 text-blue-200" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-green-100">Total Appointments</p>
                          <p className="text-3xl font-bold">{stats?.totalAppointments || 0}</p>
                        </div>
                        <Calendar className="w-8 h-8 text-green-200" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-purple-100">Today's Schedule</p>
                          <p className="text-3xl font-bold">8</p>
                        </div>
                        <Clock className="w-8 h-8 text-purple-200" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-orange-100">Pending Approvals</p>
                          <p className="text-3xl font-bold">{pendingUsers.length}</p>
                        </div>
                        <Bell className="w-8 h-8 text-orange-200" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-rose-600" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button 
                      variant="outline" 
                      className="h-20 flex flex-col space-y-2"
                      onClick={() => setActiveTab('chat')}
                    >
                      <MessageCircle className="w-6 h-6" />
                      <span>Patient Messages</span>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="h-20 flex flex-col space-y-2"
                      onClick={() => setActiveTab('appointments')}
                    >
                      <Calendar className="w-6 h-6" />
                      <span>View Schedule</span>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="h-20 flex flex-col space-y-2"
                      onClick={() => setActiveTab('approvals')}
                    >
                      <UserCheck className="w-6 h-6" />
                      <span>User Approvals</span>
                      {pendingUsers.length > 0 && (
                        <Badge className="bg-red-500 text-white">
                          {pendingUsers.length}
                        </Badge>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="chat">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageCircle className="w-5 h-5 mr-2 text-rose-600" />
                    Patient Messages
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <DoctorChatInterface onStartCall={handleStartCall} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appointments">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-rose-600" />
                    Appointments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No appointments scheduled for today</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="approvals">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <UserCheck className="w-5 h-5 mr-2 text-rose-600" />
                    Pending User Approvals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {pendingUsers.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <UserCheck className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No pending approvals</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pendingUsers.map((user) => (
                        <div key={user._id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-medium">{user.name}</h4>
                            <p className="text-sm text-gray-600">{user.email}</p>
                            <div className="flex space-x-2 mt-1">
                              <Badge variant="secondary">{user.role}</Badge>
                              {user.specialty && (
                                <Badge variant="outline">{user.specialty}</Badge>
                              )}
                            </div>
                          </div>
                          <Button
                            onClick={() => handleApproveUser(user._id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <UserCheck className="w-4 h-4 mr-2" />
                            Approve
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default DoctorDashboard;
