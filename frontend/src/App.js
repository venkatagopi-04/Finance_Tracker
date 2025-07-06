// src/App.js
// Main entry point for the React frontend application.
// Handles global layout, routing, summary state, and global toast notifications.

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import axios from './utils/axios';

import Sidebar from './components/Sidebar';
import AddTransaction from './pages/AddTransaction';
import TransactionHistory from './pages/TransactionHistory';
import SummaryGraphs from './pages/SummaryGraphs';
import ReceiptUpload from './pages/ReceiptUpload';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import AuthPage from './pages/AuthPage';
import RequireAuth from './utils/RequireAuth';
import ChatBot from './components/ChatBot';
import Toast from './components/Toast';

// Layout component that optionally shows the sidebar
function LayoutWithSidebar({ children }) {
  const location = useLocation();
  // Hide sidebar on the authentication page
  const hideSidebar = location.pathname === '/auth';
  return (
    <div style={{ display: 'flex' }}>
      {!hideSidebar && <Sidebar />}
      <div style={{ marginLeft: !hideSidebar ? '280px' : '0', padding: '20px', flex: 1 }}>
        {children}
      </div>
    </div>
  );
}

function App() {
  // Global summary state for ChatBot and dashboard
  const [summary, setSummary] = React.useState({});
  // Global toast notification state
  const [toast, setToast] = React.useState({ message: '', type: 'info' });

  // Fetch transactions and compute summary globally for dashboard and chatbot
  React.useEffect(() => {
    const fetchAndSummarize = async () => {
      try {
        const res = await axios.get('/transactions');
        const transactions = res.data || [];
        // Calculate summary values
        const totalIncome = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
        const totalExpenses = transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);
        const balance = totalIncome - totalExpenses;
        // Group by category
        const expensesByCategory = transactions.filter(t => t.amount < 0).reduce((acc, t) => {
          acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
          return acc;
        }, {});
        const incomeByCategory = transactions.filter(t => t.amount > 0).reduce((acc, t) => {
          acc[t.category] = (acc[t.category] || 0) + t.amount;
          return acc;
        }, {});
        setSummary({ totalIncome, totalExpenses, balance, expensesByCategory, incomeByCategory });
      } catch {
        setSummary({});
      }
    };
    fetchAndSummarize();
    // Listen for transactionAdded event to refresh summary after add/edit/delete
    const handler = () => fetchAndSummarize();
    window.addEventListener('transactionAdded', handler);
    return () => window.removeEventListener('transactionAdded', handler);
  }, []);

  // Make toast globally accessible via window.showToast
  React.useEffect(() => {
    window.showToast = (message, type = 'info') => {
      setToast({ message, type });
      setTimeout(() => setToast({ message: '', type: 'info' }), 3000);
    };
    return () => { window.showToast = undefined; };
  }, []);

  return (
    <Router>
      <LayoutWithSidebar>
        {/* Global toast notification */}
        <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'info' })} />
        <Routes>
          {/* Public route for authentication */}
          <Route path="/auth" element={<AuthPage />} />

          {/* Protected routes for main app features */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<RequireAuth><Dashboard setSummary={setSummary} /></RequireAuth>} />
          <Route path="/add" element={<RequireAuth><AddTransaction /></RequireAuth>} />
          <Route path="/history" element={<RequireAuth><TransactionHistory /></RequireAuth>} />
          <Route path="/summary" element={<RequireAuth><SummaryGraphs /></RequireAuth>} />
          <Route path="/receipt" element={<RequireAuth><ReceiptUpload /></RequireAuth>} />
          <Route path="/settings" element={<RequireAuth><Settings /></RequireAuth>} />
          <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />

          {/* Fallback route for unknown paths */}
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
        {/* Floating ChatBot assistant */}
        <ChatBot summary={summary} />
      </LayoutWithSidebar>
    </Router>
  );
}

export default App;
