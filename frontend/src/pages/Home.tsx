
import React from 'react';
import Layout from '../components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, Users, Clock, Award, Heart, Star, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useStats } from '../hooks/useStats';
import { useSpecialties } from '../hooks/useSpecialties';

const Home = () => {
  const { t } = useLanguage();
  const { stats, loading: statsLoading } = useStats();
  const { specialties } = useSpecialties();

  const features = [
    {
      icon: Users,
      title: t('home.features.expertDoctors'),
      description: t('home.features.expertDoctorsDesc'),
      count: stats?.expertDoctors || 0
    },
    {
      icon: Heart,
      title: t('home.features.happyPatients'),
      description: t('home.features.happyPatientsDesc'),
      count: stats?.happyPatients || 0
    },
    {
      icon: Award,
      title: t('home.features.medicalDepartments'),
      description: t('home.features.medicalDepartmentsDesc'),
      count: stats?.medicalDepartments || 0
    },
    {
      icon: Clock,
      title: t('home.features.emergencySupport'),
      description: t('home.features.emergencySupportDesc'),
      count: stats?.emergencySupport || '24/7'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      rating: 5,
      comment: 'Excellent service and professional doctors. Highly recommended!'
    },
    {
      name: 'Ahmed Hassan',
      rating: 5,
      comment: 'Great experience with online consultation. Very convenient.'
    },
    {
      name: 'Maria Garcia',
      rating: 5,
      comment: 'The doctors are very knowledgeable and caring.'
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-teal-50 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                {t('home.hero.title')}{' '}
                <span className="text-rose-600">{t('home.hero.titleHighlight')}</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                {t('home.hero.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/find-doctor">
                  <Button className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-3 text-lg">
                    {t('home.hero.findDoctor')}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/book-appointment">
                  <Button variant="outline" className="border-rose-600 text-rose-600 hover:bg-rose-50 px-8 py-3 text-lg">
                    {t('home.hero.bookAppointment')}
                    <Calendar className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <img
                src="/lovable-uploads/d1817da1-2632-445a-9b66-06af157c0005.png"
                alt="Healthcare Team"
                className="w-full h-auto rounded-lg shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('home.stats.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('home.stats.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="text-center p-8 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-0">
                    <feature.icon className="w-12 h-12 text-rose-600 mx-auto mb-4" />
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">
                      {statsLoading ? '...' : typeof feature.count === 'number' ? `${feature.count}+` : feature.count}
                    </h3>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h4>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('home.specialties.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('home.specialties.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {specialties.slice(0, 6).map((specialty, index) => (
              <motion.div
                key={specialty._id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer group">
                  <CardContent className="p-0">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center group-hover:bg-rose-200 transition-colors">
                        <span className="text-2xl">{specialty.icon}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {specialty.name}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {specialty.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/find-doctor">
              <Button className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-3">
                {t('home.specialties.viewAll')}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('home.testimonials.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('home.testimonials.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="p-6 shadow-lg">
                  <CardContent className="p-0">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-4 italic">
                      "{testimonial.comment}"
                    </p>
                    <p className="font-semibold text-gray-900">
                      {testimonial.name}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-rose-600 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('home.cta.title')}
            </h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              {t('home.cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button className="bg-white text-rose-600 hover:bg-gray-100 px-8 py-3 text-lg">
                  {t('home.cta.getStarted')}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-rose-600 px-8 py-3 text-lg">
                  {t('home.cta.contactUs')}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
