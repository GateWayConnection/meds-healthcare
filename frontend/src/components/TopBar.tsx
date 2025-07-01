
import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, Bell, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TopBar = () => {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-gradient-to-r from-rose-600 to-teal-600 text-white py-2 px-4"
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-1">
            <Phone size={14} />
            <span>Emergency: +249 123 456 789</span>
          </div>
          <div className="flex items-center space-x-1">
            <Mail size={14} />
            <span>info@medshealthcare.sd</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 h-8">
            <Bell size={14} className="mr-1" />
            <span className="hidden sm:inline">Notifications</span>
          </Button>
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 h-8">
            <HelpCircle size={14} className="mr-1" />
            <span className="hidden sm:inline">Help</span>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default TopBar;
