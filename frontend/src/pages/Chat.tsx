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

interface Message {
  _id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  isEdited?: boolean;
}

const Chat = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { doctors, fetchDoctors } = useDoctors();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [isOnline, setIsOnline] = useState(true);
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
    // Fetch doctors if not already loaded
    if (doctors.length === 0) {
      fetchDoctors();
    }
  }, [user, doctorId, navigate, doctors.length, fetchDoctors]);

  useEffect(() => {
    // Check if doctor exists after doctors are loaded
    if (doctorId && doctors.length > 0 && !doctor) {
      toast.error('Doctor not found');
      navigate('/find-doctor');
      return;
    }
  }, [doctorId, doctors, doctor, navigate]);

  useEffect(() => {
    // Simulate loading messages from database
    const mockMessages: Message[] = [
      {
        _id: '1',
        senderId: doctorId || '',
        senderName: doctor?.name || 'Doctor',
        content: 'Hello! How can I help you today?',
        timestamp: new Date(Date.now() - 300000),
      },
      {
        _id: '2',
        senderId: user?.id || '',
        senderName: 'You',
        content: 'Hi Doctor, I have been experiencing some headaches lately.',
        timestamp: new Date(Date.now() - 240000),
      },
    ];
    setMessages(mockMessages);
  }, [doctorId, doctor, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Simulate online status changes
  useEffect(() => {
    const interval = setInterval(() => {
      setIsOnline(Math.random() > 0.3);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !user) return;

    const message: Message = {
      _id: Date.now().toString(),
      senderId: user.id,
      senderName: 'You',
      content: newMessage.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate doctor response after 2 seconds
    setTimeout(() => {
      const doctorResponse: Message = {
        _id: (Date.now() + 1).toString(),
        senderId: doctorId || '',
        senderName: doctor?.name || 'Doctor',
        content: 'Thank you for sharing that. Can you tell me more about when these headaches occur?',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, doctorResponse]);
    }, 2000);
  };

  const handleEditMessage = (messageId: string) => {
    const message = messages.find(m => m._id === messageId);
    if (message && message.senderId === user?.id) {
      setEditingMessageId(messageId);
      setEditingContent(message.content);
    }
  };

  const handleSaveEdit = () => {
    if (!editingContent.trim()) return;

    setMessages(prev => prev.map(message => 
      message._id === editingMessageId 
        ? { ...message, content: editingContent.trim(), isEdited: true }
        : message
    ));
    setEditingMessageId(null);
    setEditingContent('');
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages(prev => prev.filter(m => m._id !== messageId));
    toast.success('Message deleted');
  };

  const handleStartCall = (type: 'audio' | 'video') => {
    navigate(`/call?doctor=${doctorId}&type=${type}`);
  };

  if (!doctor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
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
              className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.senderId === user?.id
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
                      {message.senderId === user?.id && (
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
                        message.senderId === user?.id ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {message.isEdited && (
                        <span className={`text-xs ${
                          message.senderId === user?.id ? 'text-blue-100' : 'text-gray-400'
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