
import React from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Play, FileText, Users } from 'lucide-react';

const Academics = () => {
  return (
    <Layout>
      <div className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Academic Portal</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Access comprehensive medical education resources, courses, and learning materials.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="card-hover">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="text-rose-600" size={24} />
                    <span>Course Categories</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Browse through various medical specialties and health topics.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Body Health & Anatomy</li>
                    <li>• General Medicine</li>
                    <li>• Pediatrics</li>
                    <li>• Cardiology</li>
                    <li>• Mental Health</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="card-hover">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Play className="text-rose-600" size={24} />
                    <span>Video Lectures</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Watch expert-led video content and interactive demonstrations.
                  </p>
                  <div className="bg-gray-100 rounded-lg p-4 text-center">
                    <Play size={32} className="mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">Coming Soon</p>
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
                    <FileText className="text-rose-600" size={24} />
                    <span>Study Materials</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Access PDFs, notes, and downloadable resources.
                  </p>
                  <div className="bg-gray-100 rounded-lg p-4 text-center">
                    <FileText size={32} className="mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">Resources Available</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-16 text-center"
          >
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center justify-center space-x-2">
                  <Users className="text-rose-600" size={24} />
                  <span>Academic Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">
                  Full academic portal with course management, progress tracking, and interactive learning coming soon.
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-green-50 p-3 rounded">
                    <p className="font-medium text-green-800">✓ Course Categories</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded">
                    <p className="font-medium text-green-800">✓ Material Upload</p>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded">
                    <p className="font-medium text-yellow-800">⚡ Video Integration</p>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded">
                    <p className="font-medium text-yellow-800">⚡ Progress Tracking</p>
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

export default Academics;
