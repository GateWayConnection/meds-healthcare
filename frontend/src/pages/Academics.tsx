
import React from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Users, Star, Play } from 'lucide-react';
import { useCourses } from '../hooks/useCourses';

const Academics = () => {
  const { courses, loading } = useCourses();

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading courses...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Medical Education & Courses</h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Advance your medical knowledge with our comprehensive educational programs
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course, index) => (
                <motion.div
                  key={course._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="shadow-lg hover:shadow-xl transition-shadow h-full">
                    <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden relative">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                      {course.videoUrl && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                          <Button size="sm" className="rounded-full w-12 h-12 p-0">
                            <Play className="w-6 h-6" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary">{course.category}</Badge>
                        <Badge variant={course.level === 'Beginner' ? 'default' : course.level === 'Intermediate' ? 'secondary' : 'destructive'}>
                          {course.level}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl">{course.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-gray-600 text-sm line-clamp-3">{course.description}</p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <BookOpen className="w-4 h-4 mr-2" />
                          <span>Instructor: {course.instructor}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>Duration: {course.duration}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="w-4 h-4 mr-2" />
                          <span>{course.enrollments} enrolled</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Star className="w-4 h-4 mr-2 text-yellow-500" />
                          <span>{course.rating} rating</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4">
                        <div className="text-lg font-bold text-blue-600">
                          {course.price === 0 ? 'Free' : `$${course.price}`}
                        </div>
                        <Button size="sm">
                          {course.price === 0 ? 'Enroll Free' : 'Enroll Now'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {courses.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <p className="text-gray-600 text-lg">No courses available at the moment.</p>
                <p className="text-gray-500 mt-2">Check back later for new educational content.</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Academics;
