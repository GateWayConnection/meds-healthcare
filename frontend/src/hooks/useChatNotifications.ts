
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
        console.log('🔔 Initializing chat notifications for:', user.id);
        await socketService.connect(user.id);
        await loadUnreadCount();
      } catch (error) {
        console.error('❌ Error initializing chat notifications:', error);
      }
    };

    initializeChat();

    // Listen for new messages to update unread count
    const handleMessageNotification = (data: any) => {
      console.log('🔔 New message notification:', data);
      setChatNotifications(prev => ({
        unreadCount: prev.unreadCount + 1,
        hasUnreadMessages: true
      }));
    };

    const handleNewMessage = (data: any) => {
      console.log('🔔 New message received:', data);
      // Only increment if the message is not from the current user
      if (data.message.senderId._id !== user.id) {
        setChatNotifications(prev => ({
          unreadCount: prev.unreadCount + 1,
          hasUnreadMessages: true
        }));
      }
    };

    socketService.onMessageNotification(handleMessageNotification);
    socketService.onNewMessage(handleNewMessage);

    return () => {
      socketService.removeListener('message_notification', handleMessageNotification);
      socketService.removeListener('new_message', handleNewMessage);
    };
  }, [user]);

  const loadUnreadCount = async () => {
    if (!user) return;

    try {
      console.log('🔄 Loading unread count for user:', user.id);
      const rooms = await chatApiService.getChatRooms();
      let totalUnread = 0;

      rooms.forEach(room => {
        const userUnread = room.unreadCount?.get?.(user.id) || 0;
        totalUnread += userUnread;
      });

      console.log('✅ Total unread messages:', totalUnread);
      setChatNotifications({
        unreadCount: totalUnread,
        hasUnreadMessages: totalUnread > 0
      });
    } catch (error) {
      console.error('❌ Error loading unread count:', error);
    }
  };

  const markAllAsRead = () => {
    setChatNotifications({
      unreadCount: 0,
      hasUnreadMessages: false
    });
  };

  const decrementUnreadCount = (count: number = 1) => {
    setChatNotifications(prev => ({
      unreadCount: Math.max(0, prev.unreadCount - count),
      hasUnreadMessages: Math.max(0, prev.unreadCount - count) > 0
    }));
  };

  return {
    chatNotifications,
    markAllAsRead,
    decrementUnreadCount,
    refreshUnreadCount: loadUnreadCount
  };
};
