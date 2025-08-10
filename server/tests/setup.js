const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

let mongo;

// Setup before all tests
beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri);
});

// Clear data between tests
beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

// Cleanup after all tests
afterAll(async () => {
  await mongoose.connection.close();
  await mongo.stop();
});

// Helper function to generate test JWT token
global.generateTestToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '1h'
  });
};

// Test user data
global.testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'TestPassword123!'
};
