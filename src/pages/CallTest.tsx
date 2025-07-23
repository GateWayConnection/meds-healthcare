import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IncomingCallModal } from '@/components/IncomingCallModal';
import MissedCallNotification from '@/components/MissedCallNotification';
import CallInterface from '@/components/CallInterface';
import { useWebRTC } from '@/hooks/useWebRTC';
import { socketService } from '@/services/socketService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Phone, Video } from 'lucide-react';

const CallTest = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Call state
  const [showIncomingCall, setShowIncomingCall] = useState(false);
  const [showMissedCall, setShowMissedCall] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const [callType, setCallType] = useState<'audio' | 'video'>('audio');
  const [caller, setCaller] = useState({ name: 'Test User', id: 'test123' });

  // WebRTC hook
  const {
    localStream,
    remoteStream,
    isConnecting,
    isConnected,
    startCall,
    answerCall,
    handleSignal,
    endCall,
    cleanup
  } = useWebRTC({
    onRemoteStream: (stream) => {
      console.log('Remote stream received:', stream);
    },
    onCallEnded: () => {
      console.log('Call ended');
      setIsInCall(false);
      setShowIncomingCall(false);
    }
  });

  // Socket connection and listeners
  useEffect(() => {
    if (user) {
      console.log('Connecting socket for user:', user._id);
      socketService.connect(user._id).then(() => {
        console.log('Socket connected successfully');
        
        // Set up listeners
        socketService.onIncomingCall((data) => {
          console.log('Incoming call received:', data);
          setCaller({ name: data.callerName, id: data.callerId });
          setCallType(data.callType);
          setShowIncomingCall(true);
          
          // Play ringtone sound (you can add audio file later)
          toast({
            title: "Incoming Call",
            description: `${data.callType} call from ${data.callerName}`
          });
        });

        socketService.onCallResponse((data) => {
          console.log('Call response received:', data);
          if (data.accepted) {
            setIsInCall(true);
            setShowIncomingCall(false);
          } else {
            toast({
              title: "Call Declined",
              description: "The user declined your call"
            });
          }
        });

        socketService.onCallSignal((data) => {
          console.log('Call signal received:', data);
          handleSignal(data.signal);
        });

        socketService.onCallEnded(() => {
          console.log('Call ended by remote user');
          setIsInCall(false);
          setShowIncomingCall(false);
          cleanup();
          toast({
            title: "Call Ended",
            description: "The call has been ended"
          });
        });

        socketService.onCallFailed((data) => {
          console.log('Call failed:', data);
          setShowMissedCall(true);
          setShowIncomingCall(false);
          toast({
            title: "Call Failed",
            description: data.reason || "The call could not be completed"
          });
        });
      }).catch(error => {
        console.error('Socket connection failed:', error);
        toast({
          title: "Connection Error",
          description: "Failed to connect to server"
        });
      });
    }

    return () => {
      socketService.disconnect();
    };
  }, [user, handleSignal, cleanup, toast]);

  // Test functions
  const handleStartCall = async (type: 'audio' | 'video') => {
    try {
      setCallType(type);
      // For testing, use a dummy recipient ID
      const testRecipientId = 'test-recipient-123';
      
      console.log(`Starting ${type} call to:`, testRecipientId);
      
      // Initiate call via socket
      socketService.initiateCall({
        callerId: user?._id || 'test-caller',
        receiverId: testRecipientId,
        callType: type
      });

      // Start WebRTC
      await startCall(type, testRecipientId);
      
      toast({
        title: "Calling...",
        description: `Starting ${type} call`
      });
      
    } catch (error) {
      console.error('Error starting call:', error);
      toast({
        title: "Call Failed",
        description: "Could not start the call"
      });
    }
  };

  const handleAcceptCall = async () => {
    try {
      console.log('Accepting call from:', caller.id);
      
      // Accept via socket
      socketService.respondToCall({
        targetSocketId: caller.id,
        accepted: true
      });

      // Answer via WebRTC
      await answerCall(callType, caller.id);
      
      setShowIncomingCall(false);
      setIsInCall(true);
      
    } catch (error) {
      console.error('Error accepting call:', error);
      toast({
        title: "Error",
        description: "Could not accept the call"
      });
    }
  };

  const handleDeclineCall = () => {
    console.log('Declining call from:', caller.id);
    
    socketService.respondToCall({
      targetSocketId: caller.id,
      accepted: false
    });
    
    setShowIncomingCall(false);
    setShowMissedCall(true);
  };

  const handleEndCall = () => {
    console.log('Ending call');
    endCall();
    setIsInCall(false);
  };

  const handleCallBack = () => {
    console.log('Calling back:', caller.name);
    handleStartCall('audio');
    setShowMissedCall(false);
  };

  const handleDismissMissedCall = () => {
    setShowMissedCall(false);
  };

  // Simulate incoming call for testing
  const simulateIncomingCall = (type: 'audio' | 'video') => {
    setCaller({ name: 'Dr. Smith', id: 'doctor123' });
    setCallType(type);
    setShowIncomingCall(true);
    
    toast({
      title: "Simulated Incoming Call",
      description: `${type} call from Dr. Smith`
    });
  };

  const simulateMissedCall = () => {
    setShowMissedCall(true);
    setCaller({ name: 'Dr. Johnson', id: 'doctor456' });
    setCallType('video');
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Call System Test Page</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          
          {/* User Info */}
          <div className="p-4 bg-gray-100 rounded">
            <p><strong>Current User:</strong> {user?.name || 'Not logged in'}</p>
            <p><strong>User ID:</strong> {user?._id || 'N/A'}</p>
            <p><strong>Role:</strong> {user?.role || 'N/A'}</p>
          </div>

          {/* Connection Status */}
          <div className="p-4 bg-blue-50 rounded">
            <p><strong>Socket Status:</strong> {socketService.isSocketConnected() ? '✅ Connected' : '❌ Disconnected'}</p>
            <p><strong>WebRTC Status:</strong> {isConnected ? '✅ Connected' : isConnecting ? '🔄 Connecting' : '❌ Disconnected'}</p>
          </div>

          {/* Test Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Make Calls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  onClick={() => handleStartCall('audio')}
                  className="w-full"
                  disabled={isInCall}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Start Audio Call
                </Button>
                <Button 
                  onClick={() => handleStartCall('video')}
                  className="w-full"
                  disabled={isInCall}
                >
                  <Video className="w-4 h-4 mr-2" />
                  Start Video Call
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Simulate Events</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  onClick={() => simulateIncomingCall('audio')}
                  variant="outline"
                  className="w-full"
                >
                  Simulate Audio Call
                </Button>
                <Button 
                  onClick={() => simulateIncomingCall('video')}
                  variant="outline"
                  className="w-full"
                >
                  Simulate Video Call
                </Button>
                <Button 
                  onClick={simulateMissedCall}
                  variant="outline"
                  className="w-full"
                >
                  Simulate Missed Call
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Current Call Status */}
          {(isInCall || isConnecting) && (
            <div className="p-4 bg-green-50 rounded">
              <p><strong>Call Status:</strong> {isConnecting ? 'Connecting...' : 'In Call'}</p>
              <p><strong>Call Type:</strong> {callType}</p>
              <p><strong>Local Stream:</strong> {localStream ? '✅' : '❌'}</p>
              <p><strong>Remote Stream:</strong> {remoteStream ? '✅' : '❌'}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Missed Call Notification */}
      {showMissedCall && (
        <MissedCallNotification
          callerName={caller.name}
          callType={callType}
          timestamp={new Date()}
          onCallBack={handleCallBack}
          onDismiss={handleDismissMissedCall}
        />
      )}

      {/* Incoming Call Modal */}
      <IncomingCallModal
        isOpen={showIncomingCall}
        callerName={caller.name}
        callType={callType}
        onAccept={handleAcceptCall}
        onDecline={handleDeclineCall}
      />

      {/* Call Interface */}
      <CallInterface
        isActive={isInCall}
        isVideo={callType === 'video'}
        participantName={caller.name}
        onEndCall={handleEndCall}
        localStream={localStream}
        remoteStream={remoteStream}
      />
    </div>
  );
};

export default CallTest;