import { useState, useRef, useCallback } from 'react';
import { socketService } from '../services/socketService';

export interface UseWebRTCProps {
  onRemoteStream?: (stream: MediaStream) => void;
  onCallEnded?: () => void;
}

export const useWebRTC = ({ onRemoteStream, onCallEnded }: UseWebRTCProps = {}) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const targetSocketId = useRef<string>('');

  const createPeerConnection = useCallback(() => {
    const config: RTCConfiguration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    };

    const pc = new RTCPeerConnection(config);

    pc.onicecandidate = (event) => {
      if (event.candidate && targetSocketId.current) {
        socketService.sendCallSignal({
          targetSocketId: targetSocketId.current,
          signal: { type: 'ice-candidate', candidate: event.candidate }
        });
      }
    };

    pc.ontrack = (event) => {
      const [stream] = event.streams;
      setRemoteStream(stream);
      onRemoteStream?.(stream);
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'connected') {
        setIsConnected(true);
        setIsConnecting(false);
      } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        cleanup();
        onCallEnded?.();
      }
    };

    return pc;
  }, [onRemoteStream, onCallEnded]);

  const startCall = useCallback(async (callType: 'audio' | 'video', recipientSocketId: string) => {
    try {
      setIsConnecting(true);
      targetSocketId.current = recipientSocketId;

      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: callType === 'video'
      });

      setLocalStream(stream);

      // Create peer connection
      peerConnection.current = createPeerConnection();

      // Add stream to peer connection
      stream.getTracks().forEach(track => {
        peerConnection.current?.addTrack(track, stream);
      });

      // Create offer
      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);

      // Send offer via socket
      socketService.sendCallSignal({
        targetSocketId: recipientSocketId,
        signal: { type: 'offer', offer }
      });

    } catch (error) {
      console.error('Error starting call:', error);
      setIsConnecting(false);
      throw error;
    }
  }, [createPeerConnection]);

  const answerCall = useCallback(async (callType: 'audio' | 'video', callerSocketId: string) => {
    try {
      setIsConnecting(true);
      targetSocketId.current = callerSocketId;

      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: callType === 'video'
      });

      setLocalStream(stream);

      // Create peer connection
      peerConnection.current = createPeerConnection();

      // Add stream to peer connection
      stream.getTracks().forEach(track => {
        peerConnection.current?.addTrack(track, stream);
      });

    } catch (error) {
      console.error('Error answering call:', error);
      setIsConnecting(false);
      throw error;
    }
  }, [createPeerConnection]);

  const handleSignal = useCallback(async (signal: any) => {
    if (!peerConnection.current) return;

    try {
      if (signal.type === 'offer') {
        await peerConnection.current.setRemoteDescription(signal.offer);
        const answer = await peerConnection.current.createAnswer();
        await peerConnection.current.setLocalDescription(answer);
        
        socketService.sendCallSignal({
          targetSocketId: targetSocketId.current,
          signal: { type: 'answer', answer }
        });
      } else if (signal.type === 'answer') {
        await peerConnection.current.setRemoteDescription(signal.answer);
      } else if (signal.type === 'ice-candidate') {
        await peerConnection.current.addIceCandidate(signal.candidate);
      }
    } catch (error) {
      console.error('Error handling signal:', error);
    }
  }, []);

  const cleanup = useCallback(() => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    
    if (remoteStream) {
      setRemoteStream(null);
    }
    
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    
    setIsConnecting(false);
    setIsConnected(false);
    targetSocketId.current = '';
  }, [localStream, remoteStream]);

  const endCall = useCallback(() => {
    if (targetSocketId.current) {
      socketService.endCall({ targetSocketId: targetSocketId.current });
    }
    cleanup();
  }, [cleanup]);

  return {
    localStream,
    remoteStream,
    isConnecting,
    isConnected,
    startCall,
    answerCall,
    handleSignal,
    endCall,
    cleanup
  };
};