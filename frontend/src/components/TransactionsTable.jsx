import React from 'react';
import './TransactionsTable.css';

const TransactionsTable = ({ transactions = [], loading, error }) => {
  return (
    <div className="table-container">
      <h4>Recent Transactions</h4>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Category</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn, index) => (
              <tr key={index}>
                <td>{new Date(txn.date).toLocaleDateString()}</td>
                <td>{txn.description}</td>
                <td>{txn.category}</td>
                <td style={{ color: txn.amount >= 0 ? 'green' : 'red' }}>
                  {txn.amount >= 0 ? `+${txn.amount}` : txn.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TransactionsTable;
