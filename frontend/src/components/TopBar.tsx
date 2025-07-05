
import React, { useState } from 'react';
import { Bell, HelpCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import AccountSettings from './AccountSettings';
import { useAuth } from '../contexts/AuthContext';

const TopBar = () => {
  const { user } = useAuth();
  const [notifications] = useState([
    {
      id: 1,
      title: 'New Appointment Request',
      message: 'You have a new appointment request from John Doe',
      time: '5 minutes ago',
      read: false
    },
    {
      id: 2,
      title: 'Appointment Confirmed',
      message: 'Your appointment with Dr. Smith has been confirmed',
      time: '1 hour ago',
      read: false
    },
    {
      id: 3,
      title: 'Profile Updated',
      message: 'Your profile information has been successfully updated',
      time: '2 hours ago',
      read: true
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex-1" />
        
        <div className="flex items-center space-x-4">
          {/* Notifications Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 bg-white shadow-lg border" align="end">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between w-full">
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-600'}`}>
                            {notification.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {notification.time}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-1 flex-shrink-0" />
                        )}
                      </div>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No notifications</p>
                  </div>
                )}
              </div>
              {notifications.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-center text-blue-600 hover:text-blue-700">
                    <button className="w-full text-sm">Mark all as read</button>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Help Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm">
                <HelpCircle className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Help & Support</DialogTitle>
                <DialogDescription>
                  Get help with using our healthcare platform
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Quick Help</h4>
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li>• How to book an appointment</li>
                    <li>• Managing your profile</li>
                    <li>• Viewing medical records</li>
                    <li>• Contacting your doctor</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <Button className="w-full" onClick={() => window.location.href = '/contact'}>
                    Contact Support
                  </Button>
                  <Button variant="outline" className="w-full">
                    View FAQ
                  </Button>
                  <Button variant="outline" className="w-full">
                    Live Chat
                  </Button>
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Need immediate help? Call us at{' '}
                    <a href="tel:+1234567890" className="text-blue-600 hover:text-blue-700">
                      (123) 456-7890
                    </a>
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Account Settings */}
          <AccountSettings />
        </div>
      </div>
    </div>
  );
};

export default TopBar;
