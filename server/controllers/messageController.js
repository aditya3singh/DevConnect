const asyncHandler = require('express-async-handler');
const Message = require('../models/Message');
const User = require('../models/User');
const { cloudinaryUtils } = require('../utils/uploadHandler');

// @desc    Send a new message
// @route   POST /api/messages
// @access  Private
exports.sendMessage = asyncHandler(async (req, res) => {
  const { receiver, content } = req.body;
  let attachments = [];

  // Handle file attachments
  if (req.files && req.files.length > 0) {
    attachments = await Promise.all(
      req.files.map(async (file) => {
        const result = await cloudinaryUtils.uploadFile(file, {
          folder: `devconnect/messages/${req.user._id}`
        });
        return result.url;
      })
    );
  }

  const message = await Message.create({
    sender: req.user._id,
    receiver,
    content,
    attachments
  });

  // Populate sender and receiver info
  await message.populate('sender', 'name avatar');
  await message.populate('receiver', 'name avatar');

  // Emit socket event for real-time messaging
  req.io.to(`user:${receiver}`).emit('message:received', message);

  res.status(201).json({
    success: true,
    data: message
  });
});

// @desc    Get conversation messages
// @route   GET /api/messages/:userId
// @access  Private
exports.getConversation = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const startIndex = (page - 1) * limit;

  const messages = await Message.find({
    $or: [
      { sender: req.user._id, receiver: req.params.userId },
      { sender: req.params.userId, receiver: req.user._id }
    ]
  })
    .populate('sender', 'name avatar')
    .populate('receiver', 'name avatar')
    .sort('-createdAt')
    .skip(startIndex)
    .limit(limit);

  // Mark messages as read
  await Message.updateMany(
    {
      sender: req.params.userId,
      receiver: req.user._id,
      read: false
    },
    { read: true }
  );

  const total = await Message.countDocuments({
    $or: [
      { sender: req.user._id, receiver: req.params.userId },
      { sender: req.params.userId, receiver: req.user._id }
    ]
  });

  res.json({
    success: true,
    data: messages.reverse(),
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

// @desc    Get user conversations list
// @route   GET /api/messages
// @access  Private
exports.getConversations = asyncHandler(async (req, res) => {
  // Get the last message from each conversation
  const conversations = await Message.aggregate([
    {
      $match: {
        $or: [
          { sender: req.user._id },
          { receiver: req.user._id }
        ]
      }
    },
    {
      $sort: { createdAt: -1 }
    },
    {
      $group: {
        _id: {
          $cond: [
            { $eq: ['$sender', req.user._id] },
            '$receiver',
            '$sender'
          ]
        },
        lastMessage: { $first: '$$ROOT' },
        unreadCount: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ['$receiver', req.user._id] },
                  { $eq: ['$read', false] }
                ]
              },
              1,
              0
            ]
          }
        }
      }
    },
    {
      $sort: { 'lastMessage.createdAt': -1 }
    }
  ]);

  // Get user details for each conversation
  const conversationsWithUserDetails = await Promise.all(
    conversations.map(async (conv) => {
      const user = await User.findById(conv._id).select('name avatar');
      return {
        user,
        lastMessage: conv.lastMessage,
        unreadCount: conv.unreadCount
      };
    })
  );

  res.json({
    success: true,
    data: conversationsWithUserDetails
  });
});

// @desc    Delete message
// @route   DELETE /api/messages/:messageId
// @access  Private
exports.deleteMessage = asyncHandler(async (req, res) => {
  const message = await Message.findById(req.params.messageId);

  if (!message) {
    res.status(404);
    throw new Error('Message not found');
  }

  // Check ownership
  if (message.sender.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this message');
  }

  // Delete attachments from Cloudinary if any
  if (message.attachments && message.attachments.length > 0) {
    await Promise.all(
      message.attachments.map(async (url) => {
        const publicId = url.split('/').slice(-1)[0].split('.')[0];
        await cloudinaryUtils.deleteFile(`devconnect/messages/${req.user._id}/${publicId}`);
      })
    );
  }

  await message.remove();

  res.json({
    success: true,
    data: {}
  });
});
