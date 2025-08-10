const asyncHandler = require('express-async-handler');
const Post = require('../models/Post');
const { cloudinaryUtils } = require('../utils/uploadHandler');

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
exports.createPost = asyncHandler(async (req, res) => {
  const { title, content, type, tags, status } = req.body;
  let media = [];

  // Handle media uploads if any
  if (req.files && req.files.length > 0) {
    media = await Promise.all(
      req.files.map(async (file) => {
        const result = await cloudinaryUtils.uploadFile(file, {
          folder: `devconnect/posts/${req.user._id}`
        });
        return {
          url: result.url,
          publicId: result.publicId,
          type: file.mimetype.startsWith('image/') ? 'image' : 'document'
        };
      })
    );
  }

  const post = await Post.create({
    author: req.user._id,
    title,
    content,
    type,
    tags,
    media,
    status: status || 'published'
  });

  res.status(201).json({
    success: true,
    data: post
  });
});

// @desc    Get all posts with filters and pagination
// @route   GET /api/posts
// @access  Public
exports.getPosts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;

  const query = { status: 'published' };

  // Add filters
  if (req.query.type) query.type = req.query.type;
  if (req.query.tags) query.tags = { $in: req.query.tags.split(',') };
  if (req.query.author) query.author = req.query.author;

  // Search functionality
  if (req.query.search) {
    query.$or = [
      { title: { $regex: req.query.search, $options: 'i' } },
      { content: { $regex: req.query.search, $options: 'i' } },
      { tags: { $regex: req.query.search, $options: 'i' } }
    ];
  }

  const posts = await Post.find(query)
    .populate('author', 'name avatar')
    .sort({ createdAt: -1 })
    .skip(startIndex)
    .limit(limit)
    .lean();

  // Get total count for pagination
  const total = await Post.countDocuments(query);

  res.json({
    success: true,
    data: posts,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

// @desc    Get single post by ID
// @route   GET /api/posts/:id
// @access  Public
exports.getPost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate('author', 'name avatar bio')
    .populate({
      path: 'comments',
      populate: {
        path: 'author',
        select: 'name avatar'
      }
    });

  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  // Increment views
  post.views += 1;
  await post.save();

  res.json({
    success: true,
    data: post
  });
});

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
exports.updatePost = asyncHandler(async (req, res) => {
  let post = await Post.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  // Check ownership
  if (post.author.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this post');
  }

  // Handle new media uploads
  if (req.files && req.files.length > 0) {
    const newMedia = await Promise.all(
      req.files.map(async (file) => {
        const result = await cloudinaryUtils.uploadFile(file, {
          folder: `devconnect/posts/${req.user._id}`
        });
        return {
          url: result.url,
          publicId: result.publicId,
          type: file.mimetype.startsWith('image/') ? 'image' : 'document'
        };
      })
    );
    req.body.media = [...(post.media || []), ...newMedia];
  }

  // Remove media if specified
  if (req.body.removeMedia) {
    const removeIds = req.body.removeMedia.split(',');
    await Promise.all(
      removeIds.map(async (publicId) => {
        await cloudinaryUtils.deleteFile(publicId);
      })
    );
    post.media = post.media.filter(m => !removeIds.includes(m.publicId));
  }

  post = await Post.findByIdAndUpdate(
    req.params.id,
    { ...req.body },
    { new: true, runValidators: true }
  );

  res.json({
    success: true,
    data: post
  });
});

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
exports.deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  // Check ownership
  if (post.author.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this post');
  }

  // Delete associated media from Cloudinary
  if (post.media && post.media.length > 0) {
    await Promise.all(
      post.media.map(async (media) => {
        await cloudinaryUtils.deleteFile(media.publicId);
      })
    );
  }

  await post.remove();

  res.json({
    success: true,
    data: {}
  });
});

// @desc    Like/Unlike post
// @route   PUT /api/posts/:id/like
// @access  Private
exports.toggleLike = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  const liked = post.likes.includes(req.user._id);

  if (liked) {
    // Unlike
    post.likes = post.likes.filter(
      like => like.toString() !== req.user._id.toString()
    );
  } else {
    // Like
    post.likes.push(req.user._id);
  }

  await post.save();

  res.json({
    success: true,
    liked: !liked
  });
});
