// backend/index.js
require('dotenv').config(); // Load .env before anything else

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('./middleware/cookieParser');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.once('open', () => console.log('✅ MongoDB connected'));
db.on('error', (err) => console.error('❌ MongoDB error:', err));

// Simple Test Route
app.get('/', (req, res) => {
  res.send('Backend is working!');
});

const transactionRoutes = require('./routes/transactionRoutes');
app.use('/transactions', transactionRoutes);

const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

const receiptUploadRoutes = require('./routes/receiptUploadRoutes');
app.use('/receipt', receiptUploadRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
