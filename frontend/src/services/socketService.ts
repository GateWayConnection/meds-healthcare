import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private isConnected = false;

  connect(userId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Connect to server - Socket.IO runs on root, not /api
        const socketUrl = import.meta.env.VITE_API_URL 
          ? import.meta.env.VITE_API_URL.replace('/api', '') 
          : 'http://localhost:5000';
        
        this.socket = io(socketUrl, {
          transports: ['websocket', 'polling']
        });

        this.socket.on('connect', () => {
          console.log('Socket connected:', this.socket?.id);
          this.isConnected = true;
          
          // Join user room
          this.socket?.emit('join_user', userId);
          resolve();
        });

        this.socket.on('disconnect', () => {
          console.log('Socket disconnected');
          this.isConnected = false;
        });

        this.socket.on('connect_error', (error) => {
          console.error('Socket connection error:', error);
          reject(error);
        });

        this.socket.on('error', (error) => {
          console.error('Socket error:', error);
        });

      } catch (error) {
        reject(error);
      }
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  joinRoom(roomId: string, userId: string): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('join_room', { roomId, userId });
    }
  }

  sendMessage(data: {
    senderId: string;
    receiverId: string;
    content: string;
    type?: string;
  }): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('send_message', data);
    }
  }

  editMessage(data: {
    messageId: string;
    content: string;
    userId: string;
  }): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('edit_message', data);
    }
  }

  deleteMessage(data: {
    messageId: string;
    userId: string;
  }): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('delete_message', data);
    }
  }

  markAsRead(data: {
    messageId: string;
    userId: string;
  }): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('mark_read', data);
    }
  }

  initiateCall(data: {
    callerId: string;
    receiverId: string;
    callType: 'audio' | 'video';
  }): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('initiate_call', data);
    }
  }

  respondToCall(data: {
    targetSocketId: string;
    accepted: boolean;
    callData?: any;
  }): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('call_response', data);
    }
  }

  sendCallSignal(data: {
    targetSocketId: string;
    signal: any;
  }): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('call_signal', data);
    }
  }

  endCall(data: {
    targetSocketId: string;
  }): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('end_call', data);
    }
  }

  // Event listeners
  onNewMessage(callback: (message: any) => void): void {
    this.socket?.on('new_message', callback);
  }

  onMessageEdited(callback: (message: any) => void): void {
    this.socket?.on('message_edited', callback);
  }

  onMessageDeleted(callback: (data: { messageId: string }) => void): void {
    this.socket?.on('message_deleted', callback);
  }

  onMessageRead(callback: (data: { messageId: string }) => void): void {
    this.socket?.on('message_read', callback);
  }

  onMessageNotification(callback: (data: any) => void): void {
    this.socket?.on('message_notification', callback);
  }

  onUserOnline(callback: (data: { userId: string }) => void): void {
    this.socket?.on('user_online', callback);
  }

  onUserOffline(callback: (data: { userId: string }) => void): void {
    this.socket?.on('user_offline', callback);
  }

  onIncomingCall(callback: (data: any) => void): void {
    this.socket?.on('incoming_call', callback);
  }

  onCallResponse(callback: (data: any) => void): void {
    this.socket?.on('call_response', callback);
  }

  onCallSignal(callback: (data: any) => void): void {
    this.socket?.on('call_signal', callback);
  }

  onCallEnded(callback: () => void): void {
    this.socket?.on('call_ended', callback);
  }

  onCallFailed(callback: (data: { reason: string }) => void): void {
    this.socket?.on('call_failed', callback);
  }

  // Remove listeners
  removeListener(event: string, callback?: (...args: any[]) => void): void {
    if (callback) {
      this.socket?.off(event, callback);
    } else {
      this.socket?.off(event);
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  isSocketConnected(): boolean {
    return this.isConnected && this.socket?.connected === true;
  }
}

export const socketService = new SocketService();