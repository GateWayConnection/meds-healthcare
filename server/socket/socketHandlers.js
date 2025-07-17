const ChatMessage = require('../models/ChatMessage');
const ChatRoom = require('../models/ChatRoom');
const User = require('../models/User');

// Helper function to generate room ID
const generateRoomId = (userId1, userId2) => {
  return [userId1, userId2].sort().join('-');
};

const handleSocketConnection = (io) => {
  const connectedUsers = new Map(); // userId -> socketId

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // User joins with their ID
    socket.on('join_user', (userId) => {
      if (userId) {
        connectedUsers.set(userId, socket.id);
        socket.userId = userId;
        socket.join(`user_${userId}`);
        
        // Notify others that user is online
        socket.broadcast.emit('user_online', { userId, socketId: socket.id });
        console.log(`User ${userId} joined with socket ${socket.id}`);
      }
    });

    // Join specific chat room
    socket.on('join_room', async (data) => {
      try {
        const { roomId, userId } = data;
        
        // Verify user is participant in this room
        const room = await ChatRoom.findOne({
          _id: roomId,
          participants: userId
        });
        
        if (room) {
          socket.join(roomId);
          console.log(`User ${userId} joined room ${roomId}`);
        }
      } catch (error) {
        console.error('Error joining room:', error);
        socket.emit('error', { message: 'Failed to join room' });
      }
    });

    // Send message
    socket.on('send_message', async (data) => {
      try {
        const { senderId, receiverId, content, type = 'text' } = data;

        if (!receiverId || !content || !senderId) {
          socket.emit('error', { message: 'Invalid message data' });
          return;
        }

        // Verify sender
        const sender = await User.findById(senderId);
        const receiver = await User.findById(receiverId);
        
        if (!sender || !receiver) {
          socket.emit('error', { message: 'User not found' });
          return;
        }

        // Find or create chat room
        let room = await ChatRoom.findOne({
          participants: { $all: [senderId, receiverId] }
        });

        if (!room) {
          room = new ChatRoom({
            participants: [senderId, receiverId],
            lastActivity: new Date(),
            unreadCount: new Map()
          });
          await room.save();
        }

        // Create message
        const message = new ChatMessage({
          senderId,
          receiverId,
          content: content.trim(),
          type,
          roomId: room._id
        });

        await message.save();

        // Update room
        room.lastMessage = message._id;
        room.lastActivity = new Date();
        
        // Update unread count for receiver
        const currentUnread = room.unreadCount.get(receiverId.toString()) || 0;
        room.unreadCount.set(receiverId.toString(), currentUnread + 1);
        
        await room.save();

        // Populate message
        await message.populate('senderId', 'name email role');
        await message.populate('receiverId', 'name email role');

        // Send to both participants in the room AND directly to each user
        io.to(room._id.toString()).emit('new_message', message);
        
        // Also send directly to both sender and receiver socket IDs for reliability
        const senderSocketId = connectedUsers.get(senderId.toString());
        const receiverSocketId = connectedUsers.get(receiverId.toString());
        
        if (senderSocketId) {
          io.to(senderSocketId).emit('new_message', message);
        }
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('new_message', message);
          io.to(receiverSocketId).emit('message_notification', {
            message,
            roomId: room._id,
            senderName: sender.name
          });
        }

        console.log(`Message sent from ${senderId} to ${receiverId}`);
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Edit message
    socket.on('edit_message', async (data) => {
      try {
        const { messageId, content, userId } = data;

        const message = await ChatMessage.findOne({
          _id: messageId,
          senderId: userId
        });

        if (!message) {
          socket.emit('error', { message: 'Message not found or access denied' });
          return;
        }

        message.content = content.trim();
        message.isEdited = true;
        message.editedAt = new Date();

        await message.save();
        await message.populate('senderId', 'name email role');
        await message.populate('receiverId', 'name email role');

        // Broadcast to room
        io.to(message.roomId.toString()).emit('message_edited', message);
      } catch (error) {
        console.error('Error editing message:', error);
        socket.emit('error', { message: 'Failed to edit message' });
      }
    });

    // Delete message
    socket.on('delete_message', async (data) => {
      try {
        const { messageId, userId } = data;

        const message = await ChatMessage.findOne({
          _id: messageId,
          senderId: userId
        });

        if (!message) {
          socket.emit('error', { message: 'Message not found or access denied' });
          return;
        }

        const roomId = message.roomId;
        await ChatMessage.findByIdAndDelete(messageId);

        // Broadcast to room
        io.to(roomId.toString()).emit('message_deleted', { messageId });
      } catch (error) {
        console.error('Error deleting message:', error);
        socket.emit('error', { message: 'Failed to delete message' });
      }
    });

    // Mark message as read
    socket.on('mark_read', async (data) => {
      try {
        const { messageId, userId } = data;

        const message = await ChatMessage.findOne({
          _id: messageId,
          receiverId: userId
        });

        if (message && !message.isRead) {
          message.isRead = true;
          await message.save();

          // Update room unread count
          const room = await ChatRoom.findById(message.roomId);
          if (room) {
            const currentUnread = room.unreadCount.get(userId.toString()) || 0;
            room.unreadCount.set(userId.toString(), Math.max(0, currentUnread - 1));
            await room.save();
          }

          // Notify sender that message was read
          const senderSocketId = connectedUsers.get(message.senderId.toString());
          if (senderSocketId) {
            io.to(senderSocketId).emit('message_read', { messageId });
          }
        }
      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    });

    // Handle calling features
    socket.on('initiate_call', async (data) => {
      try {
        const { callerId, receiverId, callType } = data;
        
        const receiverSocketId = connectedUsers.get(receiverId);
        if (receiverSocketId) {
          const caller = await User.findById(callerId);
          io.to(receiverSocketId).emit('incoming_call', {
            callerId,
            callerName: caller.name,
            callType,
            socketId: socket.id
          });
        } else {
          socket.emit('call_failed', { reason: 'User is offline' });
        }
      } catch (error) {
        console.error('Error initiating call:', error);
        socket.emit('call_failed', { reason: 'Failed to initiate call' });
      }
    });

    socket.on('call_response', (data) => {
      const { targetSocketId, accepted, callData } = data;
      io.to(targetSocketId).emit('call_response', { accepted, callData });
    });

    socket.on('call_signal', (data) => {
      const { targetSocketId, signal } = data;
      io.to(targetSocketId).emit('call_signal', { signal, from: socket.id });
    });

    socket.on('end_call', (data) => {
      const { targetSocketId } = data;
      if (targetSocketId) {
        io.to(targetSocketId).emit('call_ended');
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      if (socket.userId) {
        connectedUsers.delete(socket.userId);
        socket.broadcast.emit('user_offline', { userId: socket.userId });
        console.log(`User ${socket.userId} disconnected`);
      }
      console.log('User disconnected:', socket.id);
    });
  });

  return { connectedUsers };
};

module.exports = { handleSocketConnection };