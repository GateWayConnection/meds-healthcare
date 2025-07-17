
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { socketService } from '../services/socketService';
import { chatApiService, ChatMessage, ChatRoom } from '../services/chatApi';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Send, Phone, Video, MessageCircle, Users } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface CallState {
  isInCall: boolean;
  isIncoming: boolean;
  isOutgoing: boolean;
  callType: 'audio' | 'video' | null;
  callerName: string;
  callerId: string;
  receiverId: string;
}

const Chat = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [callState, setCallState] = useState<CallState>({
    isInCall: false,
    isIncoming: false,
    isOutgoing: false,
    callType: null,
    callerName: '',
    callerId: '',
    receiverId: ''
  });

  // Initialize socket connection and load data
  useEffect(() => {
    if (!user) return;

    const initializeChat = async () => {
      try {
        console.log('🔄 Initializing chat for user:', user.id);
        
        // Connect to socket
        await socketService.connect(user.id);
        console.log('✅ Socket connected');
        
        // Load chat rooms
        await loadChatRooms();
        
        // Load available users
        await loadAvailableUsers();
        
        setIsLoading(false);
      } catch (error) {
        console.error('❌ Error initializing chat:', error);
        toast({
          title: "Error",
          description: "Failed to initialize chat system",
          variant: "destructive"
        });
        setIsLoading(false);
      }
    };

    initializeChat();

    // Socket event listeners
    socketService.onNewMessage(handleNewMessage);
    socketService.onMessageRead(handleMessageRead);
    socketService.onIncomingCall(handleIncomingCall);
    socketService.onCallResponse(handleCallResponse);
    socketService.onCallEnded(handleCallEnded);

    return () => {
      socketService.removeListener('new_message');
      socketService.removeListener('message_read');
      socketService.removeListener('incoming_call');
      socketService.removeListener('call_response');
      socketService.removeListener('call_ended');
    };
  }, [user]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatRooms = async () => {
    try {
      console.log('📂 Loading chat rooms...');
      const rooms = await chatApiService.getChatRooms();
      console.log('📂 Loaded rooms:', rooms.length);
      setChatRooms(rooms);
    } catch (error) {
      console.error('❌ Error loading chat rooms:', error);
    }
  };

  const loadAvailableUsers = async () => {
    try {
      // This would typically come from your API
      const users: User[] = []; // Replace with actual API call
      setAvailableUsers(users);
    } catch (error) {
      console.error('❌ Error loading users:', error);
    }
  };

  const loadMessages = async (roomId: string) => {
    try {
      console.log('💬 Loading messages for room:', roomId);
      const roomMessages = await chatApiService.getRoomMessages(roomId);
      console.log('💬 Loaded messages:', roomMessages.length);
      setMessages(roomMessages);
      
      // Mark messages as read
      const unreadMessages = roomMessages.filter(msg => 
        !msg.isRead && msg.receiverId._id === user?.id
      );
      
      for (const msg of unreadMessages) {
        try {
          await chatApiService.markMessageAsRead(msg._id);
          socketService.markAsRead({ messageId: msg._id, userId: user!.id });
        } catch (error) {
          console.error('❌ Error marking message as read:', error);
        }
      }
    } catch (error) {
      console.error('❌ Error loading messages:', error);
    }
  };

  const handleRoomSelect = async (room: ChatRoom) => {
    console.log('🏠 Selecting room:', room._id);
    setSelectedRoom(room);
    await loadMessages(room._id);
    
    // Join the socket room
    if (user) {
      socketService.joinRoom(room._id, user.id);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedRoom || !user) return;

    try {
      console.log('📤 Sending message:', newMessage);
      
      const otherParticipant = selectedRoom.participants.find(p => p._id !== user.id);
      if (!otherParticipant) return;

      // Send via API first
      const savedMessage = await chatApiService.sendMessage({
        receiverId: otherParticipant._id,
        content: newMessage.trim(),
        type: 'text'
      });

      // Send via socket for real-time updates
      socketService.sendMessage({
        senderId: user.id,
        receiverId: otherParticipant._id,
        content: newMessage.trim(),
        type: 'text'
      });

      // Add message to local state immediately for better UX
      const newMsg: ChatMessage = {
        ...savedMessage,
        senderId: {
          _id: user.id,
          name: user.name || user.email,
          email: user.email,
          role: user.role
        },
        receiverId: otherParticipant
      };

      setMessages(prev => [...prev, newMsg]);
      setNewMessage('');
      
      console.log('✅ Message sent successfully');
    } catch (error) {
      console.error('❌ Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
  };

  const handleNewMessage = (data: { message: ChatMessage; roomId: string }) => {
    console.log('📨 Received new message:', data);
    
    if (selectedRoom && data.roomId === selectedRoom._id) {
      setMessages(prev => {
        // Check if message already exists to avoid duplicates
        const exists = prev.some(msg => msg._id === data.message._id);
        if (exists) return prev;
        
        return [...prev, data.message];
      });
    }
    
    // Refresh chat rooms to update last message
    loadChatRooms();
  };

  const handleMessageRead = (data: { messageId: string }) => {
    setMessages(prev => 
      prev.map(msg => 
        msg._id === data.messageId 
          ? { ...msg, isRead: true }
          : msg
      )
    );
  };

  const handleIncomingCall = (callData: any) => {
    console.log('📞 Incoming call:', callData);
    
    setCallState({
      isInCall: false,
      isIncoming: true,
      isOutgoing: false,
      callType: callData.callType,
      callerName: callData.callerName || 'Unknown',
      callerId: callData.callerId,
      receiverId: user?.id || ''
    });

    // Play ringing sound (optional)
    // You can add audio element for ringing sound here
    
    toast({
      title: `Incoming ${callData.callType} call`,
      description: `${callData.callerName || 'Someone'} is calling you`,
      duration: 10000
    });
  };

  const handleCallResponse = (data: any) => {
    if (data.accepted) {
      setCallState(prev => ({
        ...prev,
        isInCall: true,
        isIncoming: false,
        isOutgoing: false
      }));
      
      toast({
        title: "Call Connected",
        description: "You are now connected to the call"
      });
    } else {
      setCallState({
        isInCall: false,
        isIncoming: false,
        isOutgoing: false,
        callType: null,
        callerName: '',
        callerId: '',
        receiverId: ''
      });
      
      toast({
        title: "Call Declined",
        description: "The call was declined"
      });
    }
  };

  const handleCallEnded = () => {
    setCallState({
      isInCall: false,
      isIncoming: false,
      isOutgoing: false,
      callType: null,
      callerName: '',
      callerId: '',
      receiverId: ''
    });
    
    toast({
      title: "Call Ended",
      description: "The call has been ended"
    });
  };

  const initiateCall = (callType: 'audio' | 'video') => {
    if (!selectedRoom || !user) return;
    
    const otherParticipant = selectedRoom.participants.find(p => p._id !== user.id);
    if (!otherParticipant) return;

    console.log('📞 Initiating call:', callType);
    
    setCallState({
      isInCall: false,
      isIncoming: false,
      isOutgoing: true,
      callType,
      callerName: otherParticipant.name,
      callerId: user.id,
      receiverId: otherParticipant._id
    });

    socketService.initiateCall({
      callerId: user.id,
      receiverId: otherParticipant._id,
      callType
    });

    toast({
      title: "Calling...",
      description: `Calling ${otherParticipant.name}`
    });
  };

  const acceptCall = () => {
    socketService.respondToCall({
      targetSocketId: callState.callerId,
      accepted: true,
      callData: callState
    });
  };

  const declineCall = () => {
    socketService.respondToCall({
      targetSocketId: callState.callerId,
      accepted: false
    });
    
    setCallState({
      isInCall: false,
      isIncoming: false,
      isOutgoing: false,
      callType: null,
      callerName: '',
      callerId: '',
      receiverId: ''
    });
  };

  const endCall = () => {
    const targetId = callState.isOutgoing ? callState.receiverId : callState.callerId;
    socketService.endCall({ targetSocketId: targetId });
    
    setCallState({
      isInCall: false,
      isIncoming: false,
      isOutgoing: false,
      callType: null,
      callerName: '',
      callerId: '',
      receiverId: ''
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Incoming Call Modal */}
      {callState.isIncoming && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-96">
            <CardHeader className="text-center">
              <CardTitle>Incoming {callState.callType} Call</CardTitle>
              <p className="text-lg font-medium">{callState.callerName}</p>
            </CardHeader>
            <CardContent className="flex gap-4 justify-center">
              <Button onClick={acceptCall} className="bg-green-500 hover:bg-green-600">
                Accept
              </Button>
              <Button onClick={declineCall} variant="destructive">
                Decline
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Chat Rooms Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Chats
          </h2>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {chatRooms.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No conversations yet</p>
            </div>
          ) : (
            chatRooms.map((room) => {
              const otherParticipant = room.participants.find(p => p._id !== user?.id);
              const unreadCount = room.unreadCount?.get?.(user?.id || '') || 0;
              
              return (
                <div
                  key={room._id}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                    selectedRoom?._id === room._id ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                  onClick={() => handleRoomSelect(room)}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src="" />
                      <AvatarFallback>
                        {otherParticipant?.name?.charAt(0) || '?'}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-900 truncate">
                          {otherParticipant?.name || 'Unknown User'}
                        </p>
                        {unreadCount > 0 && (
                          <Badge variant="destructive" className="ml-2">
                            {unreadCount}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 capitalize">
                        {otherParticipant?.role || 'User'}
                      </p>
                      {room.lastMessage && (
                        <p className="text-sm text-gray-600 truncate mt-1">
                          Last message...
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedRoom ? (
          <>
            {/* Chat Header */}
            <div className="p-4 bg-white border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="" />
                  <AvatarFallback>
                    {selectedRoom.participants.find(p => p._id !== user?.id)?.name?.charAt(0) || '?'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">
                    {selectedRoom.participants.find(p => p._id !== user?.id)?.name || 'Unknown User'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {selectedRoom.participants.find(p => p._id !== user?.id)?.role || 'User'}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => initiateCall('audio')}
                  disabled={callState.isInCall || callState.isOutgoing}
                >
                  <Phone className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => initiateCall('video')}
                  disabled={callState.isInCall || callState.isOutgoing}
                >
                  <Video className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Call Status */}
            {(callState.isOutgoing || callState.isInCall) && (
              <div className="p-3 bg-blue-50 border-b border-blue-200 text-center">
                {callState.isOutgoing && (
                  <p className="text-blue-700">Calling {callState.callerName}...</p>
                )}
                {callState.isInCall && (
                  <div className="flex items-center justify-center gap-4">
                    <p className="text-blue-700">Connected to {callState.callerName}</p>
                    <Button size="sm" variant="destructive" onClick={endCall}>
                      End Call
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => {
                const isOwnMessage = message.senderId._id === user?.id;
                
                return (
                  <div
                    key={message._id}
                    className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        isOwnMessage
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-900'
                      }`}
                    >
                      <p>{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                        }`}
                      >
                        {new Date(message.createdAt).toLocaleTimeString()}
                        {isOwnMessage && message.isRead && (
                          <span className="ml-1">✓✓</span>
                        )}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No chat selected</h3>
              <p className="text-gray-500">Choose a conversation from the sidebar to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
