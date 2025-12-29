const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server');
const User = require('../models/User.model');
const generateToken = require('../utils/generateToken');

describe('User API Tests', () => {
  let authToken;
  let testUser;
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    
    testUser = new User({
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'user'
    });
    await testUser.save();
    
    authToken = generateToken(testUser._id);
  });

  describe('PUT /api/user/profile', () => {
    it('should update user profile successfully', async () => {
      const response = await request(app)
        .put('/api/user/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          fullName: 'Updated Name',
          email: 'updated@example.com'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user.fullName).toBe('Updated Name');
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .put('/api/user/profile')
        .send({
          fullName: 'Updated Name'
        });

      expect(response.status).toBe(401);
    });
  });

  describe('PUT /api/user/change-password', () => {
    it('should change password successfully', async () => {
      const response = await request(app)
        .put('/api/user/change-password')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          currentPassword: 'password123',
          newPassword: 'newpassword123'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });
});
