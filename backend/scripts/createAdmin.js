const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/clinic');

    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = new User({
      name: 'Admin',
      email: 'admin@clinic.com',
      password: hashedPassword,
      role: 'admin'
    });

    await admin.save();
    console.log('Admin user created successfully');
    console.log('Email: admin@clinic.com');
    console.log('Password: admin123');
  } catch (err) {
    console.error('Error creating admin:', err);
  } finally {
    mongoose.connection.close();
  }
}

createAdmin();
