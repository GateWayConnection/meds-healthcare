import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Phone, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  MessageCircle,
  Settings,
  Monitor
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { useDoctors } from '../hooks/useDoctors';
import { useWebRTC } from '../hooks/useWebRTC';
import { socketService } from '../services/socketService';

const Call = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { doctors } = useDoctors();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [doctorSocketId, setDoctorSocketId] = useState<string>('');
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  
  const doctorId = searchParams.get('doctor');
  const callType = searchParams.get('type') as 'audio' | 'video' || 'video';
  const { fetchDoctors } = useDoctors();
  const doctor = doctors.find(d => d._id === doctorId);

  // Use the real WebRTC hook
  const webRTC = useWebRTC({
    onRemoteStream: (stream) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;
      }
    },
    onCallEnded: () => {
      toast.info('Call ended');
      navigate(`/chat?doctor=${doctorId}`);
    }
  });

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
    // Connect socket and set up call listeners
    if (user) {
      socketService.connect(user._id);
      
      // Listen for call signals
      socketService.onCallSignal(webRTC.handleSignal);
      
      // Listen for call responses
      socketService.onCallResponse(async (data) => {
        if (data.accepted && data.targetSocketId) {
          setDoctorSocketId(data.targetSocketId);
          // Start the WebRTC call
          await webRTC.startCall(callType, data.targetSocketId);
        } else {
          toast.error('Call was declined');
          navigate(`/chat?doctor=${doctorId}`);
        }
      });

      return () => {
        socketService.removeListener('call_signal');
        socketService.removeListener('call_response');
        webRTC.cleanup();
      };
    }
  }, [user, webRTC, callType, doctorId, navigate]);

  useEffect(() => {
    // Check if doctor exists and initiate call
    if (doctorId && doctors.length > 0 && user) {
      if (!doctor) {
        toast.error('Doctor not found');
        navigate('/find-doctor');
        return;
      }
      
      // Initiate call through socket
      socketService.initiateCall({
        callerId: user._id,
        receiverId: doctorId,
        callType: callType
      });
      
      toast.info(`Calling ${doctor.name}...`);
    }
  }, [doctorId, doctors, doctor, navigate, callType, user]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (webRTC.isConnected) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [webRTC.isConnected]);

  // Set up local video stream
  useEffect(() => {
    if (webRTC.localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = webRTC.localStream;
    }
  }, [webRTC.localStream]);

  const endCall = () => {
    webRTC.endCall();
    navigate(`/chat?doctor=${doctorId}`);
  };

  const toggleMute = () => {
    if (webRTC.localStream) {
      const audioTrack = webRTC.localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (webRTC.localStream) {
      const videoTrack = webRTC.localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOn(videoTrack.enabled);
      }
    }
  };

  const shareScreen = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      });
      
      setIsScreenSharing(true);
      toast.success('Screen sharing started');
      
      stream.getVideoTracks()[0].onended = () => {
        setIsScreenSharing(false);
        toast.info('Screen sharing stopped');
      };
      
    } catch (error) {
      console.error('Error sharing screen:', error);
      toast.error('Unable to share screen');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!doctor) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-gray-900 to-purple-900"></div>
      
      {/* Header */}
      <div className="relative z-10 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src={doctor.image || '/placeholder.svg'}
              alt={doctor.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
            />
            <div>
              <h1 className="text-xl font-semibold">{doctor.name}</h1>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">{doctor.specialty}</Badge>
                <span className="text-sm text-gray-300">
                  {webRTC.isConnecting ? 'Connecting...' : webRTC.isConnected ? `Connected • ${formatTime(callDuration)}` : 'Calling...'}
                </span>
              </div>
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/chat?doctor=${doctorId}`)}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Chat
          </Button>
        </div>
      </div>

      {/* Video Area */}
      {callType === 'video' && (
        <div className="relative z-10 flex-1 px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-300px)]">
            {/* Remote Video (Doctor) */}
            <Card className="relative overflow-hidden bg-black border-white/20">
              <CardContent className="p-0 h-full">
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4">
                  <Badge className="bg-black/50 text-white border-0">
                    {doctor.name}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Local Video (User) */}
            <Card className="relative overflow-hidden bg-black border-white/20">
              <CardContent className="p-0 h-full">
                {isVideoOn ? (
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover scale-x-[-1]"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-800">
                    <div className="text-center">
                      <VideoOff className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-400">Video is off</p>
                    </div>
                  </div>
                )}
                <div className="absolute bottom-4 left-4">
                  <Badge className="bg-black/50 text-white border-0">
                    You {isScreenSharing && '(Screen)'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Audio Only Display */}
      {callType === 'audio' && (
        <div className="relative z-10 flex-1 flex items-center justify-center px-6">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center space-y-8"
          >
            <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-white/20">
              <img
                src={doctor.image || '/placeholder.svg'}
                alt={doctor.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-2">{doctor.name}</h2>
              <p className="text-gray-300">Audio call in progress</p>
              {webRTC.isConnected && (
                <p className="text-lg mt-4">{formatTime(callDuration)}</p>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Controls */}
      <div className="relative z-10 p-6">
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={toggleMute}
            className={`w-14 h-14 rounded-full ${
              isMuted 
                ? 'bg-red-500 border-red-500 text-white hover:bg-red-600' 
                : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
            }`}
          >
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </Button>

          {callType === 'video' && (
            <>
              <Button
                variant="outline"
                size="lg"
                onClick={toggleVideo}
                className={`w-14 h-14 rounded-full ${
                  !isVideoOn 
                    ? 'bg-red-500 border-red-500 text-white hover:bg-red-600' 
                    : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                }`}
              >
                {isVideoOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={shareScreen}
                className={`w-14 h-14 rounded-full ${
                  isScreenSharing 
                    ? 'bg-blue-500 border-blue-500 text-white hover:bg-blue-600' 
                    : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                }`}
              >
                <Monitor className="w-6 h-6" />
              </Button>
            </>
          )}

          <Button
            variant="outline"
            size="lg"
            onClick={endCall}
            className="w-14 h-14 rounded-full bg-red-500 border-red-500 text-white hover:bg-red-600"
          >
            <PhoneOff className="w-6 h-6" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="w-14 h-14 rounded-full bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <Settings className="w-6 h-6" />
          </Button>
        </div>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-400">
            {webRTC.isConnecting ? 'Connecting to doctor...' : webRTC.isConnected ? 'Call in progress' : 'Waiting for doctor...'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Call;