// backend/index.js
require('dotenv').config(); // Load .env before anything else

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

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


// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
