const mongoose = require('mongoose');

const chatRoomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxLength: 100
  },
  description: {
    type: String,
    maxLength: 500
  },
  type: {
    type: String,
    enum: ['public', 'private', 'direct'],
    default: 'public'
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['admin', 'moderator', 'member'],
      default: 'member'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    lastRead: {
      type: Date,
      default: Date.now
    }
  }],
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  settings: {
    allowFileUploads: {
      type: Boolean,
      default: true
    },
    maxMembers: {
      type: Number,
      default: 100
    },
    isArchived: {
      type: Boolean,
      default: false
    }
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for message count
chatRoomSchema.virtual('messageCount', {
  ref: 'Message',
  localField: '_id',
  foreignField: 'chatRoom',
  count: true
});

// Virtual for member count
chatRoomSchema.virtual('memberCount').get(function() {
  return this.participants.length;
});

// Indexes
chatRoomSchema.index({ type: 1, lastActivity: -1 });
chatRoomSchema.index({ 'participants.user': 1 });
chatRoomSchema.index({ creator: 1 });

module.exports = mongoose.model('ChatRoom', chatRoomSchema);