const rateLimit = require('express-rate-limit');

// Rate limit configurations
const rateLimitConfig = {
  // General API rate limit
  api: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes'
  }),

  // Auth endpoints rate limit (stricter)
  auth: rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // limit each IP to 5 requests per windowMs
    message: 'Too many login attempts, please try again after an hour'
  }),

  // File upload rate limit
  upload: rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // limit each IP to 10 file uploads per hour
    message: 'File upload limit reached, please try again after an hour'
  })
};

// API key validation middleware
const apiKeyAuth = (req, res, next) => {
  const apiKey = req.header('X-API-Key');
  
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or missing API key'
    });
  }
  
  next();
};

// Request sanitization middleware
const sanitizeRequest = (req, res, next) => {
  // Function to sanitize a single value
  const sanitizeValue = (value) => {
    if (typeof value === 'string') {
      // Remove any potentially harmful characters
      return value.replace(/[<>]/g, '');
    }
    return value;
  };

  // Function to recursively sanitize an object
  const sanitizeObject = (obj) => {
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'object' && value !== null) {
        sanitized[key] = sanitizeObject(value);
      } else {
        sanitized[key] = sanitizeValue(value);
      }
    }
    return sanitized;
  };

  // Sanitize body, query, and params
  if (req.body) req.body = sanitizeObject(req.body);
  if (req.query) req.query = sanitizeObject(req.query);
  if (req.params) req.params = sanitizeObject(req.params);

  next();
};

// Request logging middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  // Log when the request completes
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} [${res.statusCode}] - ${duration}ms`);
  });

  next();
};

module.exports = {
  rateLimitConfig,
  apiKeyAuth,
  sanitizeRequest,
  requestLogger
};
