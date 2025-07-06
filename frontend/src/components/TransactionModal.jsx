// TransactionModal.jsx - Modal for adding or editing a transaction
// Handles form state, currency conversion, and save/cancel actions

import React, { useState } from 'react';

import './TransactionModal.css';
import axios from '../utils/axios'; // instead of 'axios'

// Predefined categories and currency options
const INCOME_CATEGORIES = [
  'Salary',
  'Business',
  'Interest',
  'Money Received',
  'Other Income'
];
const EXPENSE_CATEGORIES = [
  'Recharge',
  'Bills',
  'Money Sent',
  'Shopping',
  'Dining',
  'Travel',
  'Other Expense'
];
const CURRENCY_OPTIONS = [
  { value: 'INR', label: 'INR (₹)' },
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'FRW', label: 'FRW (FRw)' },
  { value: 'GBP', label: 'GBP (£)' },
  { value: 'OTHER', label: 'Other' },
];
const CURRENCY_RATES = {
  INR: 1,
  USD: 83, // 1 USD = 83 INR
  EUR: 90, // 1 EUR = 90 INR
  FRW: 0.021, // 1 FRW = 0.021 INR
  GBP: 105, // 1 GBP = 105 INR
  OTHER: 1, // fallback
};

const TransactionModal = ({ isOpen, onClose, initialData, onSave }) => {
  // State for form data
  const [formData, setFormData] = useState(initialData || {
    type: 'expense',
    category: '',
    subcategory: '',
    amount: '',
    currency: 'INR',
    date: '',
    description: '',
    paymentMethod: 'other',
    tags: '',
    source: 'manual',
    status: 'confirmed',
  });

  // Update form data when editing an existing transaction
  React.useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        amount: Math.abs(initialData.amount),
        tags: Array.isArray(initialData.tags) ? initialData.tags.join(', ') : (initialData.tags || ''),
      });
    }
  }, [initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let amount = parseFloat(formData.amount);
    let currency = formData.currency || 'INR';
    // Convert to INR for storage
    const rate = CURRENCY_RATES[currency] || 1;
    let amountINR = amount;
    if (currency !== 'INR') {
      amountINR = amount * rate;
    }
    if (formData.type === 'expense') {
      amountINR = -Math.abs(amountINR);
    } else {
      amountINR = Math.abs(amountINR);
    }
    const payload = {
      ...formData,
      amount: amountINR,
      currency: 'INR', // Always store as INR
      tags: typeof formData.tags === 'string' ? formData.tags.split(',').map(tag => tag.trim()) : formData.tags,
    };

    try {
      if (onSave && initialData) {
        await onSave({ ...initialData, ...payload });
      } else {
        await axios.post('/transactions', payload);
        if (window.showToast) window.showToast('Transaction added successfully!', 'success');
        window.dispatchEvent(new Event('transactionAdded'));
      }
      onClose(); // Close modal
    } catch (err) {
      console.error(err);
      if (window.showToast) window.showToast('Failed to save transaction.', 'error');
    }
  };

  return (
    <>
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>{initialData ? 'Edit Transaction' : 'Add Transaction'}</h2>
          <form onSubmit={handleSubmit} className="transaction-form">
            <select name="type" value={formData.type} onChange={handleChange}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>

            <select name="category" value={formData.category} onChange={handleChange} required>
              <option value="">Select Category</option>
              {(formData.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <input
              type="text"
              name="subcategory"
              placeholder="Subcategory (optional)"
              value={formData.subcategory}
              onChange={handleChange}
            />

            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={formData.amount}
              onChange={handleChange}
              required
            />
            <select
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              style={{ marginBottom: 10 }}
            >
              {CURRENCY_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />

            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
            ></textarea>

            <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}>
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="upi">UPI</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="other">Other</option>
            </select>

            <input
              type="text"
              name="tags"
              placeholder="Tags (comma-separated)"
              value={formData.tags}
              onChange={handleChange}
            />

            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="flagged">Flagged</option>
            </select>

            <div className="modal-actions">
              <button type="submit" className="submit-btn">{initialData ? 'Save' : 'Add'}</button>
              <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default TransactionModal;
