
import React from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Calendar, User, Clock } from 'lucide-react';

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: '10 Tips for Maintaining Good Health',
      excerpt: 'Learn about essential habits that can help you maintain optimal health and wellness.',
      author: 'Dr. Sarah Johnson',
      date: '2024-01-15',
      category: 'Wellness',
      readTime: '5 min read',
      image: '/placeholder.svg'
    },
    {
      id: 2,
      title: 'Understanding Mental Health in the Digital Age',
      excerpt: 'Exploring the impact of technology on mental health and strategies for digital wellness.',
      author: 'Dr. Ahmed Hassan',
      date: '2024-01-12',
      category: 'Mental Health',
      readTime: '7 min read',
      image: '/placeholder.svg'
    },
    {
      id: 3,
      title: 'The Importance of Regular Health Checkups',
      excerpt: 'Why preventive care is crucial for early detection and treatment of health conditions.',
      author: 'Dr. Maria Garcia',
      date: '2024-01-10',
      category: 'Preventive Care',
      readTime: '4 min read',
      image: '/placeholder.svg'
    },
    {
      id: 4,
      title: 'Nutrition Guidelines for a Healthy Lifestyle',
      excerpt: 'Evidence-based nutrition recommendations for maintaining optimal health.',
      author: 'Dr. Lisa Chen',
      date: '2024-01-08',
      category: 'Nutrition',
      readTime: '6 min read',
      image: '/placeholder.svg'
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Health & Wellness Blog</h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Stay informed with the latest health tips, medical insights, and wellness advice from our expert team
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {blogPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="shadow-lg hover:shadow-xl transition-shadow h-full cursor-pointer">
                    <div className="aspect-video bg-gray-200 rounded-t-lg flex items-center justify-center">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover rounded-t-lg"
                      />
                    </div>
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary">{post.category}</Badge>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-1" />
                          {post.readTime}
                        </div>
                      </div>
                      <CardTitle className="text-xl hover:text-rose-600 transition-colors">
                        {post.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-2" />
                          {post.author}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          {new Date(post.date).toLocaleDateString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Blog;
