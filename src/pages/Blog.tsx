
import React from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Edit, Users, Calendar, Eye } from 'lucide-react';

const Blog = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Medical Blog</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Share knowledge, experiences, and insights with the medical community.
            </p>
          </motion.div>

          {user && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8 flex justify-center"
            >
              <Button className="bg-rose-600 hover:bg-rose-700 text-white">
                <Edit size={16} className="mr-2" />
                Write New Blog Post
              </Button>
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="card-hover">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="text-rose-600" size={24} />
                    <span>Recent Posts</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-b border-gray-200 pb-3">
                      <h4 className="font-medium text-gray-900">Understanding Hypertension</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        A comprehensive guide to managing high blood pressure...
                      </p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span className="flex items-center">
                          <Calendar size={12} className="mr-1" />
                          2 days ago
                        </span>
                        <span className="flex items-center">
                          <Eye size={12} className="mr-1" />
                          124 views
                        </span>
                      </div>
                    </div>
                    <div className="border-b border-gray-200 pb-3">
                      <h4 className="font-medium text-gray-900">Mental Health Awareness</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Breaking the stigma around mental health in Sudan...
                      </p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span className="flex items-center">
                          <Calendar size={12} className="mr-1" />
                          1 week ago
                        </span>
                        <span className="flex items-center">
                          <Eye size={12} className="mr-1" />
                          89 views
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="card-hover">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="text-rose-600" size={24} />
                    <span>Top Contributors</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-rose-600">DR</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Dr. Sarah Ahmed</p>
                        <p className="text-sm text-gray-600">12 posts</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-teal-600">DR</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Dr. Mohammed Ali</p>
                        <p className="text-sm text-gray-600">8 posts</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">PT</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Patient Advocate</p>
                        <p className="text-sm text-gray-600">5 posts</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="card-hover">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="text-rose-600" size={24} />
                    <span>Categories</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">General Medicine</span>
                      <span className="text-sm text-gray-500">15 posts</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Patient Stories</span>
                      <span className="text-sm text-gray-500">12 posts</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Health Tips</span>
                      <span className="text-sm text-gray-500">10 posts</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Medical Research</span>
                      <span className="text-sm text-gray-500">8 posts</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Mental Health</span>
                      <span className="text-sm text-gray-500">6 posts</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-16 text-center"
          >
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>Blog System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">
                  Full blog functionality with posting, editing, categories, and user management coming soon.
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-green-50 p-3 rounded">
                    <p className="font-medium text-green-800">✓ Blog Structure</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded">
                    <p className="font-medium text-green-800">✓ User Authentication</p>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded">
                    <p className="font-medium text-yellow-800">⚡ Post Creation</p>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded">
                    <p className="font-medium text-yellow-800">⚡ Content Management</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Blog;
