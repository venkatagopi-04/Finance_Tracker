const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey'; // replace in .env later

// 🔐 Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email already in use' });

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, passwordHash });
    const savedUser = await newUser.save();

    const token = jwt.sign({ userId: savedUser._id }, JWT_SECRET, { expiresIn: '2h' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 2 * 60 * 60 * 1000 // 2 hours
    });
    res.status(201).json({ name: savedUser.name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔑 Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '2h' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 2 * 60 * 60 * 1000 // 2 hours
    });
    res.json({ name: user.name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add this route to verify authentication from the cookie
router.get('/verify', (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'Not authenticated' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ userId: decoded.userId });
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Add this route to clear the auth cookie on logout
router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
  res.json({ message: 'Logged out' });
});

module.exports = router;
