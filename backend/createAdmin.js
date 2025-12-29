const mongoose = require('mongoose');
const User = require('./models/User.model');
require('dotenv').config();

const createAdminUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin exists
    const existingAdmin = await User.findOne({ email: 'admin@example.com' });
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const admin = new User({
      fullName: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123', // Will be hashed by pre-save hook
      role: 'admin',
      status: 'active'
    });

    await admin.save();
    console.log('✅ Admin user created successfully');
    console.log('Email: admin@example.com');
    console.log('Password: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
};

createAdminUser();
