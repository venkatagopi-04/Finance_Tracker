// src/components/Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaHistory, FaChartPie, FaFileUpload, FaCog, FaUser } from 'react-icons/fa';

const Sidebar = () => {
  return (
    <div style={styles.sidebar}>
      <h2 style={styles.title}>Finance App</h2>
      <nav style={styles.nav}>
        <Link to="/dashboard" style={styles.link}><FaPlus />Dashboard</Link>
        
        <Link to="/history" style={styles.link}><FaHistory /> View History</Link>
        <Link to="/summary" style={styles.link}><FaChartPie /> Summary / Graphs</Link>
        <Link to="/receipt" style={styles.link}><FaFileUpload /> Receipt Upload</Link>
        <Link to="/settings" style={styles.link}><FaCog /> Settings</Link>
        <Link to="/profile" style={styles.link}><FaUser /> Profile</Link>
      </nav>
    </div>
  );
};

const styles = {
  sidebar: {
    width: '220px',
    height: '100vh',
    backgroundColor: '#1e1e2f',
    color: '#fff',
    padding: '20px',
    position: 'fixed',
    top: 0,
    left: 0,
  },
  title: {
    color: '#4fc3f7',
    marginBottom: '40px',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  }
};

export default Sidebar;
