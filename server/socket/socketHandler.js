const Message = require('../models/Message');
const ChatRoom = require('../models/ChatRoom');
const Notification = require('../models/Notification');

const initializeSocket = (io) => {
  // Store active users
  const activeUsers = new Map();

  io.on('connection', (socket) => {
    console.log('User connected:', socket.user.id);
    
    // Store user info
    activeUsers.set(socket.user.id, {
      socketId: socket.id,
      user: socket.user,
      lastSeen: new Date(),
    });

    // Join user to their personal room
    socket.join(`user_${socket.user.id}`);

    // Emit user online status
    socket.broadcast.emit('user_online', {
      userId: socket.user.id,
      userName: socket.user.name,
    });

    // Handle joining chat rooms
    socket.on('join_room', async (roomId) => {
      try {
        // Verify user has access to room
        const room = await ChatRoom.findOne({
          _id: roomId,
          'participants.user': socket.user.id
        });

        if (room) {
          socket.join(`room_${roomId}`);
          console.log(`User ${socket.user.id} joined room ${roomId}`);
          
          // Notify others in room
          socket.to(`room_${roomId}`).emit('user_joined_room', {
            userId: socket.user.id,
            userName: socket.user.name,
            roomId,
          });
        }
      } catch (error) {
        console.error('Error joining room:', error);
      }
    });

    // Handle leaving chat rooms
    socket.on('leave_room', (roomId) => {
      socket.leave(`room_${roomId}`);
      socket.to(`room_${roomId}`).emit('user_left_room', {
        userId: socket.user.id,
        userName: socket.user.name,
        roomId,
      });
    });

    // Handle sending messages
    socket.on('send_message', async (data) => {
      try {
        const { roomId, content, type = 'text', replyTo } = data;

        // Verify user has access to room
        const room = await ChatRoom.findOne({
          _id: roomId,
          'participants.user': socket.user.id
        });

        if (!room) {
          socket.emit('error', { message: 'Access denied to chat room' });
          return;
        }

        // Create message
        const message = await Message.create({
          sender: socket.user.id,
          chatRoom: roomId,
          content,
          type,
          replyTo,
        });

        await message.populate('sender', 'name avatar');
        if (replyTo) {
          await message.populate('replyTo');
        }

        // Update room's last message and activity
        room.lastMessage = message._id;
        room.lastActivity = new Date();
        await room.save();

        // Broadcast to room
        io.to(`room_${roomId}`).emit('new_message', message);

        // Send push notifications to offline users
        const offlineParticipants = room.participants.filter(p => 
          p.user.toString() !== socket.user.id && 
          !activeUsers.has(p.user.toString())
        );

        // Create notifications for offline users
        for (const participant of offlineParticipants) {
          await Notification.create({
            recipient: participant.user,
            sender: socket.user.id,
            type: 'message',
            title: `New message from ${socket.user.name}`,
            content: content.substring(0, 100),
            data: { roomId, messageId: message._id },
          });
        }

      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle typing indicators
    socket.on('typing', (data) => {
      const { roomId } = data;
      socket.to(`room_${roomId}`).emit('user_typing', {
        userId: socket.user.id,
        userName: socket.user.name,
        roomId,
      });
    });

    socket.on('stop_typing', (data) => {
      const { roomId } = data;
      socket.to(`room_${roomId}`).emit('user_stop_typing', {
        userId: socket.user.id,
        roomId,
      });
    });

    // Handle project collaboration
    socket.on('join_project', (projectId) => {
      socket.join(`project_${projectId}`);
      console.log(`User ${socket.user.id} joined project ${projectId}`);
    });

    socket.on('project_update', (data) => {
      const { projectId, update } = data;
      socket.to(`project_${projectId}`).emit('project_updated', {
        update,
        updatedBy: socket.user,
        timestamp: new Date(),
      });
    });

    // Handle real-time notifications
    socket.on('mark_notification_read', async (notificationId) => {
      try {
        await Notification.findByIdAndUpdate(notificationId, { read: true });
        socket.emit('notification_marked_read', { notificationId });
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    });

    // Handle live post interactions
    socket.on('post_interaction', (data) => {
      const { postId, type, action } = data; // type: like, comment, share
      
      // Broadcast to all users
      socket.broadcast.emit('post_updated', {
        postId,
        type,
        action,
        user: socket.user,
        timestamp: new Date(),
      });
    });

    // Handle collaborative editing (for future implementation)
    socket.on('document_edit', (data) => {
      const { documentId, changes, version } = data;
      socket.to(`doc_${documentId}`).emit('document_changes', {
        changes,
        version,
        userId: socket.user.id,
      });
    });

    // Handle user presence updates
    socket.on('update_presence', (status) => {
      if (activeUsers.has(socket.user.id)) {
        activeUsers.get(socket.user.id).status = status;
        socket.broadcast.emit('user_presence_updated', {
          userId: socket.user.id,
          status,
        });
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.user.id);
      
      // Remove from active users
      activeUsers.delete(socket.user.id);
      
      // Notify others user went offline
      socket.broadcast.emit('user_offline', {
        userId: socket.user.id,
        lastSeen: new Date(),
      });
    });

    // Handle errors
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });

  // Utility function to send notification to specific user
  const sendNotificationToUser = async (userId, notification) => {
    const userSocket = activeUsers.get(userId);
    if (userSocket) {
      io.to(`user_${userId}`).emit('new_notification', notification);
    }
    
    // Also save to database
    await Notification.create({
      recipient: userId,
      ...notification,
    });
  };

  // Utility function to broadcast to room
  const broadcastToRoom = (roomId, event, data) => {
    io.to(`room_${roomId}`).emit(event, data);
  };

  // Utility function to get active users count
  const getActiveUsersCount = () => activeUsers.size;

  // Utility function to get active users in room
  const getActiveUsersInRoom = (roomId) => {
    const room = io.sockets.adapter.rooms.get(`room_${roomId}`);
    return room ? room.size : 0;
  };

  return {
    sendNotificationToUser,
    broadcastToRoom,
    getActiveUsersCount,
    getActiveUsersInRoom,
  };
};

module.exports = { initializeSocket };
