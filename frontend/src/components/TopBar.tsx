
import React from 'react';
import { Bell, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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

  // Mock notifications - in real app, this would come from an API
  const notifications = [
    { id: 1, message: 'New appointment request from John Doe', time: '5 minutes ago', unread: true },
    { id: 2, message: 'Appointment confirmed for tomorrow at 2 PM', time: '1 hour ago', unread: true },
    { id: 3, message: 'Patient Sarah completed her treatment', time: '2 hours ago', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-gray-900">
            {user?.role === 'admin' ? 'Admin Panel' : 
             user?.role === 'doctor' ? 'Doctor Dashboard' : 
             'Patient Portal'}
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="px-3 py-2 border-b">
                <h3 className="font-semibold">Notifications</h3>
              </div>
              {notifications.map((notification) => (
                <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-3">
                  <div className="flex items-start justify-between w-full">
                    <p className={`text-sm ${notification.unread ? 'font-medium' : 'text-gray-600'}`}>
                      {notification.message}
                    </p>
                    {notification.unread && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 ml-2 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                </DropdownMenuItem>
              ))}
              {notifications.length === 0 && (
                <div className="px-3 py-4 text-center text-gray-500">
                  No new notifications
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Help */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm">
                <HelpCircle className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Help & Support</DialogTitle>
                <DialogDescription>
                  Get help with using the platform or contact our support team.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Quick Help</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• How to book an appointment</li>
                    <li>• Managing your profile</li>
                    <li>• Payment and billing</li>
                    <li>• Technical support</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Contact Support</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Need more help? Our support team is here for you.
                  </p>
                  <div className="space-y-1 text-sm">
                    <p><strong>Email:</strong> support@healthcare.com</p>
                    <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                    <p><strong>Hours:</strong> Mon-Fri 9AM-6PM</p>
                  </div>
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
