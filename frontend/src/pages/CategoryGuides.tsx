import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, Eye, Play, FileText } from 'lucide-react';
import { apiService } from '../services/api';
import { motion } from 'framer-motion';

interface Course {
  _id: string;
  title: string;
  summary: string;
  content: string;
  categoryId: {
    _id: string;
    name: string;
    description: string;
  };
  image: string;
  videoUrl: string;
  videoTitle: string;
  views: number;
  isActive: boolean;
  createdAt: string;
}

interface Category {
  _id: string;
  name: string;
  description: string;
  icon?: string;
}

const CategoryGuides = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [courses, setCourses] = useState<Course[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch category details
        const categories = await apiService.getCategories();
        const foundCategory = categories.find((cat: Category) => cat._id === categoryId);
        setCategory(foundCategory);

        // Fetch courses for this category
        const coursesData = await apiService.getCourses();
        const filteredCourses = coursesData.filter((course: Course) => 
          course.categoryId?._id === categoryId || course.categoryId === categoryId
        );
        setCourses(filteredCourses);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchData();
    }
  }, [categoryId]);

  const handleCourseClick = async (course: Course) => {
    try {
      // Increment view count
      const updatedCourse = await apiService.getCourse(course._id);
      setSelectedCourse(updatedCourse);
    } catch (error) {
      console.error('Error fetching course details:', error);
      setSelectedCourse(course);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!category) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Category Not Found</h1>
            <Link to="/academics">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Categories
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  if (selectedCourse) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              <div className="mb-6">
                <Button 
                  variant="ghost" 
                  onClick={() => setSelectedCourse(null)}
                  className="mb-4"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to {category.name}
                </Button>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  {selectedCourse.image && (
                    <div className="aspect-video bg-gray-200">
                      <img
                        src={selectedCourse.image}
                        alt={selectedCourse.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="secondary">
                        {selectedCourse.categoryId?.name || category.name}
                      </Badge>
                      <div className="flex items-center text-sm text-gray-500">
                        <Eye className="w-4 h-4 mr-1" />
                        {selectedCourse.views} views
                      </div>
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                      {selectedCourse.title}
                    </h1>

                    <p className="text-lg text-gray-600 mb-6">
                      {selectedCourse.summary}
                    </p>

                    {selectedCourse.videoUrl && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2 flex items-center">
                          <Play className="w-5 h-5 mr-2" />
                          Educational Video
                        </h3>
                        <div className="bg-gray-100 p-4 rounded-lg">
                          <p className="text-sm text-gray-600 mb-2">
                            {selectedCourse.videoTitle || 'Educational Video Content'}
                          </p>
                          <a 
                            href={selectedCourse.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline"
                          >
                            Watch Video →
                          </a>
                        </div>
                      </div>
                    )}

                    <div className="prose max-w-none">
                      <h3 className="text-lg font-semibold mb-3 flex items-center">
                        <FileText className="w-5 h-5 mr-2" />
                        Health Guide Content
                      </h3>
                      <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                        {selectedCourse.content}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <Link to="/academics">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Categories
              </Button>
            </Link>
            
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {category.name}
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {category.description}
              </p>
            </div>
          </div>

          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course, index) => (
                <motion.div
                  key={course._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card 
                    className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                    onClick={() => handleCourseClick(course)}
                  >
                    <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
                      <img
                        src={course.image || '/placeholder.svg'}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle className="text-xl font-semibold text-gray-800">
                        {course.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-gray-600 mb-4 line-clamp-3">
                        {course.summary}
                      </CardDescription>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          {course.views} views
                        </div>
                        {course.videoUrl && (
                          <div className="flex items-center">
                            <Play className="w-4 h-4 mr-1" />
                            Video
                          </div>
                        )}
                      </div>

                      <Button className="w-full">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Read Guide
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No guides available yet
              </h3>
              <p className="text-gray-500">
                Health education guides for this category will be added soon.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CategoryGuides;