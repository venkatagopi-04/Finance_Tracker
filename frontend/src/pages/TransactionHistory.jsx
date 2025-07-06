// TransactionHistory.jsx - Page for viewing, filtering, editing, and deleting all transactions
// Provides advanced filters, pagination, and edit/delete actions for each transaction

import React, { useEffect, useState } from 'react';
import './TransactionHistory.css';
import axios from '../utils/axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import TransactionModal from '../components/TransactionModal';

const TransactionHistory = () => {
  // State for all transactions, filtered list, pagination, filters, and edit modal
  const [transactions, setTransactions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState({
    from: '',
    to: '',
    type: '',
    category: '',
    status: '',
    paymentMethod: '',
  });
  const [editTxn, setEditTxn] = useState(null);

  // Fetch all transactions on mount
  useEffect(() => {
    axios.get('/transactions')
      .then(res => setTransactions(res.data))
      .catch(err => console.error('Error fetching transactions:', err));
  }, []);

  // Apply filters whenever transactions or filters change
  useEffect(() => {
    let data = [...transactions];
    if (filters.from) {
      data = data.filter(t => new Date(t.date) >= new Date(filters.from));
    }
    if (filters.to) {
      data = data.filter(t => new Date(t.date) <= new Date(filters.to));
    }
    if (filters.type) {
      data = data.filter(t => t.type === filters.type);
    }
    if (filters.category) {
      data = data.filter(t => t.category === filters.category);
    }
    if (filters.status) {
      data = data.filter(t => t.status === filters.status);
    }
    if (filters.paymentMethod) {
      data = data.filter(t => t.paymentMethod === filters.paymentMethod);
    }
    setFiltered(data);
    setPage(1); // Reset to first page on filter change
  }, [transactions, filters]);

  // Get unique values for dropdowns
  const categories = Array.from(new Set(transactions.map(t => t.category))).filter(Boolean);
  const statuses = Array.from(new Set(transactions.map(t => t.status))).filter(Boolean);
  const paymentMethods = Array.from(new Set(transactions.map(t => t.paymentMethod))).filter(Boolean);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(f => ({ ...f, [name]: value }));
  };

  // Reset filters to default values
  const handleReset = () => {
    setFilters({ from: '', to: '', type: '', category: '', status: '', paymentMethod: '' });
  };

  // Delete a transaction by ID
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;
    try {
      await axios.delete(`/transactions/${id}`);
      setTransactions(ts => ts.filter(t => t._id !== id));
    } catch (err) {
      alert('Failed to delete transaction');
    }
  };

  // Open edit modal with transaction data
  const handleEdit = (txn) => setEditTxn(txn);
  // Close edit modal
  const handleEditClose = () => setEditTxn(null);
  // Save edited transaction
  const handleEditSave = async (updated) => {
    try {
      await axios.put(`/transactions/${updated._id}`, updated);
      setTransactions(ts => ts.map(t => t._id === updated._id ? { ...t, ...updated } : t));
      setEditTxn(null);
    } catch (err) {
      alert('Failed to update transaction');
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="history-container">
      <h2>Transaction History</h2>
      <div className="filters" style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
        <div>
          <label>From: <input type="date" name="from" value={filters.from} onChange={handleFilterChange} /></label>
        </div>
        <div>
          <label>To: <input type="date" name="to" value={filters.to} onChange={handleFilterChange} /></label>
        </div>
        <div>
          <label>Type: <select name="type" value={filters.type} onChange={handleFilterChange}>
            <option value="">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select></label>
        </div>
        <div>
          <label>Category: <select name="category" value={filters.category} onChange={handleFilterChange}>
            <option value="">All</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select></label>
        </div>
        <div>
          <label>Status: <select name="status" value={filters.status} onChange={handleFilterChange}>
            <option value="">All</option>
            {statuses.map(st => <option key={st} value={st}>{st}</option>)}
          </select></label>
        </div>
        <div>
          <label>Payment: <select name="paymentMethod" value={filters.paymentMethod} onChange={handleFilterChange}>
            <option value="">All</option>
            {paymentMethods.map(pm => <option key={pm} value={pm}>{pm}</option>)}
          </select></label>
        </div>
        <button onClick={handleReset} style={{ marginLeft: 8 }}>Reset</button>
        <div style={{ marginLeft: 16 }}>
          <label>Page Size: <select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}>
            {[10, 20, 50, 100].map(size => <option key={size} value={size}>{size}</option>)}
          </select></label>
        </div>
      </div>
      <table className="transaction-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((txn) => (
            <tr key={txn._id}>
              <td>{new Date(txn.date).toLocaleDateString()}</td>
              <td>{txn.type}</td>
              <td>{txn.category}</td>
              <td style={{ color: txn.type === 'income' ? 'green' : 'red' }}>
                {txn.type === 'income' ? '+' : '-'} ₹{Math.abs(txn.amount)}
              </td>
              <td>{txn.status}</td>
              <td>{txn.description}</td>
              <td style={{ textAlign: 'center' }}>
                <button title="Edit" style={{ background: 'none', border: 'none', cursor: 'pointer', marginRight: 8 }} onClick={() => handleEdit(txn)}>
                  <FaEdit color="#1976d2" />
                </button>
                <button title="Delete" style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => handleDelete(txn._id)}>
                  <FaTrash color="#e53935" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {editTxn && (
        <TransactionModal
          isOpen={!!editTxn}
          onClose={handleEditClose}
          initialData={editTxn}
          onSave={handleEditSave}
        />
      )}
      {/* Pagination controls */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 16, gap: 8 }}>
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
          <button key={p} onClick={() => setPage(p)} style={{ fontWeight: p === page ? 'bold' : 'normal' }}>{p}</button>
        ))}
        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</button>
      </div>
    </div>
  );
};

export default TransactionHistory;
