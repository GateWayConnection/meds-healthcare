import { useState, useEffect } from 'react';
import { socketService } from '../services/socketService';
import { chatApiService } from '../services/chatApi';
import { useAuth } from '../contexts/AuthContext';

export interface NotificationData {
  id: string;
  type: 'message' | 'call';
  title: string;
  content: string;
  timestamp: Date;
  read: boolean;
  senderId?: string;
  senderName?: string;
}

export const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    // Initialize socket connection
    socketService.connect(user.id);

    // Listen for message notifications
    socketService.onMessageNotification((data: any) => {
      const notification: NotificationData = {
        id: data.message._id,
        type: 'message',
        title: `New message from ${data.senderName}`,
        content: data.message.content,
        timestamp: new Date(data.message.createdAt),
        read: false,
        senderId: data.message.senderId._id,
        senderName: data.senderName
      };

      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    // Listen for call notifications
    socketService.onIncomingCall((callData: any) => {
      const notification: NotificationData = {
        id: `call-${Date.now()}`,
        type: 'call',
        title: `Incoming ${callData.callType} call`,
        content: `${callData.callerName} is calling you`,
        timestamp: new Date(),
        read: false,
        senderId: callData.callerId,
        senderName: callData.callerName
      };

      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    return () => {
      socketService.removeListener('message_notification');
      socketService.removeListener('incoming_call');
    };
  }, [user]);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications
  };
};