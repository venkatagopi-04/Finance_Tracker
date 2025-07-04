// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Sidebar from './components/Sidebar';
import AddTransaction from './pages/AddTransaction';
import TransactionHistory from './pages/TransactionHistory';
import SummaryGraphs from './pages/SummaryGraphs';
import ReceiptUpload from './pages/ReceiptUpload';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div style={{ marginLeft: '300px', padding: '20px', flex: 1 }}>
          <Routes>
            <Route path="/add" element={<AddTransaction />} />
            <Route path="/history" element={<TransactionHistory />} />
            <Route path="/summary" element={<SummaryGraphs />} />
            <Route path="/receipt" element={<ReceiptUpload />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/dashboard" element={<Dashboard/>} />
            <Route path="*" element={<AddTransaction />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
