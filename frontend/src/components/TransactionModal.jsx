import React, { useState } from 'react';
import axios from 'axios';
import './TransactionModal.css';

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

const TransactionModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
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

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      amount: parseFloat(formData.amount),
      tags: formData.tags.split(',').map(tag => tag.trim()),
    };

    try {
      await axios.post('http://localhost:5000/transactions', payload);
      alert('Transaction added successfully!');
      onClose(); // Close modal
    } catch (err) {
      console.error(err);
      alert('Failed to add transaction.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add Transaction</h2>
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
            <button type="submit" className="submit-btn">Add</button>
            <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
