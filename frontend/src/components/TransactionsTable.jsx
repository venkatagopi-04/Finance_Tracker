import React from 'react';
import './TransactionsTable.css';

const data = [
  { date: 'Apr 5, 2025', description: 'Freelance work', category: 'Income', amount: 1500 },
  { date: 'Apr 3, 2025', description: 'Dining', category: 'Expense', amount: -500 },
  { date: 'Apr 2, 2025', description: 'Groceries', category: 'Food', amount: -100 },
  { date: 'Mar 25, 2025', description: 'Salary', category: 'Entertainment', amount: 3000 },
];

const TransactionsTable = () => {
  return (
    <div className="table-container">
      <h4>Recent Transactions</h4>
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
          {data.map((txn, index) => (
            <tr key={index}>
              <td>{txn.date}</td>
              <td>{txn.description}</td>
              <td>{txn.category}</td>
              <td style={{ color: txn.amount >= 0 ? 'green' : 'red' }}>
                {txn.amount >= 0 ? `+${txn.amount}` : txn.amount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsTable;
