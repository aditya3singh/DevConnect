const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxLength: 200
  },
  content: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['article', 'question', 'project', 'resource']
  },
  tags: [{
    type: String,
    trim: true
  }],
  media: [{
    url: String,
    type: String, // image, video, document
    publicId: String // Cloudinary public ID
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  bookmarks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  views: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'published'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for comments
postSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'post'
});

// Indexes for efficient querying
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ tags: 1 });
postSchema.index({ title: 'text', content: 'text' });

module.exports = mongoose.model('Post', postSchema);
