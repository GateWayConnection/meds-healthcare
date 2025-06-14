
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gray-900 text-white py-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <img 
                src="/lovable-uploads/c6d79c4f-2b26-4617-a3d4-f048835aae61.png" 
                alt="MEDS Healthcare" 
                className="h-8 w-8"
              />
              <span className="text-xl font-bold text-rose-400">MEDS Healthcare</span>
            </div>
            <p className="text-gray-300 mb-4">
              Quality healthcare services in Sudan with modern technology and caring professionals. 
              Your health is our priority.
            </p>
            <div className="text-sm text-gray-400">
              © 2024 MEDS Healthcare. All rights reserved.
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-rose-400">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/find-doctor" className="text-gray-300 hover:text-white transition-colors">Find Doctor</Link></li>
              <li><Link to="/book-appointment" className="text-gray-300 hover:text-white transition-colors">Book Appointment</Link></li>
              <li><Link to="/health-navigation" className="text-gray-300 hover:text-white transition-colors">Health Navigation</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-rose-400">Contact Info</h3>
            <ul className="space-y-2 text-gray-300">
              <li>📍 Khartoum, Sudan</li>
              <li>📞 +249 123 456 789</li>
              <li>✉️ info@medshealthcare.sd</li>
              <li>🕒 24/7 Emergency</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
