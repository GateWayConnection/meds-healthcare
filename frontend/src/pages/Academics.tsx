
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Search, Heart, Brain, Activity, Stethoscope } from 'lucide-react';
import { useCategories } from '../hooks/useCategories';

const Academics = () => {
  const { categories, loading } = useCategories();
  const [searchQuery, setSearchQuery] = useState('');

  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      heart: <Heart className="w-8 h-8 text-red-500" />,
      brain: <Brain className="w-8 h-8 text-blue-500" />,
      activity: <Activity className="w-8 h-8 text-green-500" />,
      stethoscope: <Stethoscope className="w-8 h-8 text-purple-500" />,
    };
    return icons[iconName] || <BookOpen className="w-8 h-8 text-primary" />;
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Health Education Center
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our comprehensive health education resources. Learn about various medical conditions, 
              treatments, and wellness tips from trusted healthcare professionals.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full"
              />
            </div>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category) => (
              <Card 
                key={category._id} 
                className="hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                onClick={() => {
                  // Navigate to category details - implement this later with router
                  console.log('Navigate to category:', category._id);
                }}
              >
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    {getIconComponent(category.icon)}
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-800">
                    {category.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-gray-600 mb-4">
                    {category.description}
                  </CardDescription>
                  <div className="flex justify-center">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      Educational Resources Available
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredCategories.length === 0 && !loading && (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchQuery ? 'No categories found' : 'No categories available'}
              </h3>
              <p className="text-gray-500">
                {searchQuery 
                  ? 'Try adjusting your search terms' 
                  : 'Educational categories will be added soon'}
              </p>
            </div>
          )}

          {/* Info Banner */}
          <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center space-x-3">
              <BookOpen className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="font-semibold text-blue-900">New Content Added Regularly</h3>
                <p className="text-blue-700 text-sm">
                  Our medical experts continuously update our educational resources with the latest 
                  health information and research findings.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Academics;
