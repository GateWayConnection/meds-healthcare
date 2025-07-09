
const ChatMessage = require('../models/ChatMessage');
const ChatRoom = require('../models/ChatRoom');

// Store active users and their socket IDs
const activeUsers = new Map();
const userSockets = new Map();

const handleSocketConnection = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Handle user joining
    socket.on('join_user', (userId) => {
      console.log('User joined:', userId);
      activeUsers.set(userId, {
        socketId: socket.id,
        status: 'online',
        lastSeen: new Date()
      });
      userSockets.set(socket.id, userId);
      
      // Notify others that user is online
      socket.broadcast.emit('user_online', { userId });
    });

    // Handle joining a specific chat room
    socket.on('join_room', ({ roomId, userId }) => {
      socket.join(roomId);
      console.log(`User ${userId} joined room ${roomId}`);
    });

    // Handle sending messages
    socket.on('send_message', async (data) => {
      try {
        const { senderId, receiverId, content, type = 'text' } = data;
        
        // Create room ID (consistent between users)
        const roomId = [senderId, receiverId].sort().join('-');
        
        // Save message to database
        const message = new ChatMessage({
          senderId,
          receiverId,
          content,
          type,
          roomId
        });
        
        await message.save();
        
        // Populate sender and receiver info
        await message.populate('senderId', 'name email role');
        await message.populate('receiverId', 'name email role');
        
        // Update or create chat room
        let chatRoom = await ChatRoom.findOne({
          participants: { $all: [senderId, receiverId] }
        });
        
        if (!chatRoom) {
          chatRoom = new ChatRoom({
            participants: [senderId, receiverId],
            lastMessage: message._id,
            lastActivity: new Date()
          });
        } else {
          chatRoom.lastMessage = message._id;
          chatRoom.lastActivity = new Date();
        }
        
        await chatRoom.save();
        
        // Send message to room
        io.to(roomId).emit('new_message', message);
        
        // Send notification to receiver if they're online
        const receiverInfo = activeUsers.get(receiverId);
        if (receiverInfo) {
          io.to(receiverInfo.socketId).emit('message_notification', {
            senderId,
            senderName: message.senderId.name,
            content,
            roomId
          });
        }
        
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle message editing
    socket.on('edit_message', async (data) => {
      try {
        const { messageId, content, userId } = data;
        
        const message = await ChatMessage.findOneAndUpdate(
          { _id: messageId, senderId: userId },
          { content, isEdited: true, editedAt: new Date() },
          { new: true }
        ).populate('senderId', 'name email role').populate('receiverId', 'name email role');
        
        if (message) {
          io.to(message.roomId).emit('message_edited', message);
        }
      } catch (error) {
        console.error('Error editing message:', error);
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
        console.error('Error deleting message:', error);
      }
    });

    // Handle marking messages as read
    socket.on('mark_read', async (data) => {
      try {
        const { messageId, userId } = data;
        
        await ChatMessage.findByIdAndUpdate(messageId, { isRead: true });
        
        const message = await ChatMessage.findById(messageId);
        if (message) {
          io.to(message.roomId).emit('message_read', { messageId });
        }
      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    });

    // Handle call initiation
    socket.on('initiate_call', (data) => {
      const { callerId, receiverId, callType } = data;
      const receiverInfo = activeUsers.get(receiverId);
      
      if (receiverInfo) {
        io.to(receiverInfo.socketId).emit('incoming_call', {
          callerId,
          callType,
          callerSocketId: socket.id
        });
      } else {
        socket.emit('call_failed', { reason: 'User is offline' });
      }
    });

    // Handle call response
    socket.on('call_response', (data) => {
      const { targetSocketId, accepted, callData } = data;
      io.to(targetSocketId).emit('call_response', { accepted, callData });
    });

    // Handle call signaling
    socket.on('call_signal', (data) => {
      const { targetSocketId, signal } = data;
      io.to(targetSocketId).emit('call_signal', { signal });
    });

    // Handle call end
    socket.on('end_call', (data) => {
      const { targetSocketId } = data;
      io.to(targetSocketId).emit('call_ended');
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      const userId = userSockets.get(socket.id);
      if (userId) {
        activeUsers.delete(userId);
        userSockets.delete(socket.id);
        
        // Notify others that user is offline
        socket.broadcast.emit('user_offline', { userId });
        console.log('User disconnected:', userId);
      }
    });
  });
};

module.exports = { handleSocketConnection };
