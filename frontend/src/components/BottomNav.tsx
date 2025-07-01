
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { useIsMobile } from '../hooks/use-mobile';
import { Stethoscope, Calendar, Navigation, BookOpen, FileText } from 'lucide-react';

const BottomNav = () => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();

  const navItems = [
    {
      to: '/find-doctor',
      icon: Stethoscope,
      label: t('nav.findDoctor'),
      key: 'findDoctor'
    },
    {
      to: '/book-appointment',
      icon: Calendar,
      label: t('nav.bookAppointment'),
      key: 'bookAppointment'
    },
    {
      to: '/health-navigation',
      icon: Navigation,
      label: t('nav.healthNav'),
      key: 'healthNav'
    },
    {
      to: '/academics',
      icon: BookOpen,
      label: t('nav.academics'),
      key: 'academics'
    },
    {
      to: '/blog',
      icon: FileText,
      label: t('nav.blog'),
      key: 'blog'
    }
  ];

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-center items-center py-3">
          <div className={`flex ${isMobile ? 'space-x-6' : 'space-x-8 md:space-x-12'}`}>
            {navItems.map((item) => (
              <Link
                key={item.key}
                to={item.to}
                className="flex flex-col items-center space-y-1 text-gray-600 hover:text-rose-600 transition-colors group"
              >
                <item.icon size={isMobile ? 18 : 20} className="group-hover:scale-110 transition-transform" />
                {!isMobile && (
                  <span className="text-xs font-medium">{item.label}</span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BottomNav;
