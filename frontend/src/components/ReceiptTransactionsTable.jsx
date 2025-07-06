import React from 'react';
import './TransactionsTable.css';

const ReceiptTransactionsTable = ({ transactions = [] }) => {
  if (!transactions.length) return <div style={{marginTop: 24}}>No receipt transactions found.</div>;
  return (
    <div className="table-container" style={{marginTop: 24}}>
      <h4>Receipt Transactions</h4>
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
          {transactions.map((txn, index) => (
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
    </div>
  );
};

export default ReceiptTransactionsTable;
