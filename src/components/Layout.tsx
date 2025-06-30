
import React from 'react';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';
import TopBar from './TopBar';

interface LayoutProps {
  children: React.ReactNode;
  showNavbar?: boolean;
  showFooter?: boolean;
  showTopBar?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  showNavbar = true, 
  showFooter = true,
  showTopBar = true 
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-teal-50">
      {showTopBar && <TopBar />}
      {showNavbar && <Navbar />}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="flex-1"
      >
        {children}
      </motion.main>
      {showFooter && <Footer />}
    </div>
  );
};

export default Layout;
