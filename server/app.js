const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const jwt = require("jsonwebtoken");
const { createServer } = require("http");
const { Server } = require("socket.io");
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
require("dotenv").config();

// Import middleware
const { rateLimitConfig, apiKeyAuth, sanitizeRequest, requestLogger } = require('./middleware/securityMiddleware');
const { initializeSocket } = require('./socket/socketHandler');

const app = express();
const httpServer = createServer(app);

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}));

// Apply rate limiters to specific routes
app.use('/api/', rateLimitConfig.api);
app.use('/api/auth/', rateLimitConfig.auth);
app.use('/api/upload/', rateLimitConfig.upload);

// Request processing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(sanitizeRequest);
app.use(requestLogger);

// Socket.IO setup with authentication
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Socket authentication middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
});

// Initialize Socket.IO event handlers
initializeSocket(io);

// Make io accessible to routes
app.set('io', io);

// Additional security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.get("/", (req, res) => {
  res.json({
    message: "DevConnect API is running...",
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const projectRoutes = require("./routes/projectRoutes");
const messageRoutes = require("./routes/messageRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const aiRoutes = require("./routes/aiRoutes");
const chatRoutes = require("./routes/chatRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/chat", chatRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: Object.values(err.errors).map(e => e.message)
    });
  }
  
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired'
    });
  }

  // Default error
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === "production"
      ? "Internal server error"
      : err.message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack })
  });
});

module.exports = { app, httpServer };
