const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const ChatRoom = require("../models/ChatRoom");
const Message = require("../models/Message");

// @desc Get user's chat rooms
// @route GET /api/chat/rooms
// @access Private
router.get("/rooms", protect, async (req, res) => {
  try {
    const rooms = await ChatRoom.find({
      'participants.user': req.user._id
    })
    .populate('participants.user', 'name avatar')
    .populate('lastMessage')
    .sort({ lastActivity: -1 });

    res.json({
      success: true,
      data: rooms,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @desc Create new chat room
// @route POST /api/chat/rooms
// @access Private
router.post("/rooms", protect, async (req, res) => {
  try {
    const { name, description, type, participants, isPrivate } = req.body;

    // Add creator as admin
    const roomParticipants = [
      {
        user: req.user._id,
        role: 'admin',
      },
      ...(participants || []).map(userId => ({
        user: userId,
        role: 'member',
      }))
    ];

    const room = await ChatRoom.create({
      name,
      description,
      type,
      participants: roomParticipants,
      isPrivate: isPrivate || false,
    });

    await room.populate('participants.user', 'name avatar');

    res.status(201).json({
      success: true,
      data: room,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// @desc Get messages for a chat room
// @route GET /api/chat/rooms/:roomId/messages
// @access Private
router.get("/rooms/:roomId/messages", protect, async (req, res) => {
  try {
    const { roomId } = req.params;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const skip = (page - 1) * limit;

    // Check if user is participant
    const room = await ChatRoom.findOne({
      _id: roomId,
      'participants.user': req.user._id
    });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Chat room not found or access denied',
      });
    }

    const messages = await Message.find({ chatRoom: roomId })
      .populate('sender', 'name avatar')
      .populate('replyTo')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Message.countDocuments({ chatRoom: roomId });

    res.json({
      success: true,
      data: messages.reverse(), // Reverse to show oldest first
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @desc Join chat room
// @route POST /api/chat/rooms/:roomId/join
// @access Private
router.post("/rooms/:roomId/join", protect, async (req, res) => {
  try {
    const { roomId } = req.params;

    const room = await ChatRoom.findById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Chat room not found',
      });
    }

    // Check if already a participant
    const isParticipant = room.participants.some(
      p => p.user.toString() === req.user._id.toString()
    );

    if (isParticipant) {
      return res.status(400).json({
        success: false,
        message: 'Already a member of this room',
      });
    }

    // Check if room is private
    if (room.isPrivate) {
      return res.status(403).json({
        success: false,
        message: 'Cannot join private room without invitation',
      });
    }

    room.participants.push({
      user: req.user._id,
      role: 'member',
    });

    await room.save();
    await room.populate('participants.user', 'name avatar');

    res.json({
      success: true,
      data: room,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @desc Leave chat room
// @route POST /api/chat/rooms/:roomId/leave
// @access Private
router.post("/rooms/:roomId/leave", protect, async (req, res) => {
  try {
    const { roomId } = req.params;

    const room = await ChatRoom.findById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Chat room not found',
      });
    }

    room.participants = room.participants.filter(
      p => p.user.toString() !== req.user._id.toString()
    );

    await room.save();

    res.json({
      success: true,
      message: 'Left chat room successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;