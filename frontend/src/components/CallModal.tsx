import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Phone, 
  PhoneOff, 
  Video, 
  VideoOff, 
  Mic, 
  MicOff,
  Speaker,
  VolumeX
} from 'lucide-react';
import { socketService } from '../services/socketService';
import { toast } from 'sonner';

interface CallModalProps {
  isOpen: boolean;
  onClose: () => void;
  callData: {
    callerId: string;
    callerName: string;
    callType: 'audio' | 'video';
    socketId: string;
  } | null;
  user: any;
  isIncoming?: boolean;
}

const CallModal: React.FC<CallModalProps> = ({ 
  isOpen, 
  onClose, 
  callData, 
  user, 
  isIncoming = false 
}) => {
  const [callStatus, setCallStatus] = useState<'ringing' | 'connecting' | 'connected' | 'ended'>('ringing');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const callStartTime = useRef<Date | null>(null);
  const callTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!callData) return;

    // Set up call response listeners
    socketService.onCallResponse((response: any) => {
      if (response.accepted) {
        setCallStatus('connecting');
        setTimeout(() => {
          setCallStatus('connected');
          startCallTimer();
          toast.success('Call connected');
        }, 2000);
      } else {
        setCallStatus('ended');
        toast.error('Call declined');
        setTimeout(onClose, 1500);
      }
    });

    socketService.onCallEnded(() => {
      setCallStatus('ended');
      stopCallTimer();
      toast.info('Call ended');
      setTimeout(onClose, 1500);
    });

    socketService.onCallFailed((data: { reason: string }) => {
      setCallStatus('ended');
      toast.error(`Call failed: ${data.reason}`);
      setTimeout(onClose, 1500);
    });

    return () => {
      socketService.removeListener('call_response');
      socketService.removeListener('call_ended');
      socketService.removeListener('call_failed');
      stopCallTimer();
    };
  }, [callData, onClose]);

  const startCallTimer = () => {
    callStartTime.current = new Date();
    callTimer.current = setInterval(() => {
      if (callStartTime.current) {
        const now = new Date();
        const duration = Math.floor((now.getTime() - callStartTime.current.getTime()) / 1000);
        setCallDuration(duration);
      }
    }, 1000);
  };

  const stopCallTimer = () => {
    if (callTimer.current) {
      clearInterval(callTimer.current);
      callTimer.current = null;
    }
    callStartTime.current = null;
    setCallDuration(0);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAcceptCall = () => {
    if (!callData) return;
    
    setCallStatus('connecting');
    socketService.respondToCall({
      targetSocketId: callData.socketId,
      accepted: true,
      callData: { acceptedBy: user?.name }
    });
    
    setTimeout(() => {
      setCallStatus('connected');
      startCallTimer();
      toast.success('Call connected');
    }, 2000);
  };

  const handleDeclineCall = () => {
    if (!callData) return;
    
    socketService.respondToCall({
      targetSocketId: callData.socketId,
      accepted: false
    });
    
    setCallStatus('ended');
    toast.info('Call declined');
    setTimeout(onClose, 1000);
  };

  const handleEndCall = () => {
    if (!callData) return;
    
    socketService.endCall({
      targetSocketId: callData.socketId
    });
    
    setCallStatus('ended');
    stopCallTimer();
    toast.info('Call ended');
    setTimeout(onClose, 1000);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    toast.info(isMuted ? 'Microphone on' : 'Microphone muted');
  };

  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff);
    toast.info(isVideoOff ? 'Camera on' : 'Camera off');
  };

  const toggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
    toast.info(isSpeakerOn ? 'Speaker off' : 'Speaker on');
  };

  if (!callData) return null;

  const getStatusText = () => {
    switch (callStatus) {
      case 'ringing':
        return isIncoming ? 'Incoming call...' : 'Ringing...';
      case 'connecting':
        return 'Connecting...';
      case 'connected':
        return formatDuration(callDuration);
      case 'ended':
        return 'Call ended';
      default:
        return '';
    }
  };

  const getStatusColor = () => {
    switch (callStatus) {
      case 'ringing':
        return 'bg-blue-500';
      case 'connecting':
        return 'bg-yellow-500';
      case 'connected':
        return 'bg-green-500';
      case 'ended':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-lg mx-4"
          >
            <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-slate-700">
              <CardContent className="p-6">
                {/* Call Header */}
                <div className="text-center mb-6">
                  <div className="relative">
                    <img
                      src="/placeholder.svg"
                      alt={callData.callerName}
                      className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white/20"
                    />
                    <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full ${getStatusColor()} flex items-center justify-center`}>
                      {callData.callType === 'video' ? (
                        <Video className="w-3 h-3" />
                      ) : (
                        <Phone className="w-3 h-3" />
                      )}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-2">{callData.callerName}</h3>
                  <Badge variant="secondary" className="mb-2">
                    {callData.callType === 'video' ? 'Video Call' : 'Audio Call'}
                  </Badge>
                  <p className="text-sm text-gray-300">{getStatusText()}</p>
                </div>

                {/* Video Area */}
                {callData.callType === 'video' && callStatus === 'connected' && (
                  <div className="mb-6 relative">
                    <video
                      ref={remoteVideoRef}
                      className="w-full h-48 bg-slate-800 rounded-lg"
                      autoPlay
                      playsInline
                    />
                    <video
                      ref={localVideoRef}
                      className="absolute bottom-2 right-2 w-20 h-16 bg-slate-700 rounded border-2 border-white/20"
                      autoPlay
                      playsInline
                      muted
                    />
                  </div>
                )}

                {/* Call Controls */}
                <div className="flex justify-center gap-4">
                  {callStatus === 'ringing' && isIncoming ? (
                    <>
                      <Button
                        onClick={handleDeclineCall}
                        className="bg-red-500 hover:bg-red-600 rounded-full w-12 h-12"
                      >
                        <PhoneOff className="w-5 h-5" />
                      </Button>
                      <Button
                        onClick={handleAcceptCall}
                        className="bg-green-500 hover:bg-green-600 rounded-full w-12 h-12"
                      >
                        <Phone className="w-5 h-5" />
                      </Button>
                    </>
                  ) : callStatus === 'connected' ? (
                    <>
                      <Button
                        onClick={toggleMute}
                        variant={isMuted ? "destructive" : "secondary"}
                        className="rounded-full w-12 h-12"
                      >
                        {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                      </Button>
                      
                      {callData.callType === 'video' && (
                        <Button
                          onClick={toggleVideo}
                          variant={isVideoOff ? "destructive" : "secondary"}
                          className="rounded-full w-12 h-12"
                        >
                          {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                        </Button>
                      )}
                      
                      <Button
                        onClick={toggleSpeaker}
                        variant={isSpeakerOn ? "secondary" : "outline"}
                        className="rounded-full w-12 h-12"
                      >
                        {isSpeakerOn ? <Speaker className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                      </Button>
                      
                      <Button
                        onClick={handleEndCall}
                        className="bg-red-500 hover:bg-red-600 rounded-full w-12 h-12"
                      >
                        <PhoneOff className="w-5 h-5" />
                      </Button>
                    </>
                  ) : callStatus === 'ringing' && !isIncoming ? (
                    <Button
                      onClick={handleEndCall}
                      className="bg-red-500 hover:bg-red-600 rounded-full w-12 h-12"
                    >
                      <PhoneOff className="w-5 h-5" />
                    </Button>
                  ) : null}
                </div>

                {/* Call Status Indicator */}
                {(callStatus === 'connecting' || callStatus === 'ringing') && (
                  <div className="flex justify-center mt-4">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CallModal;