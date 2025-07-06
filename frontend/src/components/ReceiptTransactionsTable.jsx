// ReceiptTransactionsTable.jsx - Table for displaying transactions extracted from receipts
// Includes filters for category, status, and date, with pagination

import React, { useState, useMemo } from 'react';
import './TransactionsTable.css';

const PAGE_SIZE = 10;

const ReceiptTransactionsTable = ({ transactions = [] }) => {
  // State for pagination and filters
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [date, setDate] = useState('');

  // Unique categories and statuses for filter dropdowns
  const categories = useMemo(() => Array.from(new Set(transactions.map(t => t.category).filter(Boolean))), [transactions]);
  const statuses = useMemo(() => Array.from(new Set(transactions.map(t => t.status).filter(Boolean))), [transactions]);

  // Filtered transactions based on selected filters
  const filtered = useMemo(() => {
    return transactions.filter(txn =>
      (!category || txn.category === category) &&
      (!status || txn.status === status) &&
      (!date || (txn.date && new Date(txn.date).toISOString().slice(0,10) === date))
    );
  }, [transactions, category, status, date]);

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Reset to first page on filter change
  React.useEffect(() => { setPage(1); }, [category, status, date]);

  // Show message if no transactions
  if (!transactions.length) return <div style={{marginTop: 24}}>No receipt transactions found.</div>;
  return (
    <div className="table-container" style={{marginTop: 24}}>
      <h4>Receipt Transactions</h4>
      {/* Filter controls */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
        <select value={category} onChange={e => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        <select value={status} onChange={e => setStatus(e.target.value)}>
          <option value="">All Statuses</option>
          {statuses.map(st => <option key={st} value={st}>{st}</option>)}
        </select>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} />
      </div>
      {/* Transactions table */}
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((txn, index) => (
            <tr key={index}>
              <td>{txn.date ? new Date(txn.date).toLocaleDateString() : ''}</td>
              <td>{txn.description}</td>
              <td>{txn.category}</td>
              <td style={{ color: txn.amount >= 0 ? 'green' : 'red' }}>
                {txn.amount >= 0 ? `+${txn.amount}` : txn.amount}
              </td>
              <td>{txn.status || ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination controls */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 14 }}>
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
        <span style={{ fontWeight: 500 }}>Page {page} of {totalPages}</span>
        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</button>
      </div>
    </div>
  );
};

export default ReceiptTransactionsTable;
