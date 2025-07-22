import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, PhoneOff, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface IncomingCallModalProps {
  isOpen: boolean;
  callerName: string;
  callerImage?: string;
  callType: 'audio' | 'video';
  onAccept: () => void;
  onDecline: () => void;
}

export const IncomingCallModal: React.FC<IncomingCallModalProps> = ({
  isOpen,
  callerName,
  callerImage,
  callType,
  onAccept,
  onDecline
}) => {
  const [isRinging, setIsRinging] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsRinging(true);
      // Play a ringtone (if you have audio files)
      // const audio = new Audio('/ringtone.mp3');
      // audio.loop = true;
      // audio.play();
      
      return () => {
        setIsRinging(false);
        // audio.pause();
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-md mx-4"
      >
        <Card className="bg-gradient-to-br from-blue-900 to-purple-900 border-white/20 text-white">
          <CardContent className="p-8 text-center">
            {/* Caller Info */}
            <motion.div
              animate={{ scale: isRinging ? [1, 1.05, 1] : 1 }}
              transition={{ duration: 1, repeat: Infinity }}
              className="mb-6"
            >
              <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white/30">
                <img
                  src={callerImage || '/placeholder.svg'}
                  alt={callerName}
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-2xl font-semibold mb-2">{callerName}</h2>
              <Badge variant="secondary" className="mb-4">
                {callType === 'video' ? (
                  <>
                    <Video className="w-4 h-4 mr-1" />
                    Video Call
                  </>
                ) : (
                  <>
                    <Phone className="w-4 h-4 mr-1" />
                    Voice Call
                  </>
                )}
              </Badge>
              <p className="text-gray-300">Incoming call...</p>
            </motion.div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-6">
              {/* Decline Button */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  onClick={onDecline}
                  className="w-16 h-16 rounded-full bg-red-500 border-red-500 text-white hover:bg-red-600 hover:border-red-600"
                >
                  <PhoneOff className="w-8 h-8" />
                </Button>
              </motion.div>

              {/* Accept Button */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                animate={{ scale: isRinging ? [1, 1.1, 1] : 1 }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  onClick={onAccept}
                  className="w-16 h-16 rounded-full bg-green-500 border-green-500 text-white hover:bg-green-600 hover:border-green-600"
                >
                  <Phone className="w-8 h-8" />
                </Button>
              </motion.div>
            </div>

            <div className="mt-4">
              <p className="text-sm text-gray-400">
                Swipe to answer • Tap to decline
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};