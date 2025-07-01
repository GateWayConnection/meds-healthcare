
import React from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Edit, Users, Calendar, Eye, Heart, MessageSquare } from 'lucide-react';

const Blog = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const blogPosts = [
    {
      id: 1,
      title: t('blog.post1Title'),
      excerpt: t('blog.post1Excerpt'),
      author: 'Dr. Sarah Ahmed',
      date: '2024-01-15',
      views: 124,
      likes: 23,
      comments: 5,
      category: t('blog.generalMedicine')
    },
    {
      id: 2,
      title: t('blog.post2Title'),
      excerpt: t('blog.post2Excerpt'),
      author: 'Dr. Mohammed Ali',
      date: '2024-01-10',
      views: 89,
      likes: 15,
      comments: 3,
      category: t('blog.mentalHealth')
    },
    {
      id: 3,
      title: t('blog.post3Title'),
      excerpt: t('blog.post3Excerpt'),
      author: 'Patient Advocate',
      date: '2024-01-08',
      views: 156,
      likes: 31,
      comments: 8,
      category: t('blog.patientStories')
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('blog.title')}</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('blog.subtitle')}
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
                {t('blog.writePost')}
              </Button>
            </motion.div>
          )}

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {blogPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
              >
                <Card className="card-hover h-full">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs bg-rose-100 text-rose-600 px-2 py-1 rounded">
                        {post.category}
                      </span>
                      <span className="text-xs text-gray-500">{post.date}</span>
                    </div>
                    <CardTitle className="text-lg">{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>{post.author}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <Eye size={12} className="mr-1" />
                          {post.views}
                        </span>
                        <span className="flex items-center">
                          <Heart size={12} className="mr-1" />
                          {post.likes}
                        </span>
                        <span className="flex items-center">
                          <MessageSquare size={12} className="mr-1" />
                          {post.comments}
                        </span>
                      </div>
                      <Button variant="ghost" size="sm" className="text-rose-600">
                        {t('blog.readMore')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Categories Sidebar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="text-rose-600" size={20} />
                    <span>{t('blog.categories')}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-gray-700">{t('blog.generalMedicine')}</span>
                      <span className="text-sm text-gray-500">15</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-gray-700">{t('blog.patientStories')}</span>
                      <span className="text-sm text-gray-500">12</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-gray-700">{t('blog.healthTips')}</span>
                      <span className="text-sm text-gray-500">10</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-gray-700">{t('blog.medicalResearch')}</span>
                      <span className="text-sm text-gray-500">8</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-700">{t('blog.mentalHealth')}</span>
                      <span className="text-sm text-gray-500">6</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="text-rose-600" size={20} />
                    <span>{t('blog.topAuthors')}</span>
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
                        <p className="text-sm text-gray-600">12 {t('blog.posts')}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-teal-600">DR</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Dr. Mohammed Ali</p>
                        <p className="text-sm text-gray-600">8 {t('blog.posts')}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>{t('blog.recentActivity')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm">
                      <p className="font-medium">{t('blog.newComment')}</p>
                      <p className="text-gray-600">{t('blog.on')} "{t('blog.post1Title')}"</p>
                      <p className="text-xs text-gray-400">2 {t('blog.hoursAgo')}</p>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">{t('blog.newPost')}</p>
                      <p className="text-gray-600">"{t('blog.post3Title')}"</p>
                      <p className="text-xs text-gray-400">1 {t('blog.dayAgo')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Blog;
