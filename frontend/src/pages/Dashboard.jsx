// Dashboard.jsx - Main dashboard page for the finance tracker app
// Shows summary cards, charts, recent transactions, and provides add/upload actions

import React, { useState, useEffect, useMemo } from 'react';
import SummaryCards from '../components/SummaryCards';
import PieChartComponent from '../components/PieChart';
import LineChartComponent from '../components/LineChart';
import TransactionsTable from '../components/TransactionsTable';
import TransactionModal from '../components/TransactionModal';
import ReceiptUploadButton from '../components/ReceiptUploadButton';
import axios from '../utils/axios';
import '../styles/Dashboard.css';

const Dashboard = ({ setSummary }) => {
  // State for modal, transactions, loading, error, and currency
  const [showModal, setShowModal] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Currency state and conversion rates for summary display
  const [currency, setCurrency] = useState('INR');
  const [conversionRates] = useState({ USD: 83, FRW: 0.021, OTHER: 1 }); // Example rates

  // Fetch all transactions on mount and when a transaction is added/edited/deleted
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/transactions');
        setTransactions(res.data);
      } catch (err) {
        setError('Failed to load transactions');
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
    // Listen for transactionAdded event to refresh data
    const handler = () => fetchTransactions();
    window.addEventListener('transactionAdded', handler);
    return () => window.removeEventListener('transactionAdded', handler);
  }, []);

  // Calculate summary data in INR for analytics and chatbot
  const totalIncomeINR = transactions.filter(t => t.amount > 0).reduce((sum, t) => {
    let amt = t.amount;
    if (t.currency && t.currency !== 'INR' && conversionRates[t.currency]) {
      amt = t.amount * conversionRates[t.currency];
    }
    return sum + amt;
  }, 0);
  const totalExpensesINR = transactions.filter(t => t.amount < 0).reduce((sum, t) => {
    let amt = Math.abs(t.amount);
    if (t.currency && t.currency !== 'INR' && conversionRates[t.currency]) {
      amt = Math.abs(t.amount) * conversionRates[t.currency];
    }
    return sum + amt;
  }, 0);
  const balanceINR = totalIncomeINR - totalExpensesINR;

  // Convert INR summary to selected currency for display
  const displayRate = currency === 'INR' ? 1 : (1 / (conversionRates[currency] || 1));
  const totalIncome = Math.round(totalIncomeINR * displayRate);
  const totalExpenses = Math.round(totalExpensesINR * displayRate);
  const balance = Math.round(balanceINR * displayRate);

  // Memoize category breakdowns for performance
  const expensesByCategory = useMemo(() =>
    transactions.filter(t => t.amount < 0).reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
      return acc;
    }, {}), [transactions]
  );
  const incomeByCategory = useMemo(() =>
    transactions.filter(t => t.amount > 0).reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {}), [transactions]
  );

  // Update global summary for ChatBot (always in INR)
  useEffect(() => {
    if (setSummary) {
      setSummary({
        totalIncome: totalIncomeINR,
        totalExpenses: totalExpensesINR,
        balance: balanceINR,
        expensesByCategory,
        incomeByCategory
      });
    }
  }, [setSummary, totalIncomeINR, totalExpensesINR, balanceINR, expensesByCategory, incomeByCategory]);

  // Pie chart data: group by category (expenses only)
  const pieData = Object.values(
    transactions.filter(t => t.amount < 0).reduce((acc, t) => {
      acc[t.category] = acc[t.category] || { name: t.category, value: 0 };
      acc[t.category].value += Math.abs(t.amount);
      return acc;
    }, {})
  );

  // Line chart data: group by month (expenses only)
  const lineData = (() => {
    const byMonth = {};
    transactions.filter(t => t.amount < 0).forEach(t => {
      const d = new Date(t.date);
      const month = d.toLocaleString('default', { month: 'short', year: '2-digit' });
      byMonth[month] = (byMonth[month] || 0) + Math.abs(t.amount);
    });
    return Object.entries(byMonth).map(([month, amount]) => ({ month, amount }));
  })();

  // Detect dark mode from body attribute (set by Sidebar) and re-render on theme change
  const [isDark, setIsDark] = useState(document.body.getAttribute('data-theme') === 'dark');
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.body.getAttribute('data-theme') === 'dark');
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  // Use CSS variables for background/text color to ensure all children inherit theme
  return (
    <div
      className="dashboard-container"
      style={{
        '--dashboard-bg': isDark ? '#181c1f' : '#fff',
        '--dashboard-text': isDark ? '#f5f5f5' : '#222',
        '--dashboard-card': isDark ? '#23272b' : '#fff',
        '--dashboard-border': isDark ? '#333' : '#e0e0e0',
        '--dashboard-shadow': isDark ? '0 2px 16px 0 rgba(0,0,0,0.25)' : '0 2px 16px 0 rgba(0,0,0,0.07)',
        background: 'var(--dashboard-bg)',
        color: 'var(--dashboard-text)',
        minHeight: '100vh',
        transition: 'background 0.3s, color 0.3s',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        padding: '40px 0',
      }}
    >
      <div style={{width: '100%', maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateRows: 'auto auto 1fr auto', gap: 32}}>
        {/* Summary cards for income, expenses, and balance */}
        <div style={{marginBottom: 8}}>
          <SummaryCards
            totalIncome={totalIncome}
            totalExpenses={totalExpenses}
            balance={balance}
            currency={currency}
            onCurrencyChange={setCurrency}
          />
        </div>

        {/* Centered action buttons for adding transactions and uploading receipts */}
        <div className="dashboard-actions" style={{display: 'flex', gap: 16, justifyContent: 'center', alignItems: 'center', margin: '0 0 8px 0', width: '100%'}}>
          <button className="add-btn" onClick={() => setShowModal(true)} style={{
            background: isDark ? 'var(--dashboard-card)' : '#f8b500',
            color: isDark ? '#ffe082' : '#222',
            border: isDark ? '1.5px solid #ffe082' : '1.5px solid #f8b500',
            borderRadius: 8,
            fontWeight: 700,
            fontSize: '1.08rem',
            letterSpacing: '0.01em',
            cursor: 'pointer',
            padding: '10px 22px',
            transition: 'background 0.2s, color 0.2s, border 0.2s',
          }}>+ Add Transaction</button>
          <ReceiptUploadButton />
        </div>

        {/* Charts for expenses by category and by month */}
        <div className="dashboard-charts" style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, width: '100%', marginBottom: 0}}>
          <div className="chart-box" style={{background: 'var(--dashboard-card)', borderRadius: 16, boxShadow: 'var(--dashboard-shadow)', padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300}}>
            <PieChartComponent data={pieData} />
          </div>
          <div className="chart-box" style={{background: 'var(--dashboard-card)', borderRadius: 16, boxShadow: 'var(--dashboard-shadow)', padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300}}>
            <LineChartComponent data={lineData} />
          </div>
        </div>

        {/* Recent transactions table */}
        <div style={{width: '100%', background: 'var(--dashboard-card)', borderRadius: 16, boxShadow: 'var(--dashboard-shadow)', padding: 24, margin: '32px 0 0 0'}}>
          <TransactionsTable transactions={transactions.slice(0, 10)} loading={loading} error={error} />
        </div>
      </div>

      {/* Transaction Form Popup for adding/editing transactions */}
      <TransactionModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default Dashboard;
