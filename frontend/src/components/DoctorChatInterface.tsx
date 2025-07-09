
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle, Send, Phone, Video, Edit, Trash2 } from 'lucide-react';
import { socketService } from '../services/socketService';
import { chatApiService, ChatRoom, ChatMessage } from '../services/chatApi';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

interface DoctorChatInterfaceProps {
  onStartCall?: (receiverId: string, type: 'audio' | 'video') => void;
}

const DoctorChatInterface: React.FC<DoctorChatInterfaceProps> = ({ onStartCall }) => {
  const { user } = useAuth();
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize socket connection
  useEffect(() => {
    if (user?.id) {
      socketService.connect(user.id).catch(console.error);
      
      // Set up socket event listeners
      socketService.onNewMessage(handleNewMessage);
      socketService.onMessageEdited(handleMessageEdited);
      socketService.onMessageDeleted(handleMessageDeleted);
      socketService.onMessageNotification(handleMessageNotification);
      
      return () => {
        socketService.removeListener('new_message');
        socketService.removeListener('message_edited');
        socketService.removeListener('message_deleted');
        socketService.removeListener('message_notification');
      };
    }
  }, [user?.id]);

  // Load chat rooms
  useEffect(() => {
    loadChatRooms();
  }, []);

  // Load messages when room is selected
  useEffect(() => {
    if (selectedRoom) {
      loadMessages(selectedRoom._id);
      socketService.joinRoom(selectedRoom._id, user?.id || '');
    }
  }, [selectedRoom, user?.id]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error('Failed to load messages');
    }
  };

  const handleNewMessage = (message: ChatMessage) => {
    setMessages(prev => [...prev, message]);
    
    // Update chat rooms with new last message
    setChatRooms(prev => prev.map(room => {
      if (room._id === message.roomId) {
        return { ...room, lastMessage: message, lastActivity: message.createdAt };
      }
      return room;
    }));
  };

  const handleMessageEdited = (editedMessage: ChatMessage) => {
    setMessages(prev => prev.map(msg => 
      msg._id === editedMessage._id ? editedMessage : msg
    ));
  };

  const handleMessageDeleted = (data: { messageId: string }) => {
    setMessages(prev => prev.filter(msg => msg._id !== data.messageId));
  };

  const handleMessageNotification = (data: any) => {
    toast.info(`New message from ${data.senderName}`, {
      action: {
        label: 'View',
        onClick: () => {
          const room = chatRooms.find(r => r._id === data.roomId);
          if (room) setSelectedRoom(room);
        }
      }
    });
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedRoom) return;
    
    const receiverId = selectedRoom.participants.find(p => p._id !== user?.id)?._id;
    if (!receiverId) return;

    try {
      const messageData = {
        receiverId,
        content: newMessage.trim(),
        type: 'text' as const
      };

      socketService.sendMessage({
        senderId: user?.id || '',
        ...messageData
      });

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const startEdit = (message: ChatMessage) => {
    setEditingMessage(message._id);
    setEditContent(message.content);
  };

  const saveEdit = async () => {
    if (!editingMessage || !editContent.trim()) return;

    try {
      socketService.editMessage({
        messageId: editingMessage,
        content: editContent.trim(),
        userId: user?.id || ''
      });

      setEditingMessage(null);
      setEditContent('');
    } catch (error) {
      console.error('Error editing message:', error);
      toast.error('Failed to edit message');
    }
  };

  const deleteMessage = async (messageId: string) => {
    try {
      socketService.deleteMessage({
        messageId,
        userId: user?.id || ''
      });
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Failed to delete message');
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPatientFromRoom = (room: ChatRoom) => {
    return room.participants.find(p => p.role === 'patient');
  };

  return (
    <div className="flex h-[600px] bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Chat Rooms Sidebar */}
      <div className="w-1/3 border-r bg-gray-50">
        <div className="p-4 border-b bg-white">
          <h3 className="font-semibold flex items-center">
            <MessageCircle className="w-5 h-5 mr-2 text-rose-600" />
            Patient Messages
          </h3>
        </div>
        <ScrollArea className="h-full">
          {loading ? (
            <div className="p-4 text-center text-gray-500">Loading...</div>
          ) : chatRooms.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No messages yet</div>
          ) : (
            chatRooms.map((room) => {
              const patient = getPatientFromRoom(room);
              return (
                <div
                  key={room._id}
                  onClick={() => setSelectedRoom(room)}
                  className={`p-4 border-b cursor-pointer hover:bg-white transition-colors ${
                    selectedRoom?._id === room._id ? 'bg-white border-l-4 border-l-rose-600' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <Avatar>
                      <AvatarFallback className="bg-rose-100 text-rose-600">
                        {patient?.name?.charAt(0) || 'P'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm truncate">
                          {patient?.name || 'Patient'}
                        </p>
                        {room.lastMessage && (
                          <span className="text-xs text-gray-500">
                            {formatTime(room.lastActivity)}
                          </span>
                        )}
                      </div>
                      {room.lastMessage && (
                        <p className="text-sm text-gray-600 truncate">
                          {room.lastMessage.content}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedRoom ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b bg-white flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarFallback className="bg-rose-100 text-rose-600">
                    {getPatientFromRoom(selectedRoom)?.name?.charAt(0) || 'P'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">
                    {getPatientFromRoom(selectedRoom)?.name || 'Patient'}
                  </h4>
                  <Badge variant="secondary" className="text-xs">
                    {getPatientFromRoom(selectedRoom)?.role || 'patient'}
                  </Badge>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const patientId = getPatientFromRoom(selectedRoom)?._id;
                    if (patientId && onStartCall) {
                      onStartCall(patientId, 'audio');
                    }
                  }}
                >
                  <Phone className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const patientId = getPatientFromRoom(selectedRoom)?._id;
                    if (patientId && onStartCall) {
                      onStartCall(patientId, 'video');
                    }
                  }}
                >
                  <Video className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => {
                  const isMyMessage = message.senderId._id === user?.id;
                  
                  return (
                    <div
                      key={message._id}
                      className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          isMyMessage
                            ? 'bg-rose-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        {editingMessage === message._id ? (
                          <div className="space-y-2">
                            <Input
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              className="text-sm"
                            />
                            <div className="flex space-x-2">
                              <Button size="sm" onClick={saveEdit}>Save</Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingMessage(null)}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="text-sm">{message.content}</p>
                            <div className="flex items-center justify-between mt-1">
                              <span className={`text-xs ${isMyMessage ? 'text-rose-100' : 'text-gray-500'}`}>
                                {formatTime(message.createdAt)}
                                {message.isEdited && ' (edited)'}
                              </span>
                              {isMyMessage && (
                                <div className="flex space-x-1 ml-2">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 w-6 p-0 text-rose-100 hover:text-white"
                                    onClick={() => startEdit(message)}
                                  >
                                    <Edit className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 w-6 p-0 text-rose-100 hover:text-white"
                                    onClick={() => deleteMessage(message._id)}
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t bg-white">
              <div className="flex space-x-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your response..."
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <Button onClick={sendMessage} className="bg-rose-600 hover:bg-rose-700">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Select a patient to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorChatInterface;
