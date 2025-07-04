
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, BookOpen, Video, Image, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCategories } from '../hooks/useCategories';
import { useCourses } from '../hooks/useCourses';

const Academics = () => {
  const navigate = useNavigate();
  const { categories, loading: categoriesLoading } = useCategories();
  const { courses, loading: coursesLoading } = useCourses();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const filteredCourses = courses.filter(course => {
    const matchesCategory = !selectedCategory || course.category === selectedCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || 
                       (filterType === 'video' && course.videoUrl) ||
                       (filterType === 'text' && !course.videoUrl);
    
    return matchesCategory && matchesSearch && matchesType;
  });

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setSearchTerm('');
    setFilterType('all');
  };

  const getTypeIcon = (course: any) => {
    if (course.videoUrl) return <Video className="w-4 h-4" />;
    if (course.image && course.image !== '/placeholder.svg') return <Image className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  const getTypeLabel = (course: any) => {
    if (course.videoUrl) return 'Video';
    if (course.image && course.image !== '/placeholder.svg') return 'Image';
    return 'Text';
  };

  if (categoriesLoading || coursesLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading educational content...</p>
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
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {selectedCategory ? selectedCategory : 'Health Education Center'}
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {selectedCategory 
                  ? 'Explore educational resources in this category'
                  : 'Browse our comprehensive health education categories to learn more about wellness and medical topics'
                }
              </p>
            </motion.div>

            {selectedCategory && (
              <div className="mb-6">
                <Button onClick={handleBackToCategories} variant="outline" className="mb-4">
                  ← Back to Categories
                </Button>
                
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search guides..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={filterType === 'all' ? 'default' : 'outline'}
                      onClick={() => setFilterType('all')}
                      size="sm"
                    >
                      All
                    </Button>
                    <Button
                      variant={filterType === 'video' ? 'default' : 'outline'}
                      onClick={() => setFilterType('video')}
                      size="sm"
                    >
                      <Video className="w-4 h-4 mr-1" />
                      Video
                    </Button>
                    <Button
                      variant={filterType === 'text' ? 'default' : 'outline'}
                      onClick={() => setFilterType('text')}
                      size="sm"
                    >
                      <FileText className="w-4 h-4 mr-1" />
                      Text
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {!selectedCategory ? (
              // Show Categories
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categories.map((category, index) => (
                  <motion.div
                    key={category._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card 
                      className="shadow-lg hover:shadow-xl transition-shadow h-full cursor-pointer"
                      onClick={() => handleCategoryClick(category.name)}
                    >
                      <CardHeader>
                        <CardTitle className="flex items-center text-xl">
                          <BookOpen className="w-6 h-6 mr-3 text-blue-600" />
                          {category.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 mb-4">{category.description}</p>
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary">
                            {courses.filter(c => c.category === category.name).length} guides
                          </Badge>
                          <Button size="sm" variant="outline">
                            Explore →
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              // Show Guides for Selected Category
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course, index) => (
                  <motion.div
                    key={course._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="shadow-lg hover:shadow-xl transition-shadow h-full">
                      <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
                        <img
                          src={course.image}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline" className="flex items-center gap-1">
                            {getTypeIcon(course)}
                            {getTypeLabel(course)}
                          </Badge>
                          <Badge variant="secondary">{course.category}</Badge>
                        </div>
                        <CardTitle className="text-lg">{course.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 mb-4">{course.summary}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">{course.views} views</span>
                          <Button 
                            size="sm"
                            onClick={() => navigate(`/academics/${course._id}`)}
                          >
                            View Guide
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {selectedCategory && filteredCourses.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <p className="text-gray-600 text-lg">No guides found matching your criteria.</p>
                <p className="text-gray-500 mt-2">Try adjusting your search or filter options.</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Academics;
