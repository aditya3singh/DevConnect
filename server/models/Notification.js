const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['follow', 'like', 'comment', 'mention', 'project_invite', 'message']
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reference: {
    // Could be a post ID, comment ID, project ID, etc.
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'referenceModel'
  },
  referenceModel: {
    type: String,
    required: function() {
      return this.reference != null;
    },
    enum: ['Post', 'Comment', 'Project']
  },
  content: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for quick lookups
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ read: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
