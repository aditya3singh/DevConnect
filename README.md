# 🚀 DevConnect - Multi-Functional Developer Platform

<div align="center">

![DevConnect Logo](https://via.placeholder.com/200x100/3B82F6/FFFFFF?text=DevConnect)

**Where Developers Meet, Collaborate, and Grow in Real Time**

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0+-green.svg)](https://mongodb.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.7.2-black.svg)](https://socket.io/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-orange.svg)](https://openai.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[🌐 Live Demo](https://devconnect-demo.vercel.app) • [📖 Documentation](#documentation) • [🐛 Report Issues](../../issues) • [✨ Request Features](../../issues)

</div>

---

## 🌟 Overview

DevConnect is a comprehensive developer platform that combines the best features of **LinkedIn**, **Stack Overflow**, **Discord**, and **Notion** into one powerful application. Built with modern technologies, it provides developers with everything they need to connect, collaborate, and grow their careers.

### ✨ Key Features

- 🔐 **Secure Authentication** - JWT-based auth with email verification
- 🤖 **AI-Powered Assistant** - OpenAI integration for coding help and content generation
- 💬 **Real-Time Chat** - Multi-room chat with Socket.IO
- 📝 **Content Management** - Blog posts, projects, and resource sharing
- 🎨 **Modern UI/UX** - Responsive design with Tailwind CSS and Framer Motion
- 📊 **Developer Feed** - Social feed with posts, questions, and projects
- 🛠️ **Project Management** - Complete project lifecycle management
- ☁️ **File Upload** - Cloudinary integration for media handling
- 🌙 **Dark Mode** - System preference detection
- 📱 **Mobile Responsive** - Works perfectly on all devices

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and context
- **Redux Toolkit** - State management with RTK Query
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **Heroicons** - Beautiful SVG icon library
- **Axios** - Promise-based HTTP client

### Backend
- **Node.js 18+** - JavaScript runtime environment
- **Express.js** - Minimal web application framework
- **MongoDB** - NoSQL document database
- **Mongoose** - MongoDB object modeling library
- **Socket.IO** - Real-time bidirectional communication
- **JWT** - Secure token-based authentication
- **Bcrypt** - Password hashing library
- **Multer** - Middleware for handling multipart/form-data
- **Cloudinary SDK** - Cloud-based media management

### AI & External Services
- **OpenAI API** - GPT-4 integration for AI assistant
- **Cloudinary** - Cloud storage for images and files
- **Nodemailer** - Email sending capabilities
- **SendGrid** - Email delivery service (optional)

### DevOps & Deployment
- **Docker** - Application containerization
- **GitHub Actions** - Continuous Integration/Deployment
- **Vercel** - Frontend hosting and deployment
- **Railway/Render** - Backend hosting solutions
- **MongoDB Atlas** - Cloud database service

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18 or higher
- **MongoDB** (local installation or Atlas account)
- **npm** or **yarn** package manager
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/devconnect.git
   cd devconnect
   ```

2. **Install dependencies**
   ```bash
   # Install all dependencies for both client and server
   npm run install-all
   
   # Or install individually
   npm install
   cd client && npm install
   cd ../server && npm install
   ```

3. **Environment Configuration**
   
   Create environment files from templates:
   ```bash
   cp .env.example .env
   cp server/.env.example server/.env
   cp client/.env.example client/.env
   ```

4. **Configure environment variables**
   
   **Server Environment (.env in server directory):**
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # Database
   MONGODB_URI=mongodb://localhost:27017/devconnect
   # For MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/devconnect
   
   # Authentication
   JWT_SECRET=your_super_secure_jwt_secret_key_here
   JWT_EXPIRE=30d
   
   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   
   # OpenAI Configuration
   OPENAI_API_KEY=your_openai_api_key
   
   # Client Configuration
   CLIENT_URL=http://localhost:3000
   
   # Email Configuration (optional)
   EMAIL_FROM=noreply@devconnect.com
   SENDGRID_API_KEY=your_sendgrid_api_key
   ```

   **Client Environment (.env in client directory):**
   ```env
   # API Configuration
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_SOCKET_URL=http://localhost:5000
   
   # Feature Flags
   REACT_APP_ENABLE_AI=true
   REACT_APP_ENABLE_CHAT=true
   ```

5. **Start the development servers**
   ```bash
   # Start both client and server concurrently
   npm run dev
   
   # Or start individually
   npm run server    # Backend only
   npm run client    # Frontend only
   ```

6. **Access the application**
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:5000
   - **API Health Check**: http://localhost:5000/api/health

## 📁 Project Structure

```
devconnect/
├── client/                     # React Frontend Application
│   ├── public/
│   │   ├── index.html         # Main HTML template
│   │   └── favicon.ico        # Application favicon
│   └── src/
│       ├── components/         # Reusable React components
│       │   ├── ai/            # AI Assistant components
│       │   ├── auth/          # Authentication forms
│       │   ├── blog/          # Blog management
│       │   ├── chat/          # Real-time chat interface
│       │   ├── dashboard/     # User dashboard
│       │   ├── feed/          # Social feed components
│       │   ├── projects/      # Project management
│       │   ├── settings/      # User settings
│       │   └── ui/            # Base UI components
│       ├── hooks/             # Custom React hooks
│       ├── services/          # API service functions
│       ├── store/             # Redux store configuration
│       │   └── features/      # Redux slices
│       ├── utils/             # Utility functions
│       ├── styles/            # Global styles
│       └── App.js             # Root component
├── server/                    # Express Backend Application
│   ├── config/               # Configuration files
│   │   ├── database.js       # MongoDB connection
│   │   └── cloudinary.js     # Cloudinary setup
│   ├── controllers/          # Request handlers
│   ├── middleware/           # Custom middleware functions
│   ├── models/              # Mongoose schemas
│   ├── routes/              # API route definitions
│   ├── services/            # Business logic layer
│   ├── socket/              # Socket.IO event handlers
│   ├── utils/               # Server utility functions
│   └── server.js            # Express server entry point
├── scripts/                  # Build and deployment scripts
├── docs/                     # Project documentation
├── docker-compose.yml        # Docker services configuration
├── Dockerfile               # Docker image configuration
└── package.json             # Root package configuration
```

## 🎯 Core Features

### 🔐 Authentication System
- **Secure Registration** - Email verification required
- **JWT Authentication** - Stateless token-based auth
- **Password Security** - Bcrypt hashing with salt rounds
- **Password Reset** - Email-based password recovery
- **Role-Based Access** - User permissions and roles
- **Session Management** - Automatic token refresh

### 🤖 AI Assistant
- **OpenAI Integration** - Powered by GPT-4
- **Multi-Category Support**:
  - 💻 **Coding Help** - Debug code, explain concepts
  - 📝 **Blog Assistance** - Title generation, content ideas
  - 🚀 **Career Advice** - Professional development tips
  - 🛠️ **Project Ideas** - Inspiration for new projects
- **Context Awareness** - Remembers conversation history
- **Code Formatting** - Syntax highlighting for code responses

### 💬 Real-Time Chat
- **Multi-Room System** - Create and join different channels
- **Live Messaging** - Instant message delivery
- **User Presence** - Online/offline status indicators
- **Typing Indicators** - See when others are typing
- **File Sharing** - Upload and share files in chat
- **Message History** - Persistent message storage
- **Emoji Support** - Rich emoji picker

### 📝 Content Management
- **Rich Text Editor** - WYSIWYG editor with Markdown support
- **Media Upload** - Drag-and-drop file uploading
- **Content Categories** - Organize posts by type and topic
- **Tag System** - Searchable content tags
- **Draft System** - Save and edit drafts
- **Version Control** - Track content changes

### 📊 Developer Feed
- **Post Types**:
  - 📄 **Articles** - Technical blog posts
  - ❓ **Questions** - Q&A similar to Stack Overflow
  - 🚀 **Projects** - Showcase your work
  - 📚 **Resources** - Share useful links and tools
- **Engagement Features**:
  - 👍 **Reactions** - Like, love, celebrate posts
  - 💬 **Comments** - Nested comment threads
  - 🔄 **Shares** - Amplify great content
  - 🔖 **Bookmarks** - Save posts for later
- **Advanced Features**:
  - 🔍 **Search & Filter** - Find content easily
  - 🏷️ **Tag-based Discovery** - Explore by interests
  - 📈 **Trending Content** - Popular posts and topics

## 🔧 Development

### Available Scripts

```bash
# Installation
npm run install-all          # Install dependencies for all packages
npm run clean                # Clean node_modules and package-lock files

# Development
npm run dev                  # Start both client and server in development
npm run client               # Start only React development server
npm run server               # Start only Express server with nodemon
npm run server:prod          # Start server in production mode

# Building
npm run build                # Build client for production
npm run build:server         # Build server (if using TypeScript)

# Testing
npm test                     # Run all tests
npm run test:client          # Run client tests only
npm run test:server          # Run server tests only
npm run test:coverage        # Generate test coverage report

# Quality Assurance
npm run lint                 # Run ESLint on all files
npm run lint:fix             # Fix ESLint issues automatically
npm run format               # Format code with Prettier

# Utilities
npm run check-setup          # Verify environment configuration
npm run reset-db             # Reset database (development only)
npm run seed                 # Seed database with sample data

# Docker
npm run docker:build         # Build Docker images
npm run docker:up            # Start Docker containers
npm run docker:down          # Stop Docker containers
npm run docker:logs          # View container logs
```

### API Endpoints

#### Authentication Routes
```
POST   /api/auth/register        # User registration
POST   /api/auth/login           # User login
POST   /api/auth/logout          # User logout
GET    /api/auth/profile         # Get user profile
PUT    /api/auth/profile         # Update user profile
POST   /api/auth/forgot-password # Request password reset
POST   /api/auth/reset-password  # Reset password with token
POST   /api/auth/verify-email    # Verify email address
```

#### Posts & Content
```
GET    /api/posts               # Get all posts (with pagination)
POST   /api/posts               # Create new post
GET    /api/posts/:id           # Get specific post
PUT    /api/posts/:id           # Update post (author only)
DELETE /api/posts/:id           # Delete post (author only)
POST   /api/posts/:id/like      # Like/unlike post
POST   /api/posts/:id/comment   # Add comment to post
GET    /api/posts/user/:userId  # Get posts by user
GET    /api/posts/tag/:tag      # Get posts by tag
```

#### AI Assistant
```
POST   /api/ai/chat            # Chat with AI assistant
POST   /api/ai/blog-title      # Generate blog titles
POST   /api/ai/tags            # Generate content tags
POST   /api/ai/project-ideas   # Get project suggestions
POST   /api/ai/code-review     # AI code review
```

#### File Management
```
POST   /api/upload/single      # Upload single file
POST   /api/upload/multiple    # Upload multiple files
DELETE /api/upload/:publicId   # Delete uploaded file
GET    /api/upload/user/:userId # Get user's uploads
```

#### Chat System
```
GET    /api/chat/rooms          # Get available chat rooms
POST   /api/chat/rooms          # Create new chat room
GET    /api/chat/rooms/:id      # Get room details
GET    /api/chat/rooms/:id/messages # Get room messages
POST   /api/chat/rooms/:id/join # Join chat room
POST   /api/chat/rooms/:id/leave # Leave chat room
```

[View complete API documentation](docs/api.md)

## 🚀 Deployment

### Environment-Specific Configuration

#### Development
- Hot reloading enabled
- Detailed error messages
- Development tools available
- Local database preferred

#### Production
- Minified builds
- Error logging to services
- Environment variable validation
- CDN for static assets

### Deployment Options

#### Option 1: Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

#### Option 2: Platform Deployment

**Frontend (Vercel)**
1. Connect GitHub repository to Vercel
2. Configure build settings:
   ```
   Build Command: npm run build
   Output Directory: client/build
   Install Command: npm run install-all
   ```
3. Set environment variables in Vercel dashboard
4. Enable automatic deployments

**Backend (Railway)**
1. Connect GitHub repository to Railway
2. Configure build settings:
   ```
   Build Command: npm install --prefix server
   Start Command: npm run server:prod
   ```
3. Set environment variables
4. Configure custom domain (optional)

**Database (MongoDB Atlas)**
1. Create MongoDB Atlas cluster
2. Configure network access (0.0.0.0/0 for development)
3. Create database user
4. Get connection string
5. Update MONGODB_URI in environment variables

## 🧪 Testing

### Testing Strategy
- **Unit Tests** - Individual component testing
- **Integration Tests** - API endpoint testing
- **E2E Tests** - Full user workflow testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run specific test file
npm test -- --testNamePattern="Auth"
```

## 🔒 Security Features

- **Input Validation** - Comprehensive data sanitization
- **Rate Limiting** - API request throttling
- **CORS Protection** - Cross-origin request security
- **Helmet.js** - Security headers
- **MongoDB Injection Protection** - Query sanitization
- **File Upload Security** - Type and size validation
- **Environment Variables** - Sensitive data protection

## 📊 Performance Optimization

- **Code Splitting** - Lazy loading of components
- **Image Optimization** - Cloudinary transformations
- **Caching Strategy** - Redis for session storage
- **Database Indexing** - Optimized MongoDB queries
- **Bundle Analysis** - Webpack bundle optimization
- **CDN Integration** - Static asset delivery

## 🤝 Contributing

We welcome contributions from developers of all skill levels! Please read our [Contributing Guidelines](CONTRIBUTING.md) for detailed information.

### Quick Contribution Steps
1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow existing code style and conventions
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for complete details.

## 👨‍�developers Team

**Project Maintainer: Aditya Singh**
- 🐙 GitHub: [@yourusername](https://github.com/yourusername)
- 💼 LinkedIn: [Connect with me](https://linkedin.com/in/yourprofile)
- 📧 Email: aditya.singh@devconnect.dev

### Contributors
Thanks to all contributors who have helped make DevConnect better! 🙏

[View all contributors](../../graphs/contributors)

## 🙏 Acknowledgments

Special thanks to the open-source community and these amazing projects:
- [React](https://reactjs.org/) - The foundation of our frontend
- [Node.js](https://nodejs.org/) - Powering our backend
- [MongoDB](https://mongodb.com/) - Our reliable database
- [OpenAI](https://openai.com/) - Enabling AI capabilities
- [Socket.IO](https://socket.io/) - Real-time communication
- [Tailwind CSS](https://tailwindcss.com/) - Beautiful styling
- [Cloudinary](https://cloudinary.com/) - Media management

## 📈 Project Roadmap

### Upcoming Features
- [ ] **Video Chat Integration** - WebRTC-based video calls
- [ ] **Code Collaboration** - Real-time collaborative coding
- [ ] **Mobile App** - React Native mobile application
- [ ] **Advanced AI Features** - Code generation and review
- [ ] **Integration APIs** - GitHub, GitLab, and other tools
- [ ] **Premium Features** - Advanced analytics and insights

### Current Status
- ✅ **Phase 1**: Core platform functionality
- ✅ **Phase 2**: AI assistant integration
- 🚧 **Phase 3**: Advanced chat features
- 📋 **Phase 4**: Mobile application development

## 📊 Project Statistics

![GitHub stars](https://img.shields.io/github/stars/yourusername/devconnect?style=for-the-badge)
![GitHub forks](https://img.shields.io/github/forks/yourusername/devconnect?style=for-the-badge)
![GitHub issues](https://img.shields.io/github/issues/yourusername/devconnect?style=for-the-badge)
![GitHub pull requests](https://img.shields.io/github/issues-pr/yourusername/devconnect?style=for-the-badge)
![GitHub last commit](https://img.shields.io/github/last-commit/yourusername/devconnect?style=for-the-badge)

## 🆘 Support

Need help? We're here for you!

- 📖 **Documentation**: [Read our docs](docs/)
- 💬 **Community Chat**: [Join our Discord](https://discord.gg/devconnect)
- 🐛 **Bug Reports**: [Create an issue](../../issues/new?template=bug_report.md)
- 💡 **Feature Requests**: [Request a feature](../../issues/new?template=feature_request.md)
- 📧 **Direct Support**: support@devconnect.dev

---

<div align="center">
  <p><strong>Made with ❤️ by developers, for developers</strong></p>
  <p>⭐ <strong>Star this repository if you find it helpful!</strong> ⭐</p>
  <p><em>Together, we're building the future of developer collaboration</em></p>
</div>
