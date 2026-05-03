import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

// Load environment variables
dotenv.config();

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB terhubung untuk proses seeding...');

    // Cek apakah admin sudah ada
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (adminExists) {
      console.log('✅ Akun admin sudah ada di database.');
      console.log(`Username: ${adminExists.username}`);
      process.exit(0);
    }

    // Buat admin baru
    const adminUser = new User({
      username: 'admin',
      email: 'admin@fashionstore.com',
      password: 'admin123', // Password akan di-hash otomatis oleh pre-save hook di User model
      role: 'admin'
    });

    await adminUser.save();
    console.log('🎉 Akun admin berhasil dibuat!');
    console.log('Username: admin');
    console.log('Password: admin123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Gagal melakukan seeding:', error);
    process.exit(1);
  }
};

seedAdmin();
