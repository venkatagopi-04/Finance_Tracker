import React, { useState } from 'react';

import './TransactionModal.css';
import axios from '../utils/axios'; // instead of 'axios'


const CATEGORY_OPTIONS = [
  'Recharge',
  'Bills',
  'Money Sent',
  'Money Received',
  'Shopping',
  'Dining',
  'Travel',
  'Other'
];

const TransactionModal = ({ isOpen, onClose, initialData, onSave }) => {
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
    if (formData.type === 'expense') {
      amount = -Math.abs(amount);
    } else {
      amount = Math.abs(amount);
    }
    const payload = {
      ...formData,
      amount,
      tags: typeof formData.tags === 'string' ? formData.tags.split(',').map(tag => tag.trim()) : formData.tags,
    };

    try {
      if (onSave && initialData) {
        await onSave({ ...initialData, ...payload });
      } else {
        await axios.post('/transactions', payload);
        alert('Transaction added successfully!');
        // Optionally: trigger a custom event to refresh dashboard
        window.dispatchEvent(new Event('transactionAdded'));
      }
      onClose(); // Close modal
    } catch (err) {
      console.error(err);
      alert('Failed to save transaction.');
    }
  };

  return (
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
            {CATEGORY_OPTIONS.map((cat) => (
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

          <input
            type="text"
            name="currency"
            placeholder="Currency"
            value={formData.currency}
            onChange={handleChange}
          />

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
  );
};

export default TransactionModal;
