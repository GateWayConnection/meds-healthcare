import { apiService } from './api';

export interface ChatMessage {
  _id: string;
  senderId: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  receiverId: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  content: string;
  type: 'text' | 'image' | 'voice' | 'video';
  isRead: boolean;
  isEdited?: boolean;
  editedAt?: string;
  roomId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatRoom {
  _id: string;
  participants: Array<{
    _id: string;
    name: string;
    email: string;
    role: string;
  }>;
  lastMessage?: ChatMessage;
  lastActivity: string;
  unreadCount: Map<string, number>;
  createdAt: string;
  updatedAt: string;
}

class ChatApiService {
  // Get user's chat rooms
  async getChatRooms(): Promise<ChatRoom[]> {
    try {
      const response = await fetch(`${apiService.baseURL}/chat/rooms`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch chat rooms');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
      throw error;
    }
  }

  // Get messages for a specific room
  async getRoomMessages(roomId: string): Promise<ChatMessage[]> {
    try {
      const response = await fetch(`${apiService.baseURL}/chat/messages/${roomId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  }

  // Send a message
  async sendMessage(data: {
    receiverId: string;
    content: string;
    type?: string;
  }): Promise<ChatMessage> {
    try {
      const response = await fetch(`${apiService.baseURL}/chat/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  // Edit a message
  async editMessage(messageId: string, content: string): Promise<ChatMessage> {
    try {
      const response = await fetch(`${apiService.baseURL}/chat/messages/${messageId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content })
      });

      if (!response.ok) {
        throw new Error('Failed to edit message');
      }

      return await response.json();
    } catch (error) {
      console.error('Error editing message:', error);
      throw error;
    }
  }

  // Delete a message
  async deleteMessage(messageId: string): Promise<void> {
    try {
      const response = await fetch(`${apiService.baseURL}/chat/messages/${messageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete message');
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  }

  // Create or get existing chat room
  async createChatRoom(participantId: string): Promise<ChatRoom> {
    try {
      console.log('🔄 Creating chat room for participant:', participantId);
      console.log('🔍 Participant ID type:', typeof participantId);
      console.log('🔍 Participant ID length:', participantId?.length);
      console.log('🔍 Participant ID valid:', participantId && participantId.length > 0);
      console.log('🌐 Using baseURL:', apiService.baseURL);
      console.log('🔑 Auth token:', localStorage.getItem('token') ? 'Present' : 'Missing');
      
      const response = await fetch(`${apiService.baseURL}/chat/rooms/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ participantId })
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response OK:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Server response:', errorText);
        throw new Error(`Failed to create chat room: ${response.status} ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Chat room created successfully:', result);
      return result;
    } catch (error) {
      console.error('❌ Error creating chat room:', error);
      throw error;
    }
  }

  // Mark message as read
  async markMessageAsRead(messageId: string): Promise<void> {
    try {
      const response = await fetch(`${apiService.baseURL}/chat/messages/${messageId}/read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to mark message as read');
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
      throw error;
    }
  }
}

export const chatApiService = new ChatApiService();