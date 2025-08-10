# 🚀 DevConnect - Multi-Functional Developer Platform

<div align="center">

![DevConnect Logo](https://via.placeholder.com/200x100/3B82F6/FFFFFF?text=DevConnect)

**Where Developers Meet, Collaborate, and Grow in Real Time**

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0+-green.svg)](https://mongodb.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.7.2-black.svg)](https://socket.io/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--3.5-orange.svg)](https://openai.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[🌐 Live Demo](https://devconnect-demo.vercel.app) • [📖 Documentation](docs/) • [🐛 Report Bug](issues/) • [✨ Request Feature](issues/)

</div>

---

## 🌟 Overview

DevConnect is a comprehensive developer platform that combines the best features of **LinkedIn**, **StackOverflow**, **Slack**, and **Notion** into one powerful application. Built with modern technologies, it provides developers with everything they need to connect, collaborate, and grow their careers.

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
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations
- **Heroicons** - Beautiful SVG icons
- **Axios** - HTTP client

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Socket.IO** - Real-time communication
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload handling
- **Cloudinary** - Cloud storage

### AI & External Services
- **OpenAI GPT-3.5** - AI assistant functionality
- **Cloudinary** - Image and file storage
- **SendGrid/Mailgun** - Email services (optional)

### DevOps & Deployment
- **Docker** - Containerization
- **GitHub Actions** - CI/CD
- **Vercel** - Frontend deployment
- **Railway/Render** - Backend deployment
- **MongoDB Atlas** - Cloud database

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/devconnect.git
   cd devconnect
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   ```bash
   # Copy environment files
   cp .env.example .env
   cp server/.env.example server/.env
   cp client/.env.example client/.env
   ```

4. **Configure environment variables**
   
   **Root & Server (.env)**
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/devconnect
   JWT_SECRET=your_super_secret_jwt_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   OPENAI_API_KEY=your_openai_api_key
   CLIENT_URL=http://localhost:3000
   ```

   **Client (.env)**
   ```env
   REACT_APP_API_URL=http://localhost:5000
   ```

5. **Start the development servers**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - API Health: http://localhost:5000/health

## 📁 Project Structure

```
devconnect/
├── client/                     # React Frontend
│   ├── public/                 # Static files
│   └── src/
│       ├── components/         # React components
│       │   ├── ai/            # AI Assistant
│       │   ├── auth/          # Authentication
│       │   ├── blog/          # Blog management
│       │   ├── chat/          # Real-time chat
│       │   ├── dashboard/     # User dashboard
│       │   ├── feed/          # Social feed
│       │   ├── projects/      # Project management
│       │   ├── settings/      # User settings
│       │   └── ui/            # Reusable UI components
│       ├── services/          # API services
│       ├── features/          # Redux slices
│       └── routes/            # React Router setup
├── server/                    # Express Backend
│   ├── config/               # Configuration files
│   ├── controllers/          # Request handlers
│   ├── middleware/           # Custom middleware
│   ├── models/              # Database models
│   ├── routes/              # API routes
│   ├── services/            # Business logic
│   ├── socket/              # Socket.IO handlers
│   └── utils/               # Utility functions
├── scripts/                  # Build and deployment scripts
└── docs/                     # Documentation
```

## 🎯 Core Features

### 🔐 Authentication System
- Secure JWT-based authentication
- Email verification
- Password reset functionality
- Role-based access control

### 🤖 AI Assistant
- OpenAI GPT-3.5 integration
- Category-based responses (coding, blog, career, etc.)
- Code explanation and debugging help
- Blog title and tag generation
- Project idea suggestions

### 💬 Real-Time Chat
- Multi-room chat system
- Online user presence
- Typing indicators
- File sharing capabilities
- Message history

### 📝 Content Management
- Rich text blog editor with Markdown support
- Project showcase and management
- File upload with drag-and-drop
- Content categorization and tagging

### 📊 Social Feed
- Developer-focused social feed
- Post types: Articles, Questions, Projects, Resources
- Real-time interactions (likes, comments, shares)
- Advanced filtering and search

## 🔧 Development

### Available Scripts

```bash
# Install all dependencies
npm run install-all

# Start development servers (both client and server)
npm run dev

# Start only client
npm run client

# Start only server
npm run server

# Build for production
npm run build

# Run tests
npm test

# Check setup
npm run check-setup

# Docker commands
npm run docker:build
npm run docker:up
npm run docker:down
```

### API Endpoints

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Password reset

#### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post

#### AI Assistant
- `POST /api/ai/chat` - Chat with AI
- `POST /api/ai/blog-title` - Generate blog titles
- `POST /api/ai/tags` - Generate content tags

#### File Upload
- `POST /api/upload/single` - Upload single file
- `POST /api/upload/multiple` - Upload multiple files

[View full API documentation](docs/api.md)

## 🚀 Deployment

### Using Docker

1. **Build and run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

### Manual Deployment

#### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

#### Backend (Railway/Render)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy from main branch

#### Database (MongoDB Atlas)
1. Create a MongoDB Atlas cluster
2. Get connection string
3. Update MONGODB_URI in environment variables

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Aditya Singh**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)
- Email: your.email@example.com

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - The web framework used
- [Node.js](https://nodejs.org/) - Backend runtime
- [MongoDB](https://mongodb.com/) - Database
- [OpenAI](https://openai.com/) - AI capabilities
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Heroicons](https://heroicons.com/) - Icons

## 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/yourusername/devconnect?style=social)
![GitHub forks](https://img.shields.io/github/forks/yourusername/devconnect?style=social)
![GitHub issues](https://img.shields.io/github/issues/yourusername/devconnect)
![GitHub pull requests](https://img.shields.io/github/issues-pr/yourusername/devconnect)

---

<div align="center">
  <p>Made with ❤️ by developers, for developers</p>
  <p>⭐ Star this repo if you find it helpful!</p>
</div>#   D e v C o n n e c t  
 