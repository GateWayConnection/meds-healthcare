import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PhoneOff, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MissedCallNotificationProps {
  callerName: string;
  callType: 'audio' | 'video';
  timestamp: Date;
  onCallBack?: () => void;
  onDismiss?: () => void;
}

const MissedCallNotification: React.FC<MissedCallNotificationProps> = ({
  callerName,
  callType,
  timestamp,
  onCallBack,
  onDismiss
}) => {
  const { toast } = useToast();

  const handleCallBack = () => {
    toast({
      title: "Calling back...",
      description: `Calling ${callerName} back`
    });
    onCallBack?.();
  };

  return (
    <Card className="border-red-200 bg-red-50">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <PhoneOff className="w-5 h-5 text-red-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-red-900">
              Missed {callType} call from {callerName}
            </p>
            <p className="text-xs text-red-600">
              {timestamp.toLocaleTimeString()}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleCallBack}
              className="text-xs"
            >
              <Phone className="w-3 h-3 mr-1" />
              Call back
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={onDismiss}
              className="text-xs text-gray-500"
            >
              Dismiss
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MissedCallNotification;