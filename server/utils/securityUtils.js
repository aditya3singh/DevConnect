const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Generate secure random string
const generateSecureToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

// Hash sensitive data
const hashData = async (data) => {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(data, salt);
};

// Compare hashed data
const compareHash = async (data, hash) => {
  return bcrypt.compare(data, hash);
};

// Generate JWT with refresh token
const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );

  const refreshToken = generateSecureToken();
  return { accessToken, refreshToken };
};

// Validate password strength
const isStrongPassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return (
    password.length >= minLength &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumbers &&
    hasSpecialChar
  );
};

// Sanitize user input
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove inline event handlers
    .trim();
};

// Generate secure filename
const generateSecureFilename = (originalname) => {
  const timestamp = Date.now();
  const random = crypto.randomBytes(8).toString('hex');
  const extension = originalname.split('.').pop();
  return `${timestamp}-${random}.${extension}`;
};

// Rate limiting helper
const createRateLimiter = (windowMs, max, message) => {
  return {
    windowMs,
    max,
    message: { success: false, message },
    skipSuccessfulRequests: true,
    keyGenerator: (req) => {
      // Use both IP and user ID (if available) for rate limiting
      return req.user ? `${req.ip}-${req.user.id}` : req.ip;
    },
  };
};

module.exports = {
  generateSecureToken,
  hashData,
  compareHash,
  generateTokens,
  isStrongPassword,
  sanitizeInput,
  generateSecureFilename,
  createRateLimiter,
};
