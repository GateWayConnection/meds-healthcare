import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { MessageCircle, Send, Video, Phone, Search, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { chatApiService, ChatRoom, ChatMessage } from '../../services/chatApi';
import { socketService } from '../../services/socketService';
import { toast } from 'sonner';

const DoctorChat = () => {
  const { user } = useAuth();
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadChatRooms();
    setupSocketListeners();
    
    return () => {
      // Cleanup socket listeners
      socketService.removeListener('new_message');
      socketService.removeListener('message_edited');
      socketService.removeListener('message_deleted');
      socketService.removeListener('incoming_call');
    };
  }, []);

  useEffect(() => {
    if (selectedRoom) {
      loadMessages(selectedRoom._id);
    }
  }, [selectedRoom]);

  const loadChatRooms = async () => {
    try {
      setLoading(true);
      const rooms = await chatApiService.getChatRooms();
      setChatRooms(rooms);
    } catch (error) {
      console.error('Error loading chat rooms:', error);
      toast.error('Failed to load chat rooms');
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (roomId: string) => {
    try {
      const roomMessages = await chatApiService.getRoomMessages(roomId);
      setMessages(roomMessages);
      
      // Join the room for real-time updates
      socketService.joinRoom(roomId, user.id);
      
      // Mark messages as read when doctor enters chat
      const unreadMessages = roomMessages.filter(msg => 
        msg.receiverId._id === user.id && !msg.isRead
      );
      for (const message of unreadMessages) {
        socketService.markAsRead({ messageId: message._id, userId: user.id });
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error('Failed to load messages');
    }
  };

  const handleInitiateCall = (type: 'audio' | 'video') => {
    if (!selectedRoom || !user) return;
    
    const otherParticipant = selectedRoom.participants.find(p => p._id !== user.id);
    if (!otherParticipant) return;
    
    // Initiate call via socket
    socketService.initiateCall({
      callerId: user.id,
      receiverId: otherParticipant._id,
      callType: type
    });
    
    toast.success(`Calling ${otherParticipant.name}...`);
  };

  const setupSocketListeners = () => {
    // Listen for new messages
    socketService.onNewMessage((message: ChatMessage) => {
      setMessages(prev => [...prev, message]);
      
      // Update chat rooms list with new message
      setChatRooms(prev => prev.map(room => 
        room._id === message.roomId 
          ? { ...room, lastMessage: message, lastActivity: new Date().toISOString() }
          : room
      ));
    });

    // Listen for incoming calls
    socketService.onIncomingCall((callData: any) => {
      const confirmCall = window.confirm(
        `Incoming ${callData.callType} call from ${callData.callerName}. Accept?`
      );
      
      if (confirmCall) {
        socketService.respondToCall({
          targetSocketId: callData.socketId,
          accepted: true,
          callData: { acceptedBy: user?.name }
        });
        // Redirect to call page or handle call UI
        toast.success('Call accepted');
      } else {
        socketService.respondToCall({
          targetSocketId: callData.socketId,
          accepted: false
        });
      }
    });
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedRoom || sending) return;

    const otherParticipant = selectedRoom.participants.find(p => p._id !== user?.id);
    if (!otherParticipant) return;

    try {
      setSending(true);
      // Send via socket for real-time delivery
      socketService.sendMessage({
        senderId: user.id,
        receiverId: otherParticipant._id,
        content: newMessage.trim(),
        type: 'text'
      });

      setNewMessage('');
      
      toast.success('Message sent successfully');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }
    
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-teal-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-4">📱 Chat Inbox</h1>
            <p className="text-gray-600">Communicate with your patients in real-time</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
            {/* Chat List */}
            <Card className="shadow-lg lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Patient Conversations
                </CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search conversations..."
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-[500px] overflow-y-auto">
                  {chatRooms.length > 0 ? (
                    chatRooms.map((room) => {
                      const otherParticipant = room.participants.find(p => p._id !== user?.id);
                      const unreadCount = room.unreadCount?.get?.(user?.id || '') || 0;
                      
                      return (
                        <div
                          key={room._id}
                          className={`p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors ${
                            selectedRoom?._id === room._id ? 'bg-blue-50 border-blue-200' : ''
                          }`}
                          onClick={() => setSelectedRoom(room)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium text-gray-900 truncate">
                                  {otherParticipant?.name || 'Unknown User'}
                                </h3>
                                <Badge variant="secondary" className="text-xs">
                                  {otherParticipant?.role || 'patient'}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 truncate">
                                {room.lastMessage?.content || 'No messages yet'}
                              </p>
                              <p className="text-xs text-gray-400">
                                {room.lastActivity ? formatDate(room.lastActivity) : ''}
                              </p>
                            </div>
                            {unreadCount > 0 && (
                              <Badge className="bg-red-500 text-white rounded-full">
                                {unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-8 text-center text-gray-500">
                      <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No conversations yet</p>
                      <p className="text-sm">Patients will appear here when they start a chat</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Chat Messages */}
            <Card className="shadow-lg lg:col-span-2">
              {selectedRoom ? (
                <>
                  <CardHeader className="border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div>
                          <h3 className="font-medium">
                            {selectedRoom.participants.find(p => p._id !== user?.id)?.name || 'Unknown User'}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {selectedRoom.participants.find(p => p._id !== user?.id)?.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-green-600 border-green-600 hover:bg-green-50"
                          onClick={() => handleInitiateCall('audio')}
                        >
                          <Phone className="w-4 h-4 mr-1" />
                          Audio Call
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-blue-600 border-blue-600 hover:bg-blue-50"
                          onClick={() => handleInitiateCall('video')}
                        >
                          <Video className="w-4 h-4 mr-1" />
                          Video Call
                        </Button>
                        <Button size="sm" variant="ghost">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-0">
                    {/* Messages */}
                    <div className="h-[400px] overflow-y-auto p-4 space-y-4">
                      {messages.length > 0 ? (
                        messages.map((message) => {
                          const isMyMessage = message.senderId._id === user?.id;
                          
                          return (
                            <div
                              key={message._id}
                              className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-[70%] p-3 rounded-lg ${
                                  isMyMessage
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-100 text-gray-900'
                                }`}
                              >
                                <p className="text-sm">{message.content}</p>
                                <div className="flex items-center justify-between mt-1">
                                  <p className={`text-xs ${isMyMessage ? 'text-blue-100' : 'text-gray-500'}`}>
                                    {formatTime(message.createdAt)}
                                  </p>
                                  {isMyMessage && (
                                    <div className="flex items-center gap-1 ml-2">
                                      {message.isEdited && (
                                        <span className="text-xs text-blue-100">edited</span>
                                      )}
                                      <button
                                        className="text-blue-100 hover:text-white"
                                        onClick={() => {
                                          // TODO: Implement edit message
                                          toast.info('Edit message feature coming soon');
                                        }}
                                      >
                                        <Edit className="w-3 h-3" />
                                      </button>
                                      <button
                                        className="text-blue-100 hover:text-white"
                                        onClick={() => {
                                          // TODO: Implement delete message
                                          toast.info('Delete message feature coming soon');
                                        }}
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center text-gray-500 py-8">
                          <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                          <p>No messages in this conversation</p>
                          <p className="text-sm">Start the conversation by sending a message below</p>
                        </div>
                      )}
                    </div>

                    {/* Message Input */}
                    <div className="border-t p-4">
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="Type your message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              sendMessage();
                            }
                          }}
                          className="flex-1"
                        />
                        <Button
                          onClick={sendMessage}
                          disabled={!newMessage.trim() || sending}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          {sending ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                          ) : (
                            <Send className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </>
              ) : (
                <CardContent className="flex items-center justify-center h-full">
                  <div className="text-center text-gray-500">
                    <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                    <p>Choose a patient from the list to start chatting</p>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DoctorChat;