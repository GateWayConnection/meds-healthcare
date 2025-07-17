
const ChatRoom = require('../models/ChatRoom');
const ChatMessage = require('../models/ChatMessage');
const User = require('../models/User');

const userSockets = new Map(); // userId -> socketId
const socketUsers = new Map(); // socketId -> userId

const handleSocketConnection = (io) => {
  io.on('connection', (socket) => {
    console.log('🔌 User connected:', socket.id);

    // Handle user joining
    socket.on('join_user', async (userId) => {
      try {
        console.log(`👤 User ${userId} joined with socket ${socket.id}`);
        userSockets.set(userId, socket.id);
        socketUsers.set(socket.id, userId);
        
        // Join user-specific room
        socket.join(`user_${userId}`);
        
        // Broadcast user online status
        socket.broadcast.emit('user_online', { userId });
        
        console.log(`✅ User ${userId} is now online`);
      } catch (error) {
        console.error('❌ Error in join_user:', error);
      }
    });

    // Handle joining chat rooms
    socket.on('join_room', async ({ roomId, userId }) => {
      try {
        socket.join(roomId);
        console.log(`📝 User ${userId} joined room ${roomId}`);
      } catch (error) {
        console.error('❌ Error joining room:', error);
      }
    });

    // Handle sending messages
    socket.on('send_message', async (data) => {
      try {
        console.log('💬 Sending message:', data);
        
        const { senderId, receiverId, content, type = 'text' } = data;

        // Find or create chat room
        let room = await ChatRoom.findOne({
          participants: { $all: [senderId, receiverId] }
        }).populate('participants', 'name email role');

        if (!room) {
          room = new ChatRoom({
            participants: [senderId, receiverId]
          });
          await room.save();
          await room.populate('participants', 'name email role');
        }

        // Create message
        const message = new ChatMessage({
          senderId,
          receiverId,
          content,
          type,
          roomId: room._id.toString()
        });

        await message.save();
        
        // Populate message data
        await message.populate([
          { path: 'senderId', select: 'name email role' },
          { path: 'receiverId', select: 'name email role' }
        ]);

        // Update room's last message and activity
        room.lastMessage = message._id;
        room.lastActivity = new Date();
        
        // Update unread count for receiver
        const currentUnread = room.unreadCount.get(receiverId.toString()) || 0;
        room.unreadCount.set(receiverId.toString(), currentUnread + 1);
        
        await room.save();

        // Emit to both users
        const roomId = room._id.toString();
        
        // Send to room participants
        io.to(roomId).emit('new_message', {
          message,
          roomId
        });

        // Send notification to receiver if they're not in the room
        const receiverSocketId = userSockets.get(receiverId.toString());
        if (receiverSocketId) {
          io.to(`user_${receiverId}`).emit('message_notification', {
            message,
            senderName: message.senderId.name,
            roomId
          });
        }

        console.log('✅ Message sent successfully');
      } catch (error) {
        console.error('❌ Error sending message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle message editing
    socket.on('edit_message', async (data) => {
      try {
        const { messageId, content, userId } = data;
        
        const message = await ChatMessage.findOneAndUpdate(
          { _id: messageId, senderId: userId },
          { 
            content,
            isEdited: true,
            editedAt: new Date()
          },
          { new: true }
        ).populate([
          { path: 'senderId', select: 'name email role' },
          { path: 'receiverId', select: 'name email role' }
        ]);

        if (message) {
          io.to(message.roomId).emit('message_edited', { message });
        }
      } catch (error) {
        console.error('❌ Error editing message:', error);
      }
    });

    // Handle message deletion
    socket.on('delete_message', async (data) => {
      try {
        const { messageId, userId } = data;
        
        const message = await ChatMessage.findOneAndDelete({
          _id: messageId,
          senderId: userId
        });

        if (message) {
          io.to(message.roomId).emit('message_deleted', { messageId });
        }
      } catch (error) {
        console.error('❌ Error deleting message:', error);
      }
    });

    // Handle marking messages as read
    socket.on('mark_read', async (data) => {
      try {
        const { messageId, userId } = data;
        
        const message = await ChatMessage.findByIdAndUpdate(
          messageId,
          { isRead: true },
          { new: true }
        );

        if (message) {
          // Update unread count in room
          const room = await ChatRoom.findById(message.roomId);
          if (room) {
            const currentUnread = room.unreadCount.get(userId.toString()) || 0;
            room.unreadCount.set(userId.toString(), Math.max(0, currentUnread - 1));
            await room.save();
          }

          io.to(message.roomId).emit('message_read', { messageId });
        }
      } catch (error) {
        console.error('❌ Error marking message as read:', error);
      }
    });

    // Handle call initiation
    socket.on('initiate_call', async (data) => {
      try {
        console.log('📞 Call initiated:', data);
        const { callerId, receiverId, callType } = data;
        
        const caller = await User.findById(callerId).select('name');
        const receiverSocketId = userSockets.get(receiverId.toString());
        
        if (receiverSocketId) {
          io.to(`user_${receiverId}`).emit('incoming_call', {
            callerId,
            callerName: caller.name,
            callerSocketId: socket.id,
            callType,
            timestamp: new Date()
          });
          
          console.log(`✅ Call notification sent to user ${receiverId}`);
        } else {
          // User is offline, store missed call
          socket.emit('call_failed', { reason: 'User is offline' });
          console.log(`❌ User ${receiverId} is offline`);
        }
      } catch (error) {
        console.error('❌ Error initiating call:', error);
        socket.emit('call_failed', { reason: 'Failed to initiate call' });
      }
    });

    // Handle call response (accept/decline)
    socket.on('call_response', async (data) => {
      try {
        console.log('📞 Call response:', data);
        const { targetSocketId, accepted, callData } = data;
        
        if (targetSocketId) {
          io.to(targetSocketId).emit('call_response', {
            accepted,
            callData,
            responderSocketId: socket.id
          });
          
          console.log(`✅ Call response sent: ${accepted ? 'accepted' : 'declined'}`);
        }
      } catch (error) {
        console.error('❌ Error handling call response:', error);
      }
    });

    // Handle call signals (WebRTC)
    socket.on('call_signal', async (data) => {
      try {
        const { targetSocketId, signal } = data;
        
        if (targetSocketId) {
          io.to(targetSocketId).emit('call_signal', {
            signal,
            senderSocketId: socket.id
          });
        }
      } catch (error) {
        console.error('❌ Error handling call signal:', error);
      }
    });

    // Handle call end
    socket.on('end_call', async (data) => {
      try {
        console.log('📞 Call ended:', data);
        const { targetSocketId } = data;
        
        if (targetSocketId) {
          io.to(targetSocketId).emit('call_ended');
        }
        
        console.log('✅ Call ended successfully');
      } catch (error) {
        console.error('❌ Error ending call:', error);
      }
    });

    // Handle typing indicators
    socket.on('typing_start', (data) => {
      const { roomId, userId } = data;
      socket.to(roomId).emit('user_typing', { userId, isTyping: true });
    });

    socket.on('typing_stop', (data) => {
      const { roomId, userId } = data;
      socket.to(roomId).emit('user_typing', { userId, isTyping: false });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('🔌 User disconnected:', socket.id);
      
      const userId = socketUsers.get(socket.id);
      if (userId) {
        userSockets.delete(userId);
        socketUsers.delete(socket.id);
        
        // Broadcast user offline status
        socket.broadcast.emit('user_offline', { userId });
        console.log(`👤 User ${userId} is now offline`);
      }
    });

    // Handle connection errors
    socket.on('error', (error) => {
      console.error('❌ Socket error:', error);
    });
  });

  // Handle server errors
  io.engine.on('connection_error', (err) => {
    console.log('❌ Connection error details:');
    console.log('Error code:', err.code);
    console.log('Error message:', err.message);
    console.log('Error context:', err.context);
  });
};

module.exports = { handleSocketConnection };
