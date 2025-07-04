import React, { useState } from 'react';
import axios from 'axios';

const AddTransaction = () => {
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
      setFormData({ ...formData, amount: '', category: '', description: '', tags: '' });
    } catch (err) {
      console.error(err);
      alert('Failed to add transaction.');
    }
  };

  return (
    <div style={{ maxWidth: '600px' }}>
      <h2>Add Transaction</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

        <select name="type" value={formData.type} onChange={handleChange}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>

        <input type="text" name="category" placeholder="Category" value={formData.category} onChange={handleChange} required />

        <input type="text" name="subcategory" placeholder="Subcategory (optional)" value={formData.subcategory} onChange={handleChange} />

        <input type="number" name="amount" placeholder="Amount" value={formData.amount} onChange={handleChange} required />

        <input type="text" name="currency" placeholder="Currency" value={formData.currency} onChange={handleChange} />

        <input type="date" name="date" value={formData.date} onChange={handleChange} required />

        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange}></textarea>

        <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}>
          <option value="cash">Cash</option>
          <option value="card">Card</option>
          <option value="upi">UPI</option>
          <option value="bank_transfer">Bank Transfer</option>
          <option value="other">Other</option>
        </select>

        <input type="text" name="tags" placeholder="Tags (comma-separated)" value={formData.tags} onChange={handleChange} />

        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="confirmed">Confirmed</option>
          <option value="pending">Pending</option>
          <option value="flagged">Flagged</option>
        </select>

        <button type="submit" style={{ padding: '10px', background: '#1976d2', color: '#fff', border: 'none', borderRadius: '5px' }}>
          Add Transaction
        </button>
      </form>
    </div>
  );
};

export default AddTransaction;
