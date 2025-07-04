import React, { useState } from 'react';
import SummaryCards from '../components/SummaryCards';
import PieChartComponent from '../components/PieChart';
import LineChartComponent from '../components/LineChart';
import TransactionsTable from '../components/TransactionsTable';
import TransactionModal from '../components/TransactionModal';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="dashboard-container">
      <SummaryCards />

      <div className="dashboard-actions">
        <button className="add-btn" onClick={() => setShowModal(true)}>+ Add Transaction</button>
        <button className="upload-btn">Upload Receipt</button>
      </div>

      <div className="dashboard-charts">
        <div className="chart-box">
          <PieChartComponent />
        </div>
        <div className="chart-box">
          <LineChartComponent />
        </div>
      </div>

      <TransactionsTable />

      {/* 🔽 Transaction Form Popup */}
      <TransactionModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default Dashboard;
