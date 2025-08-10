const Joi = require('joi');

// Validation schemas
const schemas = {
  // Auth validation schemas
  register: Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  // Post validation schemas
  createPost: Joi.object({
    title: Joi.string().min(5).max(200).required(),
    content: Joi.string().required(),
    type: Joi.string().valid('article', 'question', 'project', 'resource').required(),
    tags: Joi.array().items(Joi.string()),
    status: Joi.string().valid('draft', 'published', 'archived'),
  }),

  // Project validation schemas
  createProject: Joi.object({
    name: Joi.string().min(3).max(100).required(),
    description: Joi.string().required(),
    tags: Joi.array().items(Joi.string()),
    status: Joi.string().valid('planning', 'in-progress', 'completed', 'on-hold'),
    visibility: Joi.string().valid('public', 'private'),
    links: Joi.object({
      github: Joi.string().uri().allow(''),
      website: Joi.string().uri().allow(''),
      demo: Joi.string().uri().allow(''),
    }),
  }),

  // Comment validation schemas
  createComment: Joi.object({
    content: Joi.string().required(),
    parentComment: Joi.string().hex().length(24).optional(),
  }),

  // Message validation schemas
  sendMessage: Joi.object({
    content: Joi.string().required(),
    receiver: Joi.string().hex().length(24).required(),
  }),

  // User profile update schema
  updateProfile: Joi.object({
    name: Joi.string().min(2).max(50),
    bio: Joi.string().max(250),
    skills: Joi.array().items(Joi.string()),
    github: Joi.string().uri().allow(''),
    linkedin: Joi.string().uri().allow(''),
  }),
};

// Validation middleware
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      allowUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path[0],
        message: detail.message,
      }));

      return res.status(400).json({
        success: false,
        errors,
      });
    }

    next();
  };
};

module.exports = {
  validate,
  schemas,
};
