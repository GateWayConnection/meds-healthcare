
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Play, FileText, Users, ChevronRight, Video } from 'lucide-react';

const Academics = () => {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  const categories = [
    {
      id: 'body-health',
      title: t('academics.bodyHealth'),
      description: t('academics.bodyHealthDesc'),
      courses: [
        {
          id: 'anatomy-basics',
          title: t('academics.anatomyBasics'),
          description: t('academics.anatomyBasicsDesc'),
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          materials: ['PDF: Basic Anatomy Guide', 'Notes: Human Body Systems']
        }
      ]
    },
    {
      id: 'general-medicine',
      title: t('academics.generalMedicine'),
      description: t('academics.generalMedicineDesc'),
      courses: [
        {
          id: 'first-aid',
          title: t('academics.firstAid'),
          description: t('academics.firstAidDesc'),
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          materials: ['PDF: First Aid Manual', 'Video: CPR Techniques']
        }
      ]
    }
  ];

  if (selectedCourse) {
    const category = categories.find(cat => 
      cat.courses.some(course => course.id === selectedCourse)
    );
    const course = category?.courses.find(c => c.id === selectedCourse);

    return (
      <Layout>
        <div className="min-h-screen py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Button 
              variant="ghost" 
              onClick={() => setSelectedCourse(null)}
              className="mb-6"
            >
              ← {t('common.back')}
            </Button>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{course?.title}</h1>
              <p className="text-gray-600 mb-8">{course?.description}</p>

              {/* Video Player */}
              <div className="mb-8">
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  <iframe
                    src={course?.videoUrl}
                    title={course?.title}
                    className="w-full h-full"
                    frameBorder="0"
                    allowFullScreen
                  />
                </div>
              </div>

              {/* Course Materials */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="text-rose-600" size={24} />
                    <span>{t('academics.courseMaterials')}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {course?.materials.map((material, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded flex justify-between items-center">
                        <span>{material}</span>
                        <Button size="sm" variant="outline">
                          {t('common.download')}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </Layout>
    );
  }

  if (selectedCategory) {
    const category = categories.find(cat => cat.id === selectedCategory);
    
    return (
      <Layout>
        <div className="min-h-screen py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Button 
              variant="ghost" 
              onClick={() => setSelectedCategory(null)}
              className="mb-6"
            >
              ← {t('common.back')}
            </Button>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{category?.title}</h1>
              <p className="text-xl text-gray-600">{category?.description}</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {category?.courses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="card-hover cursor-pointer" onClick={() => setSelectedCourse(course.id)}>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Video className="text-rose-600" size={24} />
                        <span>{course.title}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{course.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          {course.materials.length} {t('academics.materials')}
                        </span>
                        <ChevronRight size={16} className="text-rose-600" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('academics.title')}</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('academics.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="card-hover cursor-pointer" onClick={() => setSelectedCategory(category.id)}>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BookOpen className="text-rose-600" size={24} />
                      <span>{category.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{category.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        {category.courses.length} {t('academics.courses')}
                      </span>
                      <ChevronRight size={16} className="text-rose-600" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Academics;
