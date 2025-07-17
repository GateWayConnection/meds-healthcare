import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { chatApiService } from '../services/chatApi';
import { socketService } from '../services/socketService';

export interface ChatNotificationData {
  unreadCount: number;
  hasUnreadMessages: boolean;
}

export const useChatNotifications = () => {
  const { user } = useAuth();
  const [chatNotifications, setChatNotifications] = useState<ChatNotificationData>({
    unreadCount: 0,
    hasUnreadMessages: false
  });

  useEffect(() => {
    if (!user) return;

    // Initialize socket connection
    const initializeChat = async () => {
      try {
        await socketService.connect(user.id);
        await loadUnreadCount();
      } catch (error) {
        console.error('Error initializing chat notifications:', error);
      }
    };

    initializeChat();

    // Listen for new messages to update unread count
    socketService.onMessageNotification((data: any) => {
      setChatNotifications(prev => ({
        unreadCount: prev.unreadCount + 1,
        hasUnreadMessages: true
      }));
    });

    return () => {
      socketService.removeListener('message_notification');
    };
  }, [user]);

  const loadUnreadCount = async () => {
    if (!user) return;

    try {
      const rooms = await chatApiService.getChatRooms();
      let totalUnread = 0;

      rooms.forEach(room => {
        const userUnread = room.unreadCount?.get?.(user.id) || 0;
        totalUnread += userUnread;
      });

      setChatNotifications({
        unreadCount: totalUnread,
        hasUnreadMessages: totalUnread > 0
      });
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  };

  const markAllAsRead = () => {
    setChatNotifications({
      unreadCount: 0,
      hasUnreadMessages: false
    });
  };

  return {
    chatNotifications,
    markAllAsRead,
    refreshUnreadCount: loadUnreadCount
  };
};