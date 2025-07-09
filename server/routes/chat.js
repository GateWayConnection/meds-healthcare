
const express = require('express');
const router = express.Router();
const ChatMessage = require('../models/ChatMessage');
const ChatRoom = require('../models/ChatRoom');
const auth = require('../middleware/auth');

// Get user's chat rooms
router.get('/rooms', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const rooms = await ChatRoom.find({
      participants: userId
    })
    .populate('participants', 'name email role')
    .populate({
      path: 'lastMessage',
      populate: {
        path: 'senderId receiverId',
        select: 'name email role'
      }
    })
    .sort({ lastActivity: -1 });
    
    res.json(rooms);
  } catch (error) {
    console.error('Error fetching chat rooms:', error);
    res.status(500).json({ error: 'Failed to fetch chat rooms' });
  }
});

// Get messages for a specific room
router.get('/messages/:roomId', auth, async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user.userId;
    
    // Verify user is part of this room
    const room = await ChatRoom.findOne({
      participants: userId,
      _id: roomId
    });
    
    if (!room) {
      return res.status(403).json({ error: 'Access denied to this chat room' });
    }
    
    const messages = await ChatMessage.find({ roomId })
      .populate('senderId', 'name email role')
      .populate('receiverId', 'name email role')
      .sort({ createdAt: 1 });
    
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Send a message
router.post('/messages', auth, async (req, res) => {
  try {
    const { receiverId, content, type = 'text' } = req.body;
    const senderId = req.user.userId;
    
    // Create room ID
    const roomId = [senderId, receiverId].sort().join('-');
    
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
    
    res.json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Create or get existing chat room
router.post('/rooms/create', auth, async (req, res) => {
  try {
    const { participantId } = req.body;
    const userId = req.user.userId;
    
    let room = await ChatRoom.findOne({
      participants: { $all: [userId, participantId] }
    })
    .populate('participants', 'name email role')
    .populate({
      path: 'lastMessage',
      populate: {
        path: 'senderId receiverId',
        select: 'name email role'
      }
    });
    
    if (!room) {
      room = new ChatRoom({
        participants: [userId, participantId],
        lastActivity: new Date()
      });
      
      await room.save();
      
      await room.populate('participants', 'name email role');
    }
    
    res.json(room);
  } catch (error) {
    console.error('Error creating chat room:', error);
    res.status(500).json({ error: 'Failed to create chat room' });
  }
});

// Edit a message
router.put('/messages/:messageId', auth, async (req, res) => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;
    const userId = req.user.userId;
    
    const message = await ChatMessage.findOneAndUpdate(
      { _id: messageId, senderId: userId },
      { content, isEdited: true, editedAt: new Date() },
      { new: true }
    )
    .populate('senderId', 'name email role')
    .populate('receiverId', 'name email role');
    
    if (!message) {
      return res.status(404).json({ error: 'Message not found or unauthorized' });
    }
    
    res.json(message);
  } catch (error) {
    console.error('Error editing message:', error);
    res.status(500).json({ error: 'Failed to edit message' });
  }
});

// Delete a message
router.delete('/messages/:messageId', auth, async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.userId;
    
    const message = await ChatMessage.findOneAndDelete({
      _id: messageId,
      senderId: userId
    });
    
    if (!message) {
      return res.status(404).json({ error: 'Message not found or unauthorized' });
    }
    
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

// Mark message as read
router.post('/messages/:messageId/read', auth, async (req, res) => {
  try {
    const { messageId } = req.params;
    
    await ChatMessage.findByIdAndUpdate(messageId, { isRead: true });
    
    res.json({ message: 'Message marked as read' });
  } catch (error) {
    console.error('Error marking message as read:', error);
    res.status(500).json({ error: 'Failed to mark message as read' });
  }
});

module.exports = router;
