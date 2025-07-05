// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

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

function LayoutWithSidebar({ children }) {
  const location = useLocation();

  // Don't show sidebar on /auth route
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
  return (
    <Router>
      <LayoutWithSidebar>
        <Routes>
          {/* Public route */}
          <Route path="/auth" element={<AuthPage />} />

          {/* Protected routes */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={
            <RequireAuth><Dashboard /></RequireAuth>
          } />
          <Route path="/add" element={
            <RequireAuth><AddTransaction /></RequireAuth>
          } />
          <Route path="/history" element={
            <RequireAuth><TransactionHistory /></RequireAuth>
          } />
          <Route path="/summary" element={
            <RequireAuth><SummaryGraphs /></RequireAuth>
          } />
          <Route path="/receipt" element={
            <RequireAuth><ReceiptUpload /></RequireAuth>
          } />
          <Route path="/settings" element={
            <RequireAuth><Settings /></RequireAuth>
          } />
          <Route path="/profile" element={
            <RequireAuth><Profile /></RequireAuth>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
      </LayoutWithSidebar>
    </Router>
  );
}

export default App;
