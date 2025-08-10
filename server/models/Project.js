const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['owner', 'admin', 'member'],
      default: 'member'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  tags: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['planning', 'in-progress', 'completed', 'on-hold'],
    default: 'planning'
  },
  visibility: {
    type: String,
    enum: ['public', 'private'],
    default: 'public'
  },
  links: {
    github: String,
    website: String,
    demo: String
  },
  thumbnail: {
    url: String,
    publicId: String
  }
}, {
  timestamps: true
});

// Indexes
projectSchema.index({ owner: 1 });
projectSchema.index({ 'members.user': 1 });
projectSchema.index({ name: 'text', description: 'text' });
projectSchema.index({ tags: 1 });

module.exports = mongoose.model('Project', projectSchema);
