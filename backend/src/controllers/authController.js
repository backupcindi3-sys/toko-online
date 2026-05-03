import User from '../models/User.js';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Validasi input
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email, dan password harus diisi' });
    }

    // Check user sudah terdaftar
    const existingUser = await User.findOne({ 
      $or: [{ username }, { email }] 
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Username atau email sudah terdaftar' });
    }

    // Create user
    const newUser = new User({
      username,
      email,
      password,
      role: role || 'user'
    });

    await newUser.save();

    res.status(201).json({
      message: 'User berhasil didaftarkan',
      user: newUser.toJSON()
    });
  } catch (error) {
    res.status(500).json({ message: 'Error saat registrasi', error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validasi input
    if (!username || !password) {
      return res.status(400).json({ message: 'Username dan password harus diisi' });
    }

    // Find user
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: 'Username atau password salah' });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Username atau password salah' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login berhasil',
      token,
      user: user.toJSON()
    });
  } catch (error) {
    res.status(500).json({ message: 'Error saat login', error: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    res.json({
      message: 'Profil user',
      user: user.toJSON()
    });
  } catch (error) {
    res.status(500).json({ message: 'Error mengambil profil', error: error.message });
  }
};
