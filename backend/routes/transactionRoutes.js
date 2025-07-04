const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

// 🔹 POST /transactions → Add a new transaction
router.post('/', async (req, res) => {
  try {
    const transaction = new Transaction(req.body);
    const saved = await transaction.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 🔹 GET /transactions → Fetch all transactions (most recent first)
router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
