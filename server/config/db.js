const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

const connectDB = async () => {
  try {
    if (process.env.NODE_ENV === 'development' && !process.env.MONGODB_URI) {
      // Use MongoDB Memory Server for development if no MONGODB_URI is provided
      mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);
      console.log('Connected to MongoDB Memory Server');
    } else {
      // Use the configured MongoDB URI
      await mongoose.connect(process.env.MONGODB_URI);
      console.log(`MongoDB Connected: ${mongoose.connection.host}`);
    }
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    console.log('Retrying connection in 5 seconds...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    return connectDB();
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
    }
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error);
  }
};

process.on('SIGINT', async () => {
  await disconnectDB();
  process.exit(0);
});

module.exports = { connectDB, disconnectDB };
