import React from 'react';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Users, Award, Clock, ArrowRight, Shield, Heart, Star } from 'lucide-react';
import SpecialtiesSection from '../components/SpecialtiesSection';
import TestimonialsSection from '../components/TestimonialsSection';

const Home = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-rose-50 via-white to-teal-50 pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/medical-pattern.svg')] opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Your Health is Our{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-teal-600">
                  Priority
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Experience exceptional healthcare with our team of experienced doctors and state-of-the-art facilities. 
                Your well-being is our commitment.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-rose-600 to-teal-600 hover:from-rose-700 hover:to-teal-700 text-white px-8 py-3 text-lg font-medium shadow-lg"
                  onClick={() => window.location.href = '/book-appointment'}
                >
                  Book Appointment
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-rose-200 text-rose-600 hover:bg-rose-50 px-8 py-3 text-lg font-medium"
                  onClick={() => window.location.href = '/find-doctor'}
                >
                  Find a Doctor
                </Button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <img 
                src="/lovable-uploads/d1817da1-2632-445a-9b66-06af157c0005.png" 
                alt="Healthcare professionals" 
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">24/7 Care</p>
                    <p className="text-sm text-gray-600">Always here for you</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Users, label: 'Happy Patients', value: '10,000+', color: 'blue' },
              { icon: Award, label: 'Expert Doctors', value: '50+', color: 'green' },
              { icon: Calendar, label: 'Years Experience', value: '15+', color: 'purple' },
              { icon: Clock, label: 'Available 24/7', value: 'Always', color: 'rose' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="text-center p-6 border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="pt-6">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-${stat.color}-100 mb-4`}>
                      <stat.icon className={`w-8 h-8 text-${stat.color}-600`} />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                    <p className="text-gray-600">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <SpecialtiesSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold text-gray-900 mb-4"
            >
              Why Choose MEDS Healthcare?
            </motion.h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Heart,
                title: 'Personalized Care',
                description: 'Every patient receives individualized attention and treatment plans tailored to their specific needs.'
              },
              {
                icon: Shield,
                title: 'Advanced Technology',
                description: 'State-of-the-art medical equipment and cutting-edge treatment methods for the best outcomes.'
              },
              {
                icon: Star,
                title: 'Experienced Team',
                description: 'Our medical professionals have years of experience and are committed to excellence in healthcare.'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <Card className="p-6 text-center h-full border-0 shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-100 mb-6">
                      <feature.icon className="w-8 h-8 text-rose-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-rose-600 to-teal-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white"
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Take Care of Your Health?</h2>
            <p className="text-xl mb-8 opacity-90">
              Book an appointment today and experience the difference of quality healthcare.
            </p>
            <Button 
              size="lg"
              variant="secondary"
              className="bg-white text-rose-600 hover:bg-gray-50 px-8 py-3 text-lg font-medium"
              onClick={() => window.location.href = '/book-appointment'}
            >
              Schedule Your Visit
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
