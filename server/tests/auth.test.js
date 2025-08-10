const request = require('supertest');
const { app } = require('../app');
const User = require('../models/User');

describe('Auth Routes', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('name', testUser.name);
      expect(response.body.user).toHaveProperty('email', testUser.email);
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('should not register user with existing email', async () => {
      // Create a user first
      await User.create(testUser);

      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await User.create(testUser);
    });

    it('should login successfully with correct credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('email', testUser.email);
    });

    it('should not login with incorrect password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('GET /api/auth/me', () => {
    let token;
    let user;

    beforeEach(async () => {
      user = await User.create(testUser);
      token = generateTestToken(user._id);
    });

    it('should get user profile with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('email', testUser.email);
    });

    it('should not get profile without token', async () => {
      const response = await request(app)
        .get('/api/auth/me');

      expect(response.status).toBe(401);
    });
  });
});
