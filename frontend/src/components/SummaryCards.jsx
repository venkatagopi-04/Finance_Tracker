// SummaryCards.jsx - Displays summary cards for income, expenses, and balance
// Used on the dashboard for a quick financial overview

import React from 'react';
import './SummaryCards.css';

const currencySymbols = {
  INR: '\u20b9',
  USD: '$',
  FRW: 'FRw',
  OTHER: '\u00a4',
};

const SummaryCards = ({ totalIncome, totalExpenses, balance, currency = 'INR', onCurrencyChange }) => {
  // Get currency symbol for display
  const symbol = currencySymbols[currency] || currencySymbols.OTHER;
  return (
    <div className="summary-cards">
      {/* Income card */}
      <div className="card income">
        <h4>Total Income</h4>
        <p>{symbol}{totalIncome.toLocaleString()}</p>
      </div>
      {/* Expenses card */}
      <div className="card expenses">
        <h4>Total Expenses</h4>
        <p>{symbol}{totalExpenses.toLocaleString()}</p>
      </div>
      {/* Balance card */}
      <div className="card balance">
        <h4>Balance</h4>
        <p>{symbol}{balance.toLocaleString()}</p>
      </div>
      {/* Currency selector card removed as requested */}
    </div>
  );
};

export default SummaryCards;
