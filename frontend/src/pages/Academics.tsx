
import React from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { BookOpen, GraduationCap, Award, Users } from 'lucide-react';

const Academics = () => {
  const programs = [
    {
      title: 'Medical Education',
      description: 'Comprehensive medical education programs for aspiring healthcare professionals.',
      icon: GraduationCap,
      features: ['MBBS Program', 'Specialization Courses', 'Residency Training']
    },
    {
      title: 'Nursing Programs',
      description: 'Professional nursing education with hands-on clinical experience.',
      icon: Users,
      features: ['BSN Degree', 'RN Certification', 'Advanced Practice']
    },
    {
      title: 'Research Opportunities',
      description: 'Cutting-edge medical research in various specialties.',
      icon: BookOpen,
      features: ['Clinical Trials', 'Research Projects', 'Publication Support']
    },
    {
      title: 'Continuing Education',
      description: 'Professional development for practicing healthcare providers.',
      icon: Award,
      features: ['CME Credits', 'Workshops', 'Online Courses']
    }
  ];

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
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Academic Programs</h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Advancing healthcare education through innovative programs and research opportunities
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {programs.map((program, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="shadow-lg hover:shadow-xl transition-shadow h-full">
                    <CardHeader>
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <program.icon className="w-6 h-6 text-blue-600" />
                        </div>
                        <CardTitle className="text-xl">{program.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{program.description}</p>
                      <ul className="space-y-2">
                        {program.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center text-sm text-gray-700">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                            {feature}
                          </li>
                        ))}
                      </ul>
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

export default Academics;
