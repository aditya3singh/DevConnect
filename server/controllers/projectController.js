const asyncHandler = require('express-async-handler');
const Project = require('../models/Project');
const { cloudinaryUtils } = require('../utils/uploadHandler');

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private
exports.createProject = asyncHandler(async (req, res) => {
  const { name, description, tags, status, visibility, links } = req.body;

  // Handle thumbnail upload
  let thumbnail = {};
  if (req.file) {
    const result = await cloudinaryUtils.uploadFile(req.file, {
      folder: 'devconnect/projects/thumbnails'
    });
    thumbnail = {
      url: result.url,
      publicId: result.publicId
    };
  }

  const project = await Project.create({
    name,
    description,
    owner: req.user._id,
    members: [{ user: req.user._id, role: 'owner' }],
    tags,
    status,
    visibility,
    links,
    thumbnail
  });

  res.status(201).json({
    success: true,
    data: project
  });
});

// @desc    Get all projects with filters
// @route   GET /api/projects
// @access  Public
exports.getProjects = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;

  let query = { visibility: 'public' };

  // Add filters
  if (req.query.status) query.status = req.query.status;
  if (req.query.tags) query.tags = { $in: req.query.tags.split(',') };
  
  // If authenticated user, include their private projects
  if (req.user) {
    query = {
      $or: [
        { visibility: 'public' },
        { 'members.user': req.user._id }
      ]
    };
  }

  // Search functionality
  if (req.query.search) {
    const searchQuery = { $regex: req.query.search, $options: 'i' };
    query.$or = [
      { name: searchQuery },
      { description: searchQuery },
      { tags: searchQuery }
    ];
  }

  const projects = await Project.find(query)
    .populate('owner', 'name avatar')
    .populate('members.user', 'name avatar')
    .sort({ createdAt: -1 })
    .skip(startIndex)
    .limit(limit);

  const total = await Project.countDocuments(query);

  res.json({
    success: true,
    data: projects,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public/Private
exports.getProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate('owner', 'name avatar bio')
    .populate('members.user', 'name avatar bio');

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  // Check if private project and user has access
  if (project.visibility === 'private') {
    if (!req.user || !project.members.some(m => m.user._id.toString() === req.user._id.toString())) {
      res.status(403);
      throw new Error('Not authorized to view this project');
    }
  }

  res.json({
    success: true,
    data: project
  });
});

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
exports.updateProject = asyncHandler(async (req, res) => {
  let project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  // Check if user is owner or admin
  const member = project.members.find(m => m.user.toString() === req.user._id.toString());
  if (!member || !['owner', 'admin'].includes(member.role)) {
    res.status(403);
    throw new Error('Not authorized to update this project');
  }

  // Handle new thumbnail upload
  if (req.file) {
    // Delete old thumbnail if exists
    if (project.thumbnail?.publicId) {
      await cloudinaryUtils.deleteFile(project.thumbnail.publicId);
    }

    const result = await cloudinaryUtils.uploadFile(req.file, {
      folder: 'devconnect/projects/thumbnails'
    });
    req.body.thumbnail = {
      url: result.url,
      publicId: result.publicId
    };
  }

  project = await Project.findByIdAndUpdate(
    req.params.id,
    { ...req.body },
    { new: true, runValidators: true }
  );

  res.json({
    success: true,
    data: project
  });
});

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
exports.deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  // Check if user is owner
  const member = project.members.find(m => m.user.toString() === req.user._id.toString());
  if (!member || member.role !== 'owner') {
    res.status(403);
    throw new Error('Not authorized to delete this project');
  }

  // Delete thumbnail if exists
  if (project.thumbnail?.publicId) {
    await cloudinaryUtils.deleteFile(project.thumbnail.publicId);
  }

  await project.remove();

  res.json({
    success: true,
    data: {}
  });
});

// @desc    Add member to project
// @route   POST /api/projects/:id/members
// @access  Private
exports.addMember = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  const { userId, role = 'member' } = req.body;

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  // Check if user is owner or admin
  const member = project.members.find(m => m.user.toString() === req.user._id.toString());
  if (!member || !['owner', 'admin'].includes(member.role)) {
    res.status(403);
    throw new Error('Not authorized to add members');
  }

  // Check if user is already a member
  if (project.members.some(m => m.user.toString() === userId)) {
    res.status(400);
    throw new Error('User is already a member');
  }

  project.members.push({ user: userId, role });
  await project.save();

  res.json({
    success: true,
    data: project
  });
});

// @desc    Remove member from project
// @route   DELETE /api/projects/:id/members/:userId
// @access  Private
exports.removeMember = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  // Check if user is owner or admin
  const member = project.members.find(m => m.user.toString() === req.user._id.toString());
  if (!member || !['owner', 'admin'].includes(member.role)) {
    res.status(403);
    throw new Error('Not authorized to remove members');
  }

  // Cannot remove owner
  const targetMember = project.members.find(m => m.user.toString() === req.params.userId);
  if (targetMember?.role === 'owner') {
    res.status(400);
    throw new Error('Cannot remove project owner');
  }

  project.members = project.members.filter(m => m.user.toString() !== req.params.userId);
  await project.save();

  res.json({
    success: true,
    data: project
  });
});
