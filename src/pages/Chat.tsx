
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  Phone, 
  Video, 
  Search, 
  Send, 
  Image as ImageIcon,
  Smile,
  MoreVertical
} from 'lucide-react';
import { 
  initializeChatData, 
  getChatRooms, 
  getChatMessages, 
  saveChatMessage,
  getAvailableDoctors,
  getAvailablePatients,
  getUserStatus,
  updateUserStatus,
  getRoomId,
  ChatMessage,
  ChatRoom
} from '../utils/chatData';

const Chat = () => {
  const { user } = useAuth();
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user) {
      initializeChatData();
      updateUserStatus(user.id, 'online');
      loadChatRooms();
      loadAvailableUsers();
    }
  }, [user]);

  useEffect(() => {
    if (selectedRoom) {
      loadMessages(selectedRoom);
    }
  }, [selectedRoom]);

  const loadChatRooms = () => {
    if (user) {
      const rooms = getChatRooms(user.id);
      setChatRooms(rooms);
    }
  };

  const loadMessages = (roomId: string) => {
    const roomMessages = getChatMessages(roomId);
    setMessages(roomMessages);
  };

  const loadAvailableUsers = () => {
    if (user?.role === 'patient') {
      setAvailableUsers(getAvailableDoctors());
    } else if (user?.role === 'doctor') {
      setAvailableUsers(getAvailablePatients());
    }
  };

  const sendMessage = () => {
    if (!message.trim() || !selectedRoom || !user) return;

    const [senderId, receiverId] = selectedRoom.split('-');
    const otherUserId = senderId === user.id ? receiverId : senderId;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: user.id,
      receiverId: otherUserId,
      content: message,
      type: 'text',
      timestamp: new Date(),
      read: false
    };

    saveChatMessage(newMessage);
    setMessage('');
    loadMessages(selectedRoom);
    loadChatRooms();
  };

  const startNewChat = (otherUserId: string) => {
    if (user) {
      const roomId = getRoomId(user.id, otherUserId);
      setSelectedRoom(roomId);
    }
  };

  const getOtherUser = (room: ChatRoom) => {
    if (!user) return null;
    const otherUserId = room.participants.find(id => id !== user.id);
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.find((u: any) => u.id === otherUserId);
  };

  const filteredUsers = availableUsers.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Card className="p-8">
            <CardContent>
              <p className="text-center text-gray-600">Please log in to access the chat.</p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
            style={{ height: '80vh' }}
          >
            <div className="flex h-full">
              {/* Sidebar */}
              <div className="w-1/3 border-r border-gray-200 flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Messages</h2>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Available Users */}
                {searchTerm && (
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="text-sm font-medium text-gray-600 mb-2">
                      Available {user.role === 'patient' ? 'Doctors' : 'Patients'}
                    </h3>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {filteredUsers.map((otherUser) => (
                        <div
                          key={otherUser.id}
                          className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                          onClick={() => startNewChat(otherUser.id)}
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{otherUser.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{otherUser.name}</p>
                            <p className="text-xs text-gray-500">{otherUser.role}</p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {getUserStatus(otherUser.id).status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Chat Rooms */}
                <div className="flex-1 overflow-y-auto">
                  {chatRooms.map((room) => {
                    const otherUser = getOtherUser(room);
                    if (!otherUser) return null;

                    return (
                      <div
                        key={room.id}
                        className={`flex items-center space-x-3 p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${
                          selectedRoom === room.id ? 'bg-rose-50 border-rose-200' : ''
                        }`}
                        onClick={() => setSelectedRoom(room.id)}
                      >
                        <Avatar className="h-12 w-12">
                          <AvatarFallback>{otherUser.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900 truncate">{otherUser.name}</p>
                            <Badge variant="outline" className="text-xs">
                              {getUserStatus(otherUser.id).status}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500 truncate">
                            {room.lastMessage?.content || 'Start a conversation'}
                          </p>
                        </div>
                        {room.unreadCount > 0 && (
                          <Badge className="bg-rose-500">{room.unreadCount}</Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Chat Area */}
              <div className="flex-1 flex flex-col">
                {selectedRoom ? (
                  <>
                    {/* Chat Header */}
                    <div className="p-4 border-b border-gray-200 bg-white">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>
                              {getOtherUser(chatRooms.find(r => r.id === selectedRoom)!)?.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {getOtherUser(chatRooms.find(r => r.id === selectedRoom)!)?.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {getUserStatus(getOtherUser(chatRooms.find(r => r.id === selectedRoom)!)?.id).status}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Phone size={16} />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Video size={16} />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreVertical size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              msg.senderId === user.id
                                ? 'bg-rose-500 text-white'
                                : 'bg-gray-200 text-gray-900'
                            }`}
                          >
                            <p className="text-sm">{msg.content}</p>
                            <p className={`text-xs mt-1 ${
                              msg.senderId === user.id ? 'text-rose-100' : 'text-gray-500'
                            }`}>
                              {new Date(msg.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Message Input */}
                    <div className="p-4 border-t border-gray-200 bg-white">
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <ImageIcon size={16} />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Smile size={16} />
                        </Button>
                        <div className="flex-1 flex items-center space-x-2">
                          <Input
                            placeholder="Type a message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                            className="flex-1"
                          />
                          <Button onClick={sendMessage} className="bg-rose-500 hover:bg-rose-600">
                            <Send size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <MessageCircle size={64} className="mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                      <p className="text-gray-600">Choose an existing chat or start a new conversation</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Chat;
