
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { socketService } from '../../services/socketService';
import { chatApiService } from '../../services/chatApi';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Card, CardContent } from '../../components/ui/card';
import { 
  Phone, 
  Video, 
  Send, 
  PhoneCall, 
  VideoIcon,
  Check,
  X
} from 'lucide-react';
import { toast } from '../../hooks/use-toast';

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

interface Patient {
  _id: string;
  name: string;
  email: string;
}

interface CallState {
  isActive: boolean;
  isIncoming: boolean;
  isOutgoing: boolean;
  callerName: string;
  callerId: string;
  callType: 'audio' | 'video';
  status: 'calling' | 'connected' | 'ended' | 'declined';
  targetSocketId?: string;
}

const DoctorChat: React.FC = () => {
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [callState, setCallState] = useState<CallState>({
    isActive: false,
    isIncoming: false,
    isOutgoing: false,
    callerName: '',
    callerId: '',
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
    loadPatients();
    setupSocketListeners();

    return () => {
      socketService.removeListener('new_message');
      socketService.removeListener('incoming_call');
      socketService.removeListener('call_response');
      socketService.removeListener('call_ended');
    };
  }, [user]);

  useEffect(() => {
    if (selectedPatient) {
      loadMessages();
    }
  }, [selectedPatient]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadPatients = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const rooms = await chatApiService.getChatRooms();
      
      const patientList = rooms.map(room => {
        const patient = room.participants.find(p => p.role === 'patient');
        return patient;
      }).filter(Boolean);

      setPatients(patientList);
      
      if (patientList.length > 0 && !selectedPatient) {
        setSelectedPatient(patientList[0]);
      }
    } catch (error) {
      console.error('Error loading patients:', error);
      toast({
        title: "Error",
        description: "Failed to load patients",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async () => {
    if (!selectedPatient || !user) return;

    try {
      const rooms = await chatApiService.getChatRooms();
      const room = rooms.find(r => 
        r.participants.some(p => p._id === selectedPatient._id)
      );

      if (room) {
        const roomMessages = await chatApiService.getMessages(room._id);
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
      console.error('Error loading messages:', error);
    }
  };

  const setupSocketListeners = () => {
    if (!user) return;

    socketService.connect(user.id);

    socketService.onNewMessage((data: any) => {
      console.log('New message received:', data);
      setMessages(prev => [...prev, data.message]);
      
      // Mark as read if chat is open with this patient
      if (data.message.senderId._id !== user.id && 
          selectedPatient && 
          data.message.senderId._id === selectedPatient._id) {
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
        callerId: callData.callerId,
        callType: callData.callType,
        status: 'calling',
        targetSocketId: callData.callerSocketId
      });

      // Show incoming call popup with sound
      toast({
        title: "Incoming Call",
        description: `${callData.callerName} is calling you`,
        duration: 10000,
      });
    });

    socketService.onCallResponse((data: any) => {
      if (data.accepted) {
        setCallState(prev => ({ ...prev, status: 'connected' }));
        handleCallAccepted(data);
      } else {
        setCallState(prev => ({ ...prev, status: 'declined' }));
        setTimeout(() => {
          setCallState({
            isActive: false,
            isIncoming: false,
            isOutgoing: false,
            callerName: '',
            callerId: '',
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
        callerId: '',
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
    if (!newMessage.trim() || !user || !selectedPatient) return;

    try {
      const messageData = {
        senderId: user.id,
        receiverId: selectedPatient._id,
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

  const acceptCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: callState.callType === 'video',
        audio: true
      });

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      socketService.respondToCall({
        targetSocketId: callState.targetSocketId!,
        accepted: true,
        callData: { stream }
      });

      setCallState(prev => ({ ...prev, status: 'connected' }));
      
      toast({
        title: "Call Accepted",
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

  const declineCall = () => {
    socketService.respondToCall({
      targetSocketId: callState.targetSocketId!,
      accepted: false
    });

    setCallState({
      isActive: false,
      isIncoming: false,
      isOutgoing: false,
      callerName: '',
      callerId: '',
      callType: 'audio',
      status: 'ended'
    });
  };

  const endCall = () => {
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }

    if (callState.targetSocketId) {
      socketService.endCall({ targetSocketId: callState.targetSocketId });
    }
    
    setCallState({
      isActive: false,
      isIncoming: false,
      isOutgoing: false,
      callerName: '',
      callerId: '',
      callType: 'audio',
      status: 'ended'
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
    } catch (error) {
      console.error('Error accessing media:', error);
    }
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
    <div className="flex h-screen">
      {/* Incoming Call Popup */}
      {callState.isIncoming && callState.status === 'calling' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-96">
            <CardContent className="p-6 text-center">
              <div className="mb-4">
                {callState.callType === 'video' ? (
                  <VideoIcon className="h-16 w-16 mx-auto text-green-500" />
                ) : (
                  <PhoneCall className="h-16 w-16 mx-auto text-green-500 animate-pulse" />
                )}
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Incoming {callState.callType} call
              </h3>
              <p className="text-gray-600 mb-6">{callState.callerName}</p>
              <div className="flex space-x-4 justify-center">
                <Button
                  onClick={acceptCall}
                  className="bg-green-500 hover:bg-green-600"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Accept
                </Button>
                <Button
                  onClick={declineCall}
                  variant="destructive"
                >
                  <X className="h-4 w-4 mr-2" />
                  Decline
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Patient List Sidebar */}
      <div className="w-1/3 bg-gray-50 border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Patients</h2>
        </div>
        <div className="overflow-y-auto">
          {patients.map((patient) => (
            <div
              key={patient._id}
              onClick={() => setSelectedPatient(patient)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-100 ${
                selectedPatient?._id === patient._id ? 'bg-blue-50 border-blue-200' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarFallback>
                    {patient.name?.charAt(0) || 'P'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{patient.name}</h3>
                  <p className="text-sm text-gray-500">{patient.email}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedPatient ? (
          <>
            {/* Header */}
            <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarFallback>
                    {selectedPatient.name?.charAt(0) || 'P'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold">{selectedPatient.name}</h2>
                  <p className="text-sm text-gray-500">Online</p>
                </div>
              </div>
            </div>

            {/* Call Interface */}
            {callState.isActive && callState.status !== 'calling' && (
              <Card className="m-4 border-2 border-blue-500">
                <CardContent className="p-4">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">
                      {callState.status === 'connected' && 'Connected'}
                      {callState.status === 'declined' && 'Call Declined'}
                    </h3>
                    
                    {callState.callType === 'video' && callState.status === 'connected' && (
                      <div className="flex space-x-4 mb-4 justify-center">
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
                    
                    {callState.status === 'connected' && (
                      <Button variant="destructive" onClick={endCall}>
                        End Call
                      </Button>
                    )}
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
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Select a patient to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorChat;
