// backend/models/Transaction.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false, // Future-ready for multi-user support
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  subcategory: {
    type: String,
    required: false,
  },
  amount: {
    type: Number,
    required: true,
    // min: 0, // Allow negative for expenses
  },
  currency: {
    type: String,
    default: 'INR',
  },
  date: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    maxlength: 500,
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'upi', 'bank_transfer', 'other'],
    default: 'other',
  },
  tags: {
    type: [String],
    default: [],
  },
  source: {
    type: String,
    enum: ['manual', 'receipt', 'pdf', 'imported'],
    default: 'manual',
  },
  receiptImageUrl: {
    type: String,
  },
  isDeleted: {
    type: Boolean,
    default: false, // Soft delete flag
  },
  status: {
    type: String,
    enum: ['confirmed', 'pending', 'flagged'],
    default: 'confirmed',
  },
  recurring: {
    isRecurring: { type: Boolean, default: false },
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'yearly'],
    },
    endDate: {
      type: Date,
    },
  },
  metadata: {
    extractedFromOCR: { type: Boolean, default: false },
    editedByUser: { type: Boolean, default: false },
    ocrRawText: { type: String },
    pdfFilename: { type: String },
    confidenceScore: { type: Number, min: 0, max: 1 }, // optional: for OCR reliability
  },
}, {
  timestamps: true, // adds createdAt and updatedAt
});

module.exports = mongoose.model('Transaction', transactionSchema);
