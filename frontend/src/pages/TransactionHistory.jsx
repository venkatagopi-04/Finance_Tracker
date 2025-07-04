import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TransactionHistory.css';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/transactions')
      .then(res => setTransactions(res.data))
      .catch(err => console.error('Error fetching transactions:', err));
  }, []);

  return (
    <div className="history-container">
      <h2>Transaction History</h2>
      <table className="transaction-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((txn) => (
            <tr key={txn._id}>
              <td>{new Date(txn.date).toLocaleDateString()}</td>
              <td>{txn.type}</td>
              <td>{txn.category}</td>
              <td style={{ color: txn.type === 'income' ? 'green' : 'red' }}>
                {txn.type === 'income' ? '+' : '-'} ₹{txn.amount}
              </td>
              <td>{txn.status}</td>
              <td>{txn.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionHistory;
