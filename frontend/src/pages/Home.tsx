
import React from 'react';
import Layout from '../components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Users, 
  Clock, 
  Shield, 
  Phone, 
  MapPin, 
  Mail,
  Star,
  Calendar,
  UserCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useStats } from '../hooks/useStats';
import { useSpecialties } from '../hooks/useSpecialties';
import { useDoctors } from '../hooks/useDoctors';

const Home = () => {
  const { t } = useLanguage();
  const { stats, loading: statsLoading } = useStats();
  const { specialties, loading: specialtiesLoading } = useSpecialties();
  const { doctors, loading: doctorsLoading } = useDoctors();

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-rose-50 via-white to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                {t('hero.title')}
                <span className="text-rose-600"> {t('hero.healthcare')}</span>
              </h1>
              <p className="text-xl text-gray-600 mt-6 leading-relaxed">
                {t('hero.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Link to="/book-appointment">
                  <Button size="lg" className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-4 text-lg">
                    {t('hero.bookAppointment')}
                  </Button>
                </Link>
                <Link to="/find-doctor">
                  <Button variant="outline" size="lg" className="border-rose-200 text-rose-600 hover:bg-rose-50 px-8 py-4 text-lg">
                    {t('hero.findDoctor')}
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <img
                src="/lovable-uploads/c6d79c4f-2b26-4617-a3d4-f048835aae61.png"
                alt="Healthcare professionals"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section - Using Real Data */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            <motion.div variants={fadeInUp} className="text-center">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserCheck className="w-8 h-8 text-rose-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900">
                {statsLoading ? '...' : stats?.expertDoctors || 0}
              </h3>
              <p className="text-gray-600">{t('stats.expertDoctors')}</p>
            </motion.div>

            <motion.div variants={fadeInUp} className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900">
                {statsLoading ? '...' : `${stats?.happyPatients || 0}+`}
              </h3>
              <p className="text-gray-600">{t('stats.happyPatients')}</p>
            </motion.div>

            <motion.div variants={fadeInUp} className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900">
                {statsLoading ? '...' : `${stats?.medicalDepartments || 0}+`}
              </h3>
              <p className="text-gray-600">{t('stats.medicalDepartments')}</p>
            </motion.div>

            <motion.div variants={fadeInUp} className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900">
                {statsLoading ? '...' : stats?.emergencySupport || '24/7'}
              </h3>
              <p className="text-gray-600">{t('stats.emergencySupport')}</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Specialties Section - Using Real Data */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            {...fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('specialties.title')}</h2>
            <p className="text-xl text-gray-600">{t('specialties.subtitle')}</p>
          </motion.div>

          <motion.div
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {specialtiesLoading ? (
              Array(6).fill(0).map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-xl shadow-lg">
                  <div className="animate-pulse">
                    <div className="w-12 h-12 bg-gray-300 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded"></div>
                  </div>
                </div>
              ))
            ) : (
              specialties.slice(0, 6).map((specialty, index) => (
                <motion.div
                  key={specialty._id}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer"
                >
                  <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center mb-4">
                    <Heart className="w-6 h-6 text-rose-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{specialty.name}</h3>
                  <p className="text-gray-600">{specialty.description}</p>
                </motion.div>
              ))
            )}
          </motion.div>
        </div>
      </section>

      {/* Featured Doctors Section - Using Real Data */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            {...fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('doctors.title')}</h2>
            <p className="text-xl text-gray-600">{t('doctors.subtitle')}</p>
          </motion.div>

          <motion.div
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {doctorsLoading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-xl shadow-lg">
                  <div className="animate-pulse">
                    <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded"></div>
                  </div>
                </div>
              ))
            ) : (
              doctors.slice(0, 3).map((doctor, index) => (
                <motion.div
                  key={doctor._id}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">{doctor.name}</h3>
                  <p className="text-rose-600 text-center mb-2">{doctor.specialty}</p>
                  <div className="flex items-center justify-center mb-2">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">{doctor.rating}</span>
                    <span className="text-sm text-gray-500 ml-2">{doctor.experience} years exp</span>
                  </div>
                  <p className="text-center text-gray-600 text-sm">Fee: ${doctor.consultationFee}</p>
                  <Link to="/book-appointment">
                    <Button className="w-full mt-4 bg-rose-600 hover:bg-rose-700">
                      Book Appointment
                    </Button>
                  </Link>
                </motion.div>
              ))
            )}
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-br from-rose-600 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            {...fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">{t('contact.title')}</h2>
            <p className="text-xl opacity-90">{t('contact.subtitle')}</p>
          </motion.div>

          <motion.div
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div variants={fadeInUp} className="text-center">
              <Phone className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t('contact.phone')}</h3>
              <p className="opacity-90">+1 (555) 123-4567</p>
            </motion.div>

            <motion.div variants={fadeInUp} className="text-center">
              <Mail className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t('contact.email')}</h3>
              <p className="opacity-90">info@medshealthcare.com</p>
            </motion.div>

            <motion.div variants={fadeInUp} className="text-center">
              <MapPin className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t('contact.address')}</h3>
              <p className="opacity-90">123 Healthcare St, Medical City, MC 12345</p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
