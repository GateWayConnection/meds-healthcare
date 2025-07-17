
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useNotifications } from '../hooks/useNotifications';
import { useChatNotifications } from '../hooks/useChatNotifications';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Menu, X, Globe, User, LogOut, MessageCircle, Bell } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { unreadCount, notifications, markAllAsRead } = useNotifications();
  const { chatNotifications } = useChatNotifications();
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

          {/* Desktop Navigation - Simplified */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-rose-600 transition-colors">
              {t('nav.home')}
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-rose-600 transition-colors">
              {t('nav.about')}
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-rose-600 transition-colors">
              {t('nav.contact')}
            </Link>
            
            {/* Chat for logged in users */}
            {user && (
              <Link to="/chat" className="flex items-center space-x-1 text-gray-700 hover:text-rose-600 transition-colors relative">
                <MessageCircle size={16} />
                <span>{t('nav.chat')}</span>
                {chatNotifications.hasUnreadMessages && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center p-0">
                    {chatNotifications.unreadCount > 9 ? '9+' : chatNotifications.unreadCount}
                  </Badge>
                )}
              </Link>
            )}
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
                {/* Notifications */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="relative text-gray-700 hover:text-rose-600">
                      <Bell size={16} />
                      {unreadCount > 0 && (
                        <Badge 
                          className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center p-0"
                        >
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <div className="p-3 border-b">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">Notifications</h3>
                        {unreadCount > 0 && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={markAllAsRead}
                            className="text-xs"
                          >
                            Mark all read
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.slice(0, 5).map((notification) => (
                          <DropdownMenuItem 
                            key={notification.id} 
                            className={`p-3 cursor-pointer ${!notification.read ? 'bg-blue-50' : ''}`}
                          >
                            <div className="flex flex-col w-full">
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-sm">{notification.title}</span>
                                <span className="text-xs text-gray-500">
                                  {notification.timestamp.toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1 truncate">
                                {notification.content}
                              </p>
                            </div>
                          </DropdownMenuItem>
                        ))
                      ) : (
                        <div className="p-6 text-center text-gray-500">
                          <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                          <p className="text-sm">No notifications</p>
                        </div>
                      )}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

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
                    {t('nav.register')}
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
              <Link to="/contact" className="block px-3 py-2 text-gray-700 hover:text-rose-600">
                {t('nav.contact')}
              </Link>
              
              {user && (
                <Link to="/chat" className="block px-3 py-2 text-gray-700 hover:text-rose-600 relative">
                  <div className="flex items-center gap-2">
                    {t('nav.chat')}
                    {chatNotifications.hasUnreadMessages && (
                      <Badge className="h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center p-0">
                        {chatNotifications.unreadCount > 9 ? '9+' : chatNotifications.unreadCount}
                      </Badge>
                    )}
                  </div>
                </Link>
              )}
              
              {user ? (
                <div className="border-t pt-2">
                  <Link to={getDashboardRoute()} className="block px-3 py-2 text-gray-700">
                    {t('nav.dashboard')}
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 text-gray-700"
                  >
                    {t('nav.logout')}
                  </button>
                </div>
              ) : (
                <div className="border-t pt-2 space-y-1">
                  <Link to="/login" className="block px-3 py-2 text-rose-600">
                    {t('nav.login')}
                  </Link>
                  <Link to="/register" className="block px-3 py-2 text-rose-600">
                    {t('nav.register')}
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
