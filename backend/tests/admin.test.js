const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server');
const User = require('../models/User.model');
const generateToken = require('../utils/generateToken');

describe('Admin API Tests', () => {
  let adminToken;
  let userToken;
  let adminUser;
  let normalUser;
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
    
    adminUser = new User({
      fullName: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin'
    });
    await adminUser.save();
    
    normalUser = new User({
      fullName: 'Normal User',
      email: 'user@example.com',
      password: 'user123',
      role: 'user'
    });
    await normalUser.save();
    
    adminToken = generateToken(adminUser._id);
    userToken = generateToken(normalUser._id);
  });

  describe('GET /api/admin/users', () => {
    it('should get all users with pagination for admin', async () => {
      const response = await request(app)
        .get('/api/admin/users?page=1&limit=10')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.users).toBeDefined();
      expect(response.body.data.pagination).toBeDefined();
    });

    it('should deny access for non-admin users', async () => {
      const response = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
    });
  });

  describe('PATCH /api/admin/users/:userId/deactivate', () => {
    it('should deactivate user successfully', async () => {
      const response = await request(app)
        .patch(`/api/admin/users/${normalUser._id}/deactivate`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user.status).toBe('inactive');
    });
  });

  describe('PATCH /api/admin/users/:userId/activate', () => {
    it('should activate user successfully', async () => {
      normalUser.status = 'inactive';
      await normalUser.save();

      const response = await request(app)
        .patch(`/api/admin/users/${normalUser._id}/activate`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user.status).toBe('active');
    });
  });
});
