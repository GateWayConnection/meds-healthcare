
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import { BookOpen, Eye, Play, ExternalLink } from 'lucide-react';
import { useCourses } from '../hooks/useCourses';

const Academics = () => {
  const { courses, loading } = useCourses();
  const [selectedGuide, setSelectedGuide] = useState(null);

  const categories = [
    'Disease Prevention',
    'Nutrition & Wellness', 
    'First Aid Basics',
    'Maternal & Child Health',
    'Mental Health Support',
    'Chronic Illness Management'
  ];

  const getCategoryColor = (category) => {
    const colors = {
      'Disease Prevention': 'bg-red-100 text-red-800',
      'Nutrition & Wellness': 'bg-green-100 text-green-800',
      'First Aid Basics': 'bg-blue-100 text-blue-800',
      'Maternal & Child Health': 'bg-pink-100 text-pink-800',
      'Mental Health Support': 'bg-purple-100 text-purple-800',
      'Chronic Illness Management': 'bg-orange-100 text-orange-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const handleGuideClick = async (guide) => {
    setSelectedGuide(guide);
    // Increment views (you can implement this in the backend if needed)
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading health guides...</p>
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
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Patient Health Education Guides</h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Simple, practical health information to help you and your family stay healthy and safe
              </p>
            </motion.div>

            {/* Category Sections */}
            {categories.map((category) => {
              const categoryGuides = courses.filter(guide => guide.category === category && guide.isActive);
              
              if (categoryGuides.length === 0) return null;

              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-12"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <BookOpen className="w-6 h-6 mr-3 text-rose-600" />
                    {category}
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryGuides.map((guide, index) => (
                      <motion.div
                        key={guide._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="shadow-lg hover:shadow-xl transition-shadow h-full cursor-pointer" onClick={() => handleGuideClick(guide)}>
                          <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden relative">
                            <img
                              src={guide.image || '/placeholder.svg'}
                              alt={guide.title}
                              className="w-full h-full object-cover"
                            />
                            {guide.videoUrl && (
                              <div className="absolute top-2 right-2">
                                <Badge className="bg-black bg-opacity-75 text-white">
                                  <Play className="w-3 h-3 mr-1" />
                                  Video
                                </Badge>
                              </div>
                            )}
                          </div>
                          <CardHeader>
                            <div className="flex items-center justify-between mb-2">
                              <Badge className={getCategoryColor(guide.category)}>
                                {guide.category}
                              </Badge>
                            </div>
                            <CardTitle className="text-xl hover:text-rose-600 transition-colors">
                              {guide.title}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <p className="text-gray-600 line-clamp-3">{guide.summary}</p>
                            
                            <div className="flex items-center justify-between pt-2">
                              <div className="flex items-center text-sm text-gray-500">
                                <Eye className="w-4 h-4 mr-1" />
                                {guide.views} views
                              </div>
                              <Button size="sm" variant="outline">
                                Read Guide
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              );
            })}

            {courses.filter(guide => guide.isActive).length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <p className="text-gray-600 text-lg">No health guides available at the moment.</p>
                <p className="text-gray-500 mt-2">Check back later for new educational content.</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Guide Detail Dialog */}
      <Dialog open={selectedGuide !== null} onOpenChange={() => setSelectedGuide(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedGuide && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={getCategoryColor(selectedGuide.category)}>
                    {selectedGuide.category}
                  </Badge>
                </div>
                <DialogTitle className="text-2xl">{selectedGuide.title}</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {selectedGuide.image && (
                  <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={selectedGuide.image}
                      alt={selectedGuide.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Summary</h3>
                  <p className="text-gray-700">{selectedGuide.summary}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Guide Content</h3>
                  <div className="prose prose-gray max-w-none">
                    <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                      {selectedGuide.content}
                    </p>
                  </div>
                </div>
                
                {selectedGuide.videoUrl && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <Play className="w-4 h-4 mr-2" />
                      Related Video
                    </h3>
                    <p className="text-gray-600 mb-3">
                      {selectedGuide.videoTitle || 'Educational Video'}
                    </p>
                    <Button
                      onClick={() => window.open(selectedGuide.videoUrl, '_blank')}
                      className="flex items-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Watch Video
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Academics;
