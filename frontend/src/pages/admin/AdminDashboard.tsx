
import React from 'react';
import Layout from '../../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Users, Calendar, TrendingUp, Settings, UserCheck, FileText, Stethoscope, User, BookOpen, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStats } from '../../hooks/useStats';
import { useSpecialties } from '../../hooks/useSpecialties';
import { useDoctors } from '../../hooks/useDoctors';
import { useActivities } from '../../hooks/useActivities';

const AdminDashboard = () => {
  const { stats, loading: statsLoading } = useStats();
  const { specialties } = useSpecialties();
  const { doctors } = useDoctors();
  const { activities, loading: activitiesLoading } = useActivities();

  const recentActivities = activities.slice(0, 5);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-teal-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
            <p className="text-gray-600">System overview and management</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">1,247</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Doctors</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {statsLoading ? '...' : doctors.length}
                    </p>
                  </div>
                  <UserCheck className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Specialties</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {specialties.length}
                    </p>
                  </div>
                  <Stethoscope className="w-8 h-8 text-rose-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Happy Patients</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {statsLoading ? '...' : `${stats?.happyPatients || 0}+`}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Recent Activities</CardTitle>
                  <Link to="/admin/activities">
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Manage
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  {activitiesLoading ? (
                    <div className="text-center text-gray-500">Loading activities...</div>
                  ) : (
                    <div className="space-y-4">
                      {recentActivities.length > 0 ? (
                        recentActivities.map((activity) => (
                          <div key={activity._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium">{activity.title}</p>
                              <p className="text-sm text-gray-600">{activity.description}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-600">
                                {new Date(activity.createdAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-gray-500 py-8">
                          No recent activities found
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Link to="/admin/users">
                    <Button className="w-full bg-rose-600 hover:bg-rose-700">
                      <Users className="w-4 h-4 mr-2" />
                      Manage Users
                    </Button>
                  </Link>
                  <Link to="/admin/specialties">
                    <Button variant="outline" className="w-full">
                      <Stethoscope className="w-4 h-4 mr-2" />
                      Manage Specialties
                    </Button>
                  </Link>
                  <Link to="/admin/doctors">
                    <Button variant="outline" className="w-full">
                      <User className="w-4 h-4 mr-2" />
                      Manage Doctors
                    </Button>
                  </Link>
                  <Link to="/admin/courses">
                    <Button variant="outline" className="w-full">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Manage Courses
                    </Button>
                  </Link>
                  <Link to="/admin/blogs">
                    <Button variant="outline" className="w-full">
                      <FileText className="w-4 h-4 mr-2" />
                      Manage Blogs
                    </Button>
                  </Link>
                  <Link to="/admin/stats">
                    <Button variant="outline" className="w-full">
                      <Settings className="w-4 h-4 mr-2" />
                      Update Stats
                    </Button>
                  </Link>
                  <Link to="/admin/reports">
                    <Button variant="outline" className="w-full">
                      <FileText className="w-4 h-4 mr-2" />
                      Generate Reports
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
