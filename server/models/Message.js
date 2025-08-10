const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  attachments: [{
    type: String, // URLs to files
    trim: true
  }],
  read: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for querying conversations
messageSchema.index({ sender: 1, receiver: 1 });
messageSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Message', messageSchema);
