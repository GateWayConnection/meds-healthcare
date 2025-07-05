
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Brain, Bone, Eye, Baby, Stethoscope, Activity, Users } from 'lucide-react';
import { useSpecialties } from '../hooks/useSpecialties';

const SpecialtiesSection = () => {
  const { specialties, loading } = useSpecialties();

  const getIconComponent = (name: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'cardiology': <Heart className="w-8 h-8 text-red-500" />,
      'neurology': <Brain className="w-8 h-8 text-purple-500" />,
      'orthopedics': <Bone className="w-8 h-8 text-orange-500" />,
      'ophthalmology': <Eye className="w-8 h-8 text-blue-500" />,
      'pediatrics': <Baby className="w-8 h-8 text-pink-500" />,
      'general': <Stethoscope className="w-8 h-8 text-green-500" />,
      'emergency': <Activity className="w-8 h-8 text-red-600" />,
      'family': <Users className="w-8 h-8 text-teal-500" />
    };

    const key = name.toLowerCase();
    return iconMap[key] || <Stethoscope className="w-8 h-8 text-blue-500" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-gray-900 mb-4"
          >
            Our Medical Specialties
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 max-w-3xl mx-auto"
          >
            Comprehensive healthcare services delivered by experienced specialists across multiple medical disciplines.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {specialties.map((specialty, index) => (
            <motion.div
              key={specialty._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-md">
                <CardContent className="p-6 text-center h-full flex flex-col">
                  <div className="flex justify-center mb-4">
                    {getIconComponent(specialty.name)}
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {specialty.name}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 flex-grow leading-relaxed">
                    {specialty.description}
                  </p>
                  
                  <div className="mt-auto">
                    <Button 
                      variant="outline" 
                      className="w-full border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 transition-colors"
                      onClick={() => window.location.href = `/find-doctor?specialty=${specialty._id}`}
                    >
                      Find Specialists
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {specialties.length === 0 && (
          <div className="text-center py-12">
            <Stethoscope className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Medical Specialties Coming Soon
            </h3>
            <p className="text-gray-500">
              We're expanding our range of specialized medical services.
            </p>
          </div>
        )}

        <div className="text-center mt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button 
              size="lg"
              className="bg-gradient-to-r from-rose-600 to-teal-600 hover:from-rose-700 hover:to-teal-700 text-white px-8 py-3 text-lg font-medium shadow-lg"
              onClick={() => window.location.href = '/find-doctor'}
            >
              View All Doctors
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SpecialtiesSection;
