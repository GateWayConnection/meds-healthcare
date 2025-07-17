
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { socketService } from '../services/socketService';
import { chatApiService } from '../services/chatApi';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Card, CardContent } from '../components/ui/card';
import { Phone, Video, Send } from 'lucide-react';
import { toast } from '../hooks/use-toast';

interface Message {
  _id: string;
  senderId: {
    _id: string;
    name: string;
  };
  receiverId: {
    _id: string;
    name: string;
  };
  content: string;
  createdAt: string;
  isRead: boolean;
}

interface CallState {
  isActive: boolean;
  isIncoming: boolean;
  isOutgoing: boolean;
  callerName: string;
  callType: 'audio' | 'video';
  status: 'calling' | 'connected' | 'ended' | 'declined';
}

const Chat: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [doctorInfo, setDoctorInfo] = useState<any>(null);
  const [callState, setCallState] = useState<CallState>({
    isActive: false,
    isIncoming: false,
    isOutgoing: false,
    callerName: '',
    callType: 'audio',
    status: 'ended'
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    loadChatData();
    setupSocketListeners();

    return () => {
      socketService.removeListener('new_message');
      socketService.removeListener('incoming_call');
      socketService.removeListener('call_response');
      socketService.removeListener('call_ended');
    };
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChatData = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      
      // Get chat rooms and find doctor
      const rooms = await chatApiService.getChatRooms();
      const doctorRoom = rooms.find(room => 
        room.participants.some(p => p.role === 'doctor')
      );

      if (doctorRoom) {
        const doctor = doctorRoom.participants.find(p => p.role === 'doctor');
        setDoctorInfo(doctor);

        // Load messages
        const roomMessages = await chatApiService.getMessages(doctorRoom._id);
        setMessages(roomMessages);

        // Mark messages as read
        const unreadMessages = roomMessages.filter(msg => 
          msg.senderId._id !== user.id && !msg.isRead
        );
        
        for (const msg of unreadMessages) {
          socketService.markAsRead({ messageId: msg._id, userId: user.id });
        }
      }
    } catch (error) {
      console.error('Error loading chat data:', error);
      toast({
        title: "Error",
        description: "Failed to load chat data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const setupSocketListeners = () => {
    if (!user) return;

    socketService.connect(user.id);

    socketService.onNewMessage((data: any) => {
      console.log('New message received:', data);
      setMessages(prev => [...prev, data.message]);
      
      // Mark as read if chat is open
      if (data.message.senderId._id !== user.id) {
        socketService.markAsRead({ 
          messageId: data.message._id, 
          userId: user.id 
        });
      }
    });

    socketService.onIncomingCall((callData: any) => {
      console.log('Incoming call:', callData);
      setCallState({
        isActive: true,
        isIncoming: true,
        isOutgoing: false,
        callerName: callData.callerName,
        callType: callData.callType,
        status: 'calling'
      });
    });

    socketService.onCallResponse((data: any) => {
      if (data.accepted) {
        setCallState(prev => ({ ...prev, status: 'connected' }));
        handleCallAccepted(data);
      } else {
        setCallState(prev => ({ ...prev, status: 'declined' }));
        toast({
          title: "Call Declined",
          description: "The call was declined",
          variant: "destructive"
        });
        setTimeout(() => {
          setCallState({
            isActive: false,
            isIncoming: false,
            isOutgoing: false,
            callerName: '',
            callType: 'audio',
            status: 'ended'
          });
        }, 2000);
      }
    });

    socketService.onCallEnded(() => {
      setCallState({
        isActive: false,
        isIncoming: false,
        isOutgoing: false,
        callerName: '',
        callType: 'audio',
        status: 'ended'
      });
      toast({
        title: "Call Ended",
        description: "The call has ended"
      });
    });
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !user || !doctorInfo) return;

    try {
      const messageData = {
        senderId: user.id,
        receiverId: doctorInfo._id,
        content: newMessage.trim(),
        type: 'text'
      };

      socketService.sendMessage(messageData);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
  };

  const initiateCall = (callType: 'audio' | 'video') => {
    if (!user || !doctorInfo) return;

    setCallState({
      isActive: true,
      isIncoming: false,
      isOutgoing: true,
      callerName: doctorInfo.name,
      callType,
      status: 'calling'
    });

    socketService.initiateCall({
      callerId: user.id,
      receiverId: doctorInfo._id,
      callType
    });
  };

  const handleCallAccepted = async (callData: any) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: callState.callType === 'video',
        audio: true
      });

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      toast({
        title: "Call Connected",
        description: "You are now connected"
      });
    } catch (error) {
      console.error('Error accessing media:', error);
      toast({
        title: "Media Error",
        description: "Could not access camera/microphone",
        variant: "destructive"
      });
    }
  };

  const endCall = () => {
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }

    socketService.endCall({ targetSocketId: doctorInfo?.socketId || '' });
    setCallState({
      isActive: false,
      isIncoming: false,
      isOutgoing: false,
      callerName: '',
      callType: 'audio',
      status: 'ended'
    });
  };

  const getMessageAlignment = (message: Message) => {
    return message.senderId._id === user?.id ? 'justify-end' : 'justify-start';
  };

  const getMessageStyle = (message: Message) => {
    const isSent = message.senderId._id === user?.id;
    return isSent 
      ? 'bg-blue-500 text-white ml-12' 
      : 'bg-gray-200 text-gray-800 mr-12';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading chat...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarFallback>
              {doctorInfo?.name?.charAt(0) || 'D'}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold">{doctorInfo?.name || 'Doctor'}</h2>
            <p className="text-sm text-gray-500">Online</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => initiateCall('audio')}
            disabled={callState.isActive}
          >
            <Phone className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => initiateCall('video')}
            disabled={callState.isActive}
          >
            <Video className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Call Interface */}
      {callState.isActive && (
        <Card className="m-4 border-2 border-blue-500">
          <CardContent className="p-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">
                {callState.status === 'calling' && callState.isOutgoing && 'Calling...'}
                {callState.status === 'calling' && callState.isIncoming && 'Incoming Call'}
                {callState.status === 'connected' && 'Connected'}
                {callState.status === 'declined' && 'Call Declined'}
              </h3>
              
              {callState.callType === 'video' && callState.status === 'connected' && (
                <div className="flex space-x-4 mb-4">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    className="w-32 h-24 bg-gray-200 rounded"
                  />
                  <video
                    ref={remoteVideoRef}
                    autoPlay
                    className="w-32 h-24 bg-gray-200 rounded"
                  />
                </div>
              )}
              
              <div className="flex justify-center space-x-2">
                {callState.status === 'calling' && (
                  <Button variant="destructive" onClick={endCall}>
                    End Call
                  </Button>
                )}
                {callState.status === 'connected' && (
                  <Button variant="destructive" onClick={endCall}>
                    End Call
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message._id} className={`flex ${getMessageAlignment(message)}`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${getMessageStyle(message)}`}>
              <p className="text-sm">{message.content}</p>
              <p className="text-xs opacity-70 mt-1">
                {new Date(message.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                sendMessage();
              }
            }}
            className="flex-1"
          />
          <Button onClick={sendMessage} disabled={!newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
