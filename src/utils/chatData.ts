
export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: 'text' | 'image' | 'voice' | 'video';
  timestamp: Date;
  read: boolean;
  imageUrl?: string;
}

export interface ChatRoom {
  id: string;
  participants: string[];
  lastMessage?: ChatMessage;
  lastActivity: Date;
  unreadCount: number;
}

export interface UserStatus {
  userId: string;
  status: 'online' | 'offline' | 'busy';
  lastSeen: Date;
}

export const initializeChatData = () => {
  if (!localStorage.getItem('chatMessages')) {
    localStorage.setItem('chatMessages', JSON.stringify([]));
  }
  if (!localStorage.getItem('chatRooms')) {
    localStorage.setItem('chatRooms', JSON.stringify([]));
  }
  if (!localStorage.getItem('userStatuses')) {
    localStorage.setItem('userStatuses', JSON.stringify([]));
  }
};

export const getChatMessages = (roomId: string): ChatMessage[] => {
  const messages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
  return messages.filter((msg: ChatMessage) => 
    getRoomId(msg.senderId, msg.receiverId) === roomId
  );
};

export const saveChatMessage = (message: ChatMessage) => {
  const messages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
  messages.push(message);
  localStorage.setItem('chatMessages', JSON.stringify(messages));
  
  // Update room last activity
  updateChatRoom(message.senderId, message.receiverId, message);
};

export const getChatRooms = (userId: string): ChatRoom[] => {
  const rooms = JSON.parse(localStorage.getItem('chatRooms') || '[]');
  return rooms.filter((room: ChatRoom) => room.participants.includes(userId));
};

export const getRoomId = (userId1: string, userId2: string): string => {
  return [userId1, userId2].sort().join('-');
};

export const updateChatRoom = (senderId: string, receiverId: string, lastMessage: ChatMessage) => {
  const rooms = JSON.parse(localStorage.getItem('chatRooms') || '[]');
  const roomId = getRoomId(senderId, receiverId);
  
  let room = rooms.find((r: ChatRoom) => r.id === roomId);
  if (!room) {
    room = {
      id: roomId,
      participants: [senderId, receiverId],
      lastActivity: new Date(),
      unreadCount: 0
    };
    rooms.push(room);
  }
  
  room.lastMessage = lastMessage;
  room.lastActivity = new Date();
  
  localStorage.setItem('chatRooms', JSON.stringify(rooms));
};

export const getUserStatus = (userId: string): UserStatus => {
  const statuses = JSON.parse(localStorage.getItem('userStatuses') || '[]');
  return statuses.find((s: UserStatus) => s.userId === userId) || {
    userId,
    status: 'offline',
    lastSeen: new Date()
  };
};

export const updateUserStatus = (userId: string, status: 'online' | 'offline' | 'busy') => {
  const statuses = JSON.parse(localStorage.getItem('userStatuses') || '[]');
  const existingIndex = statuses.findIndex((s: UserStatus) => s.userId === userId);
  
  const userStatus: UserStatus = {
    userId,
    status,
    lastSeen: new Date()
  };
  
  if (existingIndex >= 0) {
    statuses[existingIndex] = userStatus;
  } else {
    statuses.push(userStatus);
  }
  
  localStorage.setItem('userStatuses', JSON.stringify(statuses));
};

export const getAvailableDoctors = (): any[] => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  return users.filter((user: any) => user.role === 'doctor');
};

export const getAvailablePatients = (): any[] => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  return users.filter((user: any) => user.role === 'patient');
};
