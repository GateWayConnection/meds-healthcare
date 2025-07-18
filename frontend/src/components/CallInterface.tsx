import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, PhoneOff, Video, VideoOff, Mic, MicOff } from 'lucide-react';

interface CallInterfaceProps {
  isActive: boolean;
  isVideo: boolean;
  participantName: string;
  onEndCall: () => void;
  localStream?: MediaStream;
  remoteStream?: MediaStream;
}

const CallInterface: React.FC<CallInterfaceProps> = ({
  isActive,
  isVideo,
  participantName,
  onEndCall,
  localStream,
  remoteStream
}) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(isVideo);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl h-full max-h-[80vh] bg-gray-900 text-white border-gray-700">
        <CardHeader className="text-center border-b border-gray-700">
          <CardTitle className="text-white">
            {isVideo ? 'Video Call' : 'Voice Call'} with {participantName}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 p-0 relative">
          {isVideo ? (
            <div className="relative w-full h-full">
              {/* Remote video */}
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              
              {/* Local video (small overlay) */}
              <div className="absolute top-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-600">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-32 h-32 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-16 h-16 text-gray-400" />
                </div>
                <h3 className="text-xl font-medium mb-2">{participantName}</h3>
                <p className="text-gray-400">Connected</p>
              </div>
            </div>
          )}
          
          {/* Call controls */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center gap-4 bg-black/50 rounded-full px-6 py-4">
              <Button
                variant="outline"
                size="lg"
                onClick={toggleMute}
                className={`rounded-full w-12 h-12 p-0 ${
                  isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
                } border-gray-600`}
              >
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </Button>
              
              {isVideo && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={toggleVideo}
                  className={`rounded-full w-12 h-12 p-0 ${
                    !isVideoEnabled ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
                  } border-gray-600`}
                >
                  {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                </Button>
              )}
              
              <Button
                variant="destructive"
                size="lg"
                onClick={onEndCall}
                className="rounded-full w-12 h-12 p-0 bg-red-500 hover:bg-red-600"
              >
                <PhoneOff className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CallInterface;