import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, Edit2, Trash2, MoreVertical, Phone, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { useDoctors } from '../hooks/useDoctors';
import { socketService } from '../services/socketService';
import { chatApiService, ChatMessage, ChatRoom } from '../services/chatApi';

const Chat = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { doctors, fetchDoctors } = useDoctors();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [isOnline, setIsOnline] = useState(false);
  const [room, setRoom] = useState<ChatRoom | null>(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const doctorId = searchParams.get('doctor');
  const doctor = doctors.find(d => d._id === doctorId);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!doctorId) {
      toast.error('No doctor specified');
      navigate('/find-doctor');
      return;
    }
    // Initialize socket connection
    initializeChat();
    
    // Fetch doctors if not already loaded
    if (doctors.length === 0) {
      fetchDoctors();
    }

    return () => {
      // Cleanup socket listeners
      socketService.removeListener('new_message');
      socketService.removeListener('message_edited');
      socketService.removeListener('message_deleted');
      socketService.removeListener('user_online');
      socketService.removeListener('user_offline');
    };
  }, [user, doctorId, navigate, doctors.length, fetchDoctors]);

  const initializeChat = async () => {
    if (!user || !doctorId) return;

    try {
      setLoading(true);
      
      // Connect to socket
      await socketService.connect(user.id);
      
      // Create or get chat room
      const chatRoom = await chatApiService.createChatRoom(doctorId);
      setRoom(chatRoom);
      
      // Join the room
      socketService.joinRoom(chatRoom._id, user.id);
      
      // Load existing messages
      const roomMessages = await chatApiService.getRoomMessages(chatRoom._id);
      setMessages(roomMessages);
      
      // Mark messages as read when entering chat
      const unreadMessages = roomMessages.filter(msg => 
        msg.receiverId._id === user.id && !msg.isRead
      );
      for (const message of unreadMessages) {
        socketService.markAsRead({ messageId: message._id, userId: user.id });
      }
      
      // Set up socket listeners
      setupSocketListeners();
      
      setLoading(false);
    } catch (error) {
      console.error('Error initializing chat:', error);
      toast.error('Failed to initialize chat');
      setLoading(false);
    }
  };

  const setupSocketListeners = () => {
    // Listen for new messages
    socketService.onNewMessage((message: ChatMessage) => {
      setMessages(prev => [...prev, message]);
    });

    // Listen for edited messages
    socketService.onMessageEdited((editedMessage: ChatMessage) => {
      setMessages(prev => prev.map(msg => 
        msg._id === editedMessage._id ? editedMessage : msg
      ));
    });

    // Listen for deleted messages
    socketService.onMessageDeleted(({ messageId }: { messageId: string }) => {
      setMessages(prev => prev.filter(msg => msg._id !== messageId));
    });

    // Listen for user online/offline status
    socketService.onUserOnline(({ userId }: { userId: string }) => {
      if (userId === doctorId) {
        setIsOnline(true);
      }
    });

    socketService.onUserOffline(({ userId }: { userId: string }) => {
      if (userId === doctorId) {
        setIsOnline(false);
      }
    });

    // Listen for incoming calls
    socketService.onIncomingCall((callData: any) => {
      const confirmCall = window.confirm(
        `Incoming ${callData.callType} call from Dr. ${callData.callerName}. Accept?`
      );
      
      if (confirmCall) {
        socketService.respondToCall({
          targetSocketId: callData.socketId,
          accepted: true,
          callData: { acceptedBy: user?.name }
        });
        toast.success('Call accepted');
      } else {
        socketService.respondToCall({
          targetSocketId: callData.socketId,
          accepted: false
        });
      }
    });
  };

  useEffect(() => {
    // Check if doctor exists after doctors are loaded
    if (doctorId && doctors.length > 0 && !doctor) {
      toast.error('Doctor not found');
      navigate('/find-doctor');
      return;
    }
  }, [doctorId, doctors, doctor, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !user || !doctorId) return;

    // Send message via socket
    socketService.sendMessage({
      senderId: user.id,
      receiverId: doctorId,
      content: newMessage.trim(),
      type: 'text'
    });

    setNewMessage('');
  };

  const handleEditMessage = (messageId: string) => {
    const message = messages.find(m => m._id === messageId);
    if (message && message.senderId._id === user?.id) {
      setEditingMessageId(messageId);
      setEditingContent(message.content);
    }
  };

  const handleSaveEdit = () => {
    if (!editingContent.trim() || !editingMessageId || !user) return;

    // Send edit via socket
    socketService.editMessage({
      messageId: editingMessageId,
      content: editingContent.trim(),
      userId: user.id
    });

    setEditingMessageId(null);
    setEditingContent('');
  };

  const handleDeleteMessage = (messageId: string) => {
    if (!user) return;
    
    // Send delete via socket
    socketService.deleteMessage({
      messageId,
      userId: user.id
    });
    
    toast.success('Message deleted');
  };

  const handleStartCall = (type: 'audio' | 'video') => {
    if (!user || !doctorId) return;
    
    // Check if doctor is online first
    if (!isOnline) {
      toast.error('Doctor is currently offline');
      return;
    }
    
    // Initiate call via socket
    socketService.initiateCall({
      callerId: user.id,
      receiverId: doctorId,
      callType: type
    });
    
    toast.success(`Calling ${doctor?.name}...`);
  };

  if (loading || !doctor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/find-doctor')}
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={doctor.image || '/placeholder.svg'}
                    alt={doctor.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  {isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div>
                  <h1 className="font-semibold text-gray-900">{doctor.name}</h1>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">{doctor.specialty}</Badge>
                    <span className="text-xs text-gray-500">
                      {isOnline ? 'Online' : 'Last seen recently'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStartCall('audio')}
              >
                <Phone className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStartCall('video')}
              >
                <Video className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message) => (
            <motion.div
              key={message._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.senderId._id === user?.id ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.senderId._id === user?.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border shadow-sm'
              }`}>
                {editingMessageId === message._id ? (
                  <div className="space-y-2">
                    <Input
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.target.value)}
                      className="text-sm"
                      onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSaveEdit}>Save</Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingMessageId(null)}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm">{message.content}</p>
                      {message.senderId._id === user?.id && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <MoreVertical className="w-3 h-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handleEditMessage(message._id)}>
                              <Edit2 className="w-3 h-3 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteMessage(message._id)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-3 h-3 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs ${
                        message.senderId._id === user?.id ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {message.isEdited && (
                        <span className={`text-xs ${
                          message.senderId._id === user?.id ? 'text-blue-100' : 'text-gray-400'
                        }`}>
                          (edited)
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-white border-t">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex gap-2">
            <Input
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;