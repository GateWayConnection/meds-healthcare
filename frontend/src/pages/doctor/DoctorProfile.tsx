
import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { User, Stethoscope, Save, Award, Users, Clock, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useDoctorDashboard } from '../../hooks/useDoctorDashboard';

const DoctorProfile = () => {
  const { stats, pendingUsers, loading, approveUser } = useDoctorDashboard();
  const [profileData, setProfileData] = useState({
    name: 'Dr. John Smith',
    email: 'john.smith@medshealthcare.sd',
    phone: '+249 123 456 789',
    specialty: 'Cardiology',
    experience: '15',
    education: 'MD from University of Khartoum',
    bio: 'Experienced cardiologist with over 15 years of practice...',
    consultationFee: '100',
    languages: 'English, Arabic'
  });

  const handleSave = () => {
    toast.success('Profile updated successfully!');
  };

  const handleApproveUser = async (userId: string) => {
    try {
      await approveUser(userId);
      toast.success('User approved successfully!');
    } catch (error) {
      toast.error('Failed to approve user');
    }
  };

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
            <p className="text-gray-600">Manage your profile and view system reports</p>
          </motion.div>

          {/* Dashboard Stats */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Patients</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalPatients}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Stethoscope className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Doctors</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalDoctors}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Award className="h-8 w-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Appointments</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalAppointments}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Clock className="h-8 w-8 text-orange-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.pendingApprovals}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Profile Section */}
            <div className="space-y-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="w-5 h-5 mr-2 text-rose-600" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Stethoscope className="w-5 h-5 mr-2 text-rose-600" />
                    Professional Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="specialty">Specialty</Label>
                      <Input
                        id="specialty"
                        value={profileData.specialty}
                        onChange={(e) => setProfileData({...profileData, specialty: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="experience">Years of Experience</Label>
                      <Input
                        id="experience"
                        type="number"
                        value={profileData.experience}
                        onChange={(e) => setProfileData({...profileData, experience: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="bio">Professional Bio</Label>
                      <Textarea
                        id="bio"
                        value={profileData.bio}
                        onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                        rows={3}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button onClick={handleSave} className="w-full bg-rose-600 hover:bg-rose-700">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>

            {/* Pending Approvals Section */}
            <div>
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-rose-600" />
                    Pending User Approvals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <p className="text-gray-500">Loading pending approvals...</p>
                  ) : pendingUsers.length === 0 ? (
                    <p className="text-gray-500">No pending approvals</p>
                  ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {pendingUsers.map((user) => (
                        <div key={user._id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{user.name}</h4>
                              <p className="text-sm text-gray-600">{user.email}</p>
                              <p className="text-sm text-gray-600">{user.phone}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant={user.role === 'doctor' ? 'default' : 'secondary'}>
                                  {user.role}
                                </Badge>
                                {user.specialty && (
                                  <Badge variant="outline">{user.specialty}</Badge>
                                )}
                              </div>
                              {user.licenseNumber && (
                                <p className="text-xs text-gray-500 mt-1">
                                  License: {user.licenseNumber}
                                </p>
                              )}
                              <p className="text-xs text-gray-500">
                                Applied: {new Date(user.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => handleApproveUser(user._id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DoctorProfile;
