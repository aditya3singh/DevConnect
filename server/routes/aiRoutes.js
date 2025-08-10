const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const openaiService = require('../services/openaiService');
const asyncHandler = require('express-async-handler');

// @desc    Generate AI response
// @route   POST /api/ai/chat
// @access  Private
router.post('/chat', protect, asyncHandler(async (req, res) => {
  const { message, category = 'general', context = {} } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Message is required'
    });
  }

  try {
    const response = await openaiService.generateResponse(message, category, context);
    
    res.json({
      success: true,
      data: {
        response,
        category,
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate AI response'
    });
  }
}));

// @desc    Generate blog title suggestions
// @route   POST /api/ai/blog-title
// @access  Private
router.post('/blog-title', protect, asyncHandler(async (req, res) => {
  const { content, tags = [] } = req.body;

  if (!content || !content.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Content is required'
    });
  }

  try {
    const titles = await openaiService.generateBlogTitle(content, tags);
    
    res.json({
      success: true,
      data: {
        titles: titles.split('\n').filter(title => title.trim()),
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error('Blog title generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate blog titles'
    });
  }
}));

// @desc    Generate content tags
// @route   POST /api/ai/tags
// @access  Private
router.post('/tags', protect, asyncHandler(async (req, res) => {
  const { content, maxTags = 5 } = req.body;

  if (!content || !content.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Content is required'
    });
  }

  try {
    const tags = await openaiService.generateTags(content, maxTags);
    
    res.json({
      success: true,
      data: {
        tags,
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error('Tag generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate tags'
    });
  }
}));

// @desc    Explain code
// @route   POST /api/ai/explain-code
// @access  Private
router.post('/explain-code', protect, asyncHandler(async (req, res) => {
  const { code, language = 'javascript' } = req.body;

  if (!code || !code.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Code is required'
    });
  }

  try {
    const explanation = await openaiService.generateCodeExplanation(code, language);
    
    res.json({
      success: true,
      data: {
        explanation,
        language,
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error('Code explanation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to explain code'
    });
  }
}));

// @desc    Generate project idea
// @route   POST /api/ai/project-idea
// @access  Private
router.post('/project-idea', protect, asyncHandler(async (req, res) => {
  const { skills = [], interests = [], difficulty = 'intermediate' } = req.body;

  try {
    const projectIdea = await openaiService.generateProjectIdea(skills, interests, difficulty);
    
    res.json({
      success: true,
      data: {
        projectIdea,
        skills,
        interests,
        difficulty,
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error('Project idea generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate project idea'
    });
  }
}));

// @desc    Get AI usage statistics for user
// @route   GET /api/ai/stats
// @access  Private
router.get('/stats', protect, asyncHandler(async (req, res) => {
  // This would typically fetch from a usage tracking collection
  // For now, return mock data
  res.json({
    success: true,
    data: {
      totalQueries: 45,
      queriesThisMonth: 12,
      favoriteCategory: 'coding',
      lastUsed: new Date(),
      categories: {
        coding: 18,
        blog: 12,
        project: 8,
        career: 4,
        resources: 3
      }
    }
  });
}));

module.exports = router;