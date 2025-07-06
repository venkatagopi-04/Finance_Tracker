import React from 'react';
import './SummaryCards.css';

const currencySymbols = {
  INR: '₹',
  USD: '$',
  FRW: 'FRw',
  OTHER: '¤',
};

const SummaryCards = ({ totalIncome, totalExpenses, balance, currency = 'INR', onCurrencyChange }) => {
  const symbol = currencySymbols[currency] || currencySymbols.OTHER;
  return (
    <div className="summary-cards">
      <div className="card income">
        <h4>Total Income</h4>
        <p>{symbol}{totalIncome.toLocaleString()}</p>
      </div>
      <div className="card expenses">
        <h4>Total Expenses</h4>
        <p>{symbol}{totalExpenses.toLocaleString()}</p>
      </div>
      <div className="card balance">
        <h4>Balance</h4>
        <p>{symbol}{balance.toLocaleString()}</p>
      </div>
      {/* Currency selector card removed as requested */}
    </div>
  );
};

export default SummaryCards;
