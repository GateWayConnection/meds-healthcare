
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Menu, X, Globe, User, LogOut } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardRoute = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'patient': return '/patient/dashboard';
      case 'doctor': return '/doctor/dashboard';
      case 'admin': return '/admin/dashboard';
      default: return '/';
    }
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white/90 backdrop-blur-md shadow-lg sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/c6d79c4f-2b26-4617-a3d4-f048835aae61.png" 
              alt="MEDS Healthcare" 
              className="h-10 w-10"
            />
            <span className="text-xl font-bold text-rose-600">MEDS Healthcare</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-rose-600 transition-colors">
              {t('nav.home')}
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-rose-600 transition-colors">
              {t('nav.about')}
            </Link>
            <Link to="/find-doctor" className="text-gray-700 hover:text-rose-600 transition-colors">
              {t('nav.findDoctor')}
            </Link>
            <Link to="/book-appointment" className="text-gray-700 hover:text-rose-600 transition-colors">
              {t('nav.bookAppointment')}
            </Link>
            <Link to="/health-navigation" className="text-gray-700 hover:text-rose-600 transition-colors">
              {t('nav.healthNav')}
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-rose-600 transition-colors">
              {t('nav.contact')}
            </Link>
          </div>

          {/* Right side actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              className="text-gray-700 hover:text-rose-600"
            >
              <Globe size={16} className="mr-1" />
              {language === 'en' ? 'العربية' : 'English'}
            </Button>

            {user ? (
              <div className="flex items-center space-x-2">
                <Link 
                  to={getDashboardRoute()}
                  className="flex items-center space-x-1 text-gray-700 hover:text-rose-600"
                >
                  <User size={16} />
                  <span>{user.name}</span>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-rose-600"
                >
                  <LogOut size={16} />
                </Button>
              </div>
            ) : (
              <div className="space-x-2">
                <Link to="/login">
                  <Button variant="ghost" className="text-rose-600 hover:bg-rose-50">
                    {t('nav.login')}
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-rose-600 hover:bg-rose-700 text-white">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t"
          >
            <div className="px-4 pt-2 pb-3 space-y-1">
              <Link to="/" className="block px-3 py-2 text-gray-700 hover:text-rose-600">
                {t('nav.home')}
              </Link>
              <Link to="/about" className="block px-3 py-2 text-gray-700 hover:text-rose-600">
                {t('nav.about')}
              </Link>
              <Link to="/find-doctor" className="block px-3 py-2 text-gray-700 hover:text-rose-600">
                {t('nav.findDoctor')}
              </Link>
              <Link to="/book-appointment" className="block px-3 py-2 text-gray-700 hover:text-rose-600">
                {t('nav.bookAppointment')}
              </Link>
              <Link to="/health-navigation" className="block px-3 py-2 text-gray-700 hover:text-rose-600">
                {t('nav.healthNav')}
              </Link>
              <Link to="/contact" className="block px-3 py-2 text-gray-700 hover:text-rose-600">
                {t('nav.contact')}
              </Link>
              
              {user ? (
                <div className="border-t pt-2">
                  <Link to={getDashboardRoute()} className="block px-3 py-2 text-gray-700">
                    Dashboard
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 text-gray-700"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="border-t pt-2 space-y-1">
                  <Link to="/login" className="block px-3 py-2 text-rose-600">
                    {t('nav.login')}
                  </Link>
                  <Link to="/register" className="block px-3 py-2 text-rose-600">
                    Register
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
