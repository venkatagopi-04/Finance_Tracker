import React from 'react';
import './SummaryCards.css';

const SummaryCards = () => {
  // Placeholder values; replace with props or API call later
  const totalIncome = 7000;
  const totalExpenses = 4500;
  const balance = totalIncome - totalExpenses;

  return (
    <div className="summary-cards">
      <div className="card income">
        <h4>Total Income</h4>
        <p>${totalIncome.toLocaleString()}</p>
      </div>
      <div className="card expenses">
        <h4>Total Expenses</h4>
        <p>${totalExpenses.toLocaleString()}</p>
      </div>
      <div className="card balance">
        <h4>Balance</h4>
        <p>${balance.toLocaleString()}</p>
      </div>
    </div>
  );
};

export default SummaryCards;
